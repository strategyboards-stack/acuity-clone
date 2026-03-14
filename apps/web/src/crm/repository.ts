import {
  clientExportPayloadSchema,
  clientImportPayloadSchema,
  clientRecordSchema,
  clientStateTransitionSchema,
  type ClientRecord,
  type ClientStateTransition
} from "@acuity/contracts";
import type {
  ClientActionAuditEntry,
  ClientCrmRepository,
  ClientLifecycleState,
  ImportResult
} from "./types";

const nowIso = (): string => new Date().toISOString();

const makeId = (prefix: string): string => `${prefix}_${Math.random().toString(36).slice(2, 11)}`;

function lifecycleFromClient(client: ClientRecord | undefined): ClientLifecycleState {
  if (!client) {
    return "deleted";
  }

  return client.isBanned ? "banned" : "active";
}

function csvEscape(value: string): string {
  const escaped = value.replaceAll('"', '""');
  return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
}

export class InMemoryClientCrmRepository implements ClientCrmRepository {
  private readonly clients = new Map<string, ClientRecord>();
  private readonly auditTrail: ClientActionAuditEntry[] = [];

  constructor(seed: ClientRecord[] = []) {
    for (const client of seed) {
      this.clients.set(client.id, clientRecordSchema.parse(client));
    }
  }

  listClients(): ClientRecord[] {
    return Array.from(this.clients.values()).sort((a, b) => a.lastName.localeCompare(b.lastName));
  }

  getClientById(clientId: string): ClientRecord | undefined {
    return this.clients.get(clientId);
  }

  upsertClients(rawPayload: unknown): ImportResult {
    const payload = clientImportPayloadSchema.parse(rawPayload);
    const invalidRows: Array<{ row: number; errors: string[] }> = [];
    const imported: ClientRecord[] = [];

    payload.rows.forEach((row, index) => {
      const errors: string[] = [];
      if (!row.email && !row.phone) {
        errors.push("at least one contact path (email or phone) is required");
      }

      if (errors.length > 0) {
        invalidRows.push({ row: index + 1, errors });
        return;
      }

      const existing = Array.from(this.clients.values()).find(
        (client) => client.email && row.email && client.email.toLowerCase() === row.email.toLowerCase()
      );

      const record = clientRecordSchema.parse({
        id: existing?.id ?? makeId("client"),
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        phone: row.phone,
        notes: row.notes,
        isBanned: existing?.isBanned ?? false,
        createdAt: existing?.createdAt ?? nowIso(),
        updatedAt: nowIso()
      });

      this.clients.set(record.id, record);
      imported.push(record);

      this.auditTrail.push({
        id: makeId("audit"),
        clientId: record.id,
        actorUserId: payload.actorUserId,
        action: "import-clients",
        beforeState: lifecycleFromClient(existing),
        afterState: lifecycleFromClient(record),
        reason: `Imported from ${payload.sourceFileName}`,
        metadata: { sourceFileName: payload.sourceFileName },
        createdAt: nowIso()
      });
    });

    return { imported, invalidRows };
  }

  banClient(clientId: string, actorUserId: string, reason: string): ClientStateTransition {
    return this.transitionClient(clientId, actorUserId, reason, "ban-client", "banned");
  }

  unbanClient(clientId: string, actorUserId: string, reason: string): ClientStateTransition {
    return this.transitionClient(clientId, actorUserId, reason, "unban-client", "active");
  }

  deleteClient(clientId: string, actorUserId: string, reason: string): ClientStateTransition {
    return this.transitionClient(clientId, actorUserId, reason, "delete-client", "deleted");
  }

  exportClientDetail(clientId: string): string {
    const client = this.getRequiredClient(clientId);
    const header = ["id", "first_name", "last_name", "email", "phone", "notes", "is_banned"];
    const row = [
      client.id,
      client.firstName,
      client.lastName,
      client.email ?? "",
      client.phone ?? "",
      client.notes,
      client.isBanned ? "true" : "false"
    ];

    this.auditTrail.push({
      id: makeId("audit"),
      clientId,
      actorUserId: "system",
      action: "export-client-detail",
      beforeState: lifecycleFromClient(client),
      afterState: lifecycleFromClient(client),
      reason: "Exported client detail",
      createdAt: nowIso()
    });

    return `${header.join(",")}\n${row.map(csvEscape).join(",")}`;
  }

  exportClients(rawPayload: unknown): string {
    const payload = clientExportPayloadSchema.parse(rawPayload);
    const header = ["id", "first_name", "last_name", "email", "phone", "notes", "is_banned"];
    const rows = this.listClients().filter((client) => {
      if (!payload.includeBanned && client.isBanned) {
        return false;
      }
      return true;
    });

    rows.forEach((client) => {
      this.auditTrail.push({
        id: makeId("audit"),
        clientId: client.id,
        actorUserId: payload.actorUserId,
        action: "export-clients",
        beforeState: lifecycleFromClient(client),
        afterState: lifecycleFromClient(client),
        reason: "Bulk export",
        createdAt: nowIso()
      });
    });

    const csvRows = rows.map((client) =>
      [
        client.id,
        client.firstName,
        client.lastName,
        client.email ?? "",
        client.phone ?? "",
        client.notes,
        client.isBanned ? "true" : "false"
      ]
        .map(csvEscape)
        .join(",")
    );

    return [header.join(","), ...csvRows].join("\n");
  }

  listAuditEntries(clientId?: string): ClientActionAuditEntry[] {
    return this.auditTrail
      .filter((entry) => (clientId ? entry.clientId === clientId : true))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  private transitionClient(
    clientId: string,
    actorUserId: string,
    reason: string,
    action: "ban-client" | "unban-client" | "delete-client",
    targetState: ClientLifecycleState
  ): ClientStateTransition {
    const existing = this.getRequiredClient(clientId);
    const fromState = lifecycleFromClient(existing);

    if (targetState === "banned") {
      existing.isBanned = true;
      existing.updatedAt = nowIso();
      this.clients.set(existing.id, existing);
    }

    if (targetState === "active") {
      existing.isBanned = false;
      existing.updatedAt = nowIso();
      this.clients.set(existing.id, existing);
    }

    if (targetState === "deleted") {
      this.clients.delete(clientId);
    }

    const transition = clientStateTransitionSchema.parse({
      clientId,
      fromState,
      toState: targetState,
      action,
      reason,
      actorUserId,
      occurredAt: nowIso()
    });

    this.auditTrail.push({
      id: makeId("audit"),
      clientId,
      actorUserId,
      action,
      beforeState: fromState,
      afterState: targetState,
      reason,
      createdAt: transition.occurredAt
    });

    return transition;
  }

  private getRequiredClient(clientId: string): ClientRecord {
    const client = this.clients.get(clientId);
    if (!client) {
      throw new Error(`Client ${clientId} does not exist.`);
    }

    return client;
  }
}

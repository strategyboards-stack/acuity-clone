import type {
  ClientExportPayload,
  ClientImportPayload,
  ClientRecord,
  ClientStateTransition,
  CrmActionType
} from "@acuity/contracts";

export type ClientLifecycleState = "active" | "banned" | "deleted";

export interface ClientActionAuditEntry {
  id: string;
  clientId: string;
  actorUserId: string;
  action: CrmActionType;
  beforeState: ClientLifecycleState;
  afterState: ClientLifecycleState;
  reason: string;
  metadata?: Record<string, string>;
  createdAt: string;
}

export interface CrmActionState {
  status: "idle" | "running" | "success" | "error";
  action: CrmActionType | null;
  message: string | null;
}

export interface ImportResult {
  imported: ClientRecord[];
  invalidRows: Array<{ row: number; errors: string[] }>;
}

export interface ClientCrmRepository {
  listClients(): ClientRecord[];
  getClientById(clientId: string): ClientRecord | undefined;
  upsertClients(payload: ClientImportPayload): ImportResult;
  banClient(clientId: string, actorUserId: string, reason: string): ClientStateTransition;
  unbanClient(clientId: string, actorUserId: string, reason: string): ClientStateTransition;
  deleteClient(clientId: string, actorUserId: string, reason: string): ClientStateTransition;
  exportClientDetail(clientId: string): string;
  exportClients(payload: ClientExportPayload): string;
  listAuditEntries(clientId?: string): ClientActionAuditEntry[];
}

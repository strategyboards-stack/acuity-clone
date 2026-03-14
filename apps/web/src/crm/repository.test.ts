import { describe, expect, it } from "vitest";
import { InMemoryClientCrmRepository } from "./repository";

const seedClient = {
  id: "client_1",
  firstName: "Rosa",
  lastName: "Diaz",
  email: "rosa@example.com",
  phone: "+14155550100",
  notes: "VIP",
  isBanned: false,
  createdAt: new Date("2026-01-01").toISOString(),
  updatedAt: new Date("2026-01-01").toISOString()
};

describe("InMemoryClientCrmRepository", () => {
  it("supports ban, unban and delete transitions with audit entries", () => {
    const repo = new InMemoryClientCrmRepository([seedClient]);

    const banned = repo.banClient("client_1", "admin_1", "chargeback");
    expect(banned.toState).toBe("banned");

    const unbanned = repo.unbanClient("client_1", "admin_1", "appeal accepted");
    expect(unbanned.toState).toBe("active");

    const deleted = repo.deleteClient("client_1", "admin_1", "privacy request");
    expect(deleted.toState).toBe("deleted");

    const trail = repo.listAuditEntries("client_1");
    expect(trail.map((entry) => entry.action)).toContain("ban-client");
    expect(trail.map((entry) => entry.action)).toContain("unban-client");
    expect(trail.map((entry) => entry.action)).toContain("delete-client");
  });

  it("collects invalid rows during import and continues importing valid rows", () => {
    const repo = new InMemoryClientCrmRepository();

    const result = repo.upsertClients({
      sourceFileName: "clients.csv",
      actorUserId: "admin_1",
      rows: [
        { firstName: "A", lastName: "Valid", email: "a@example.com" },
        { firstName: "B", lastName: "Invalid" }
      ]
    });

    expect(result.imported).toHaveLength(1);
    expect(result.invalidRows).toEqual([
      {
        row: 2,
        errors: ["at least one contact path (email or phone) is required"]
      }
    ]);
  });

  it("exports detail and bulk CSV payloads", () => {
    const repo = new InMemoryClientCrmRepository([seedClient]);

    const detailCsv = repo.exportClientDetail("client_1");
    expect(detailCsv).toContain("first_name");
    expect(detailCsv).toContain("Rosa");

    const exportCsv = repo.exportClients({
      actorUserId: "admin_1",
      includeBanned: true
    });
    expect(exportCsv.split("\n")).toHaveLength(2);
  });
});

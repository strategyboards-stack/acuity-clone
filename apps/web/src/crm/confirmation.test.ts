import { describe, expect, it } from "vitest";
import { CrmActionStateMachine } from "./action-state";
import { validateDestructiveConfirmation } from "./confirmation";

describe("destructive confirmations and action state", () => {
  it("requires action keyword for destructive confirmation", () => {
    const result = validateDestructiveConfirmation({
      clientId: "client_1",
      action: "delete-client",
      confirmed: true,
      confirmationText: "NOPE"
    });

    expect(result.valid).toBe(false);
    expect(result.error).toContain("Type DELETE");
  });

  it("tracks crm action-state transitions", () => {
    const machine = new CrmActionStateMachine();

    expect(machine.begin("ban-client").status).toBe("running");
    expect(machine.succeed("ban-client", "done").status).toBe("success");
    expect(machine.fail("import-clients", "invalid").status).toBe("error");
    expect(machine.reset().status).toBe("idle");
  });
});

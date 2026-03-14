import type { CrmActionState } from "./types";
import type { CrmActionType } from "@acuity/contracts";

export class CrmActionStateMachine {
  private state: CrmActionState = {
    status: "idle",
    action: null,
    message: null
  };

  begin(action: CrmActionType): CrmActionState {
    this.state = {
      status: "running",
      action,
      message: null
    };

    return this.state;
  }

  succeed(action: CrmActionType, message: string): CrmActionState {
    this.state = {
      status: "success",
      action,
      message
    };

    return this.state;
  }

  fail(action: CrmActionType, message: string): CrmActionState {
    this.state = {
      status: "error",
      action,
      message
    };

    return this.state;
  }

  reset(): CrmActionState {
    this.state = {
      status: "idle",
      action: null,
      message: null
    };

    return this.state;
  }

  snapshot(): CrmActionState {
    return this.state;
  }
}

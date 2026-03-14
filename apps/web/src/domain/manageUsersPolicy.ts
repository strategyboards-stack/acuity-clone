import type { ManageUsersAccessDecision, ManageUsersContext } from "../../../../packages/contracts/src/index.js";

export function evaluateManageUsersAccess(context: ManageUsersContext): ManageUsersAccessDecision {
  if (context.actorRole !== "owner") {
    return { canView: false, canInvite: false, canTransferOwnership: false, reason: "insufficient_role" };
  }
  if (context.plan === "trial") {
    return { canView: true, canInvite: false, canTransferOwnership: false, reason: "plan_locked" };
  }
  if (!context.dependencyReady) {
    return { canView: true, canInvite: false, canTransferOwnership: false, reason: "dependency_locked" };
  }
  if (context.verificationState !== "verified") {
    return { canView: true, canInvite: false, canTransferOwnership: false, reason: "verification_required" };
  }
  return { canView: true, canInvite: true, canTransferOwnership: true, reason: "ok" };
}

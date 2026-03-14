export type Role = "owner" | "admin" | "contributor";
export type PlanTier = "trial" | "standard" | "premium";
export type InvitationStatus = "not_sent" | "pending" | "accepted" | "expired" | "revoked";
export type VerificationState = "unverified" | "pending" | "verified";
export type AccessReason =
  | "ok"
  | "insufficient_role"
  | "plan_locked"
  | "verification_required"
  | "dependency_locked";

export type Invitation = {
  id: string;
  email: string;
  role: Role;
  status: InvitationStatus;
  verificationRequired: boolean;
  createdAtIso: string;
};

export type OwnershipState = {
  ownerUserId: string;
  ownerEmail: string;
  transferable: boolean;
};

export type ManageUsersContext = {
  actorRole: Role;
  plan: PlanTier;
  verificationState: VerificationState;
  dependencyReady: boolean;
};

export type ManageUsersAccessDecision = {
  canView: boolean;
  canInvite: boolean;
  canTransferOwnership: boolean;
  reason: AccessReason;
};

export function assertInvitation(input: Invitation): Invitation {
  if (!input.id || !input.email.includes("@") || !input.createdAtIso) {
    throw new Error("Invalid invitation payload");
  }
  return input;
}

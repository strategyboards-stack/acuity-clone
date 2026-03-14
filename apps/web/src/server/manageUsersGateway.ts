import type { Invitation, ManageUsersContext, OwnershipState } from "../../../../packages/contracts/src/index.js";

export type ManageUsersViewModel = {
  context: ManageUsersContext;
  ownership: OwnershipState;
  invitations: Invitation[];
  shellType: "host-permissions";
  routeBoundary: {
    hostShellRoute: "/host/manage-users";
    schedulingAdminRoute: "/admin/calendar";
  };
};

export function getManageUsersViewModel(): ManageUsersViewModel {
  return {
    context: {
      actorRole: "owner",
      plan: "standard",
      verificationState: "pending",
      dependencyReady: true
    },
    ownership: {
      ownerUserId: "owner-001",
      ownerEmail: "owner@acme.test",
      transferable: true
    },
    invitations: [
      {
        id: "inv-001",
        email: "contrib@acme.test",
        role: "contributor",
        status: "pending",
        verificationRequired: true,
        createdAtIso: "2026-01-01T00:00:00.000Z"
      }
    ],
    shellType: "host-permissions",
    routeBoundary: {
      hostShellRoute: "/host/manage-users",
      schedulingAdminRoute: "/admin/calendar"
    }
  };
}

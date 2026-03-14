import { evaluateManageUsersAccess } from "./domain/manageUsersPolicy.js";
import type { ManageUsersViewModel } from "./server/manageUsersGateway.js";

const stateCopy: Record<string, string> = {
  plan_locked: "Manage Users is unavailable on trial plans.",
  verification_required: "Verify your account to invite contributors.",
  insufficient_role: "Only the account owner can access this shell.",
  dependency_locked: "A required dependency is not ready.",
  ok: ""
};

export function renderManageUsersHtml(viewModel: ManageUsersViewModel): string {
  const access = evaluateManageUsersAccess(viewModel.context);
  const invites = viewModel.invitations.length
    ? `<ul>${viewModel.invitations
        .map(
          (invite) =>
            `<li>${invite.email} — ${invite.role} — ${invite.status}${
              invite.verificationRequired ? " (verification-gated)" : ""
            }</li>`
        )
        .join("")}</ul>`
    : "<p>No contributors invited yet.</p>";

  if (!access.canView) {
    return `<main><h1>Manage Users</h1><h2>Locked</h2><p>${stateCopy[access.reason]}</p></main>`;
  }

  return `
  <main style="font-family:sans-serif;max-width:860px;margin:0 auto;padding:24px;">
    <p style="color:#555">Host shell · Permissions & Ownership</p>
    <h1>Manage Users</h1>
    <p>Route boundary: <strong>${viewModel.routeBoundary.hostShellRoute}</strong> is separate from scheduling admin routes such as <strong>${viewModel.routeBoundary.schedulingAdminRoute}</strong>.</p>
    <section style="border:1px solid #ddd;border-radius:8px;padding:16px;margin-bottom:16px;">
      <h2>Ownership</h2>
      <p>Owner: ${viewModel.ownership.ownerEmail}</p>
      <button ${access.canTransferOwnership ? "" : "disabled"}>Transfer ownership (foundation)</button>
      ${!access.canTransferOwnership ? `<p>${stateCopy[access.reason]}</p>` : ""}
    </section>
    <section style="border:1px solid #ddd;border-radius:8px;padding:16px;">
      <h2>Contributors</h2>
      <button ${access.canInvite ? "" : "disabled"}>Invite contributor (foundation)</button>
      ${!access.canInvite ? `<p>${stateCopy[access.reason]}</p>` : ""}
      ${invites}
    </section>
  </main>`;
}

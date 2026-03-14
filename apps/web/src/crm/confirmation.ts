import { destructiveConfirmationSchema, type DestructiveConfirmation } from "@acuity/contracts";

const requiredTextByAction: Record<DestructiveConfirmation["action"], string> = {
  "ban-client": "BAN",
  "delete-client": "DELETE"
};

export function validateDestructiveConfirmation(payload: unknown): { valid: boolean; error?: string } {
  const parsed = destructiveConfirmationSchema.safeParse(payload);

  if (!parsed.success) {
    return { valid: false, error: parsed.error.issues[0]?.message ?? "Invalid confirmation payload" };
  }

  const { action, confirmed, confirmationText } = parsed.data;
  if (!confirmed) {
    return { valid: false, error: "Action must be explicitly confirmed." };
  }

  const requiredText = requiredTextByAction[action];
  if (confirmationText?.trim().toUpperCase() !== requiredText) {
    return { valid: false, error: `Type ${requiredText} to confirm ${action}.` };
  }

  return { valid: true };
}

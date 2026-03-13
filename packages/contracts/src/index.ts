import { z } from "zod";

export const roleSchema = z.enum(["owner", "admin", "contributor", "client"]);
export type Role = z.infer<typeof roleSchema>;

export const planSchema = z.enum(["free", "standard", "premium", "enterprise"]);
export type PlanTier = z.infer<typeof planSchema>;

export const dependencyStateSchema = z.object({
  paymentsConnected: z.boolean().default(false),
  emailVerified: z.boolean().default(false)
});

export const entitlementContextSchema = z.object({
  role: roleSchema,
  plan: planSchema,
  trialActive: z.boolean(),
  dependencies: dependencyStateSchema,
  verificationComplete: z.boolean()
});

export type EntitlementContext = z.infer<typeof entitlementContextSchema>;

export const featureKeySchema = z.enum([
  "host.manageUsers",
  "host.billing",
  "workspace.calendar",
  "workspace.integrations",
  "workspace.reports"
]);

export type FeatureKey = z.infer<typeof featureKeySchema>;

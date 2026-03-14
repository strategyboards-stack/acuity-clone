import { z } from "zod";

export const crmActionTypeSchema = z.enum([
  "ban-client",
  "unban-client",
  "delete-client",
  "export-client-detail",
  "import-clients",
  "export-clients"
]);

export const clientContactSchema = z
  .object({
    email: z.string().email().optional(),
    phone: z.string().min(6).optional()
  })
  .refine((contact) => Boolean(contact.email || contact.phone), {
    message: "Client requires at least one contact path"
  });

export const clientRecordSchema = z.object({
  id: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().min(6).optional(),
  notes: z.string().default(""),
  isBanned: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const clientStateTransitionSchema = z.object({
  clientId: z.string().min(1),
  fromState: z.enum(["active", "banned", "deleted"]),
  toState: z.enum(["active", "banned", "deleted"]),
  action: crmActionTypeSchema,
  reason: z.string().min(1),
  actorUserId: z.string().min(1),
  occurredAt: z.string().datetime()
});

export const clientImportRowSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email().optional(),
    phone: z.string().min(6).optional(),
    notes: z.string().default("")
  })
  .refine((row) => Boolean(row.email || row.phone), {
    message: "Client requires at least one contact path"
  });

export const clientImportPayloadSchema = z.object({
  rows: z.array(clientImportRowSchema),
  sourceFileName: z.string().min(1),
  actorUserId: z.string().min(1)
});

export const clientExportPayloadSchema = z.object({
  includeBanned: z.boolean().default(true),
  includeDeleted: z.boolean().default(false),
  actorUserId: z.string().min(1)
});

export const destructiveConfirmationSchema = z.object({
  clientId: z.string().min(1),
  action: z.enum(["ban-client", "delete-client"]),
  confirmed: z.boolean(),
  confirmationText: z.string().optional()
});

export type CrmActionType = z.infer<typeof crmActionTypeSchema>;
export type ClientRecord = z.infer<typeof clientRecordSchema>;
export type ClientStateTransition = z.infer<typeof clientStateTransitionSchema>;
export type ClientImportPayload = z.infer<typeof clientImportPayloadSchema>;
export type ClientImportRow = z.infer<typeof clientImportRowSchema>;
export type ClientExportPayload = z.infer<typeof clientExportPayloadSchema>;
export type DestructiveConfirmation = z.infer<typeof destructiveConfirmationSchema>;

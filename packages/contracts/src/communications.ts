export type StaffRole = "owner" | "admin" | "contributor";

export type PlanTier = "free" | "standard" | "premium";

export type TrialState = "none" | "active" | "expired";

export type VerificationState = "verified" | "unverified";

export type DeliveryChannel = "client_email" | "sms_reminder" | "admin_alert";

export type DeliveryStatus = "queued" | "skipped" | "delivered" | "failed";

export type AppointmentStatus = "scheduled" | "rescheduled" | "cancelled" | "completed";

export interface AppointmentAggregate {
  appointmentId: string;
  accountId: string;
  clientId: string;
  appointmentTypeId: string;
  startsAtIso: string;
  endsAtIso: string;
  status: AppointmentStatus;
}

export interface CommunicationsGateContext {
  role: StaffRole;
  plan: PlanTier;
  trial: TrialState;
  verification: VerificationState;
  dependencies: {
    appointmentsEnabled: boolean;
    smsReminderInfrastructureReady: boolean;
  };
}

export interface GatedSurfaceState {
  visible: boolean;
  editable: boolean;
  reasonCodes: string[];
}

export interface CommunicationsCapabilitySnapshot {
  clientEmails: GatedSurfaceState;
  smsReminders: GatedSurfaceState;
  adminAlerts: GatedSurfaceState;
}

export interface NotificationPreferenceState {
  accountId: string;
  userId: string;
  clientEmailsEnabled: boolean;
  smsRemindersEnabled: boolean;
  adminAlertsEnabled: boolean;
  updatedAtIso: string;
}

export interface DeliveryLogRecord {
  id: string;
  accountId: string;
  appointmentId: string;
  channel: DeliveryChannel;
  templateKey: string;
  status: DeliveryStatus;
  reason?: string;
  createdAtIso: string;
}

export interface CommunicationsTemplateRecord {
  templateKey: string;
  channel: DeliveryChannel;
  subject: string;
  body: string;
  active: boolean;
  updatedAtIso: string;
}

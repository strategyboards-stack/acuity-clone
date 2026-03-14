export type StaffRole = "owner" | "admin" | "contributor";
export type PlanTier = "free" | "standard" | "premium";
export type TrialState = "none" | "active" | "expired";
export type VerificationState = "verified" | "unverified";
export type DeliveryStatus = "queued" | "skipped" | "delivered" | "failed";

export interface AppointmentAggregate {
  appointmentId: string;
  accountId: string;
  clientId: string;
  appointmentTypeId: string;
  startsAtIso: string;
  endsAtIso: string;
  status: "scheduled" | "rescheduled" | "cancelled" | "completed";
}

export interface CommunicationsTemplateRecord {
  templateKey: string;
  channel: "client_email" | "sms_reminder" | "admin_alert";
  subject: string;
  body: string;
  active: boolean;
  updatedAtIso: string;
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
  channel: "client_email" | "sms_reminder" | "admin_alert";
  templateKey: string;
  status: DeliveryStatus;
  reason?: string;
  createdAtIso: string;
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

export interface DeliveryLogInput {
  accountId: string;
  appointment: AppointmentAggregate;
  channel: "client_email" | "sms_reminder" | "admin_alert";
  templateKey: string;
  status: DeliveryStatus;
  reason?: string;
}

export interface ReminderEvent {
  appointmentId: string;
  accountId: string;
  eventType: "reminder_due" | "follow_up_due";
  dueAtIso: string;
}

export interface ReminderPolicy {
  reminderHoursBefore: number;
  followUpHoursAfter: number;
}

export class CommunicationsGatingService {
  getCapabilities(context: CommunicationsGateContext): CommunicationsCapabilitySnapshot {
    const baseReasons: string[] = [];

    if (!context.dependencies.appointmentsEnabled) {
      baseReasons.push("appointments_dependency_missing");
    }

    if (context.verification !== "verified") {
      baseReasons.push("account_unverified");
    }

    const baseVisible = true;
    const baseEditable = baseReasons.length === 0;

    const smsReasons = [...baseReasons];
    if (context.plan === "free") {
      smsReasons.push("plan_upgrade_required_standard_or_higher");
    }
    if (!context.dependencies.smsReminderInfrastructureReady) {
      smsReasons.push("sms_dependency_missing");
    }

    return {
      clientEmails: {
        visible: baseVisible,
        editable: baseEditable,
        reasonCodes: baseReasons,
      },
      smsReminders: {
        visible: baseVisible,
        editable: smsReasons.length === 0,
        reasonCodes: smsReasons,
      },
      adminAlerts: {
        visible: baseVisible,
        editable: baseEditable,
        reasonCodes: baseReasons,
      },
    };
  }
}

export class CommunicationsTemplateService {
  private readonly templates = new Map<string, CommunicationsTemplateRecord>();

  upsertTemplate(template: Omit<CommunicationsTemplateRecord, "updatedAtIso">): CommunicationsTemplateRecord {
    const record: CommunicationsTemplateRecord = {
      ...template,
      updatedAtIso: new Date().toISOString(),
    };

    this.templates.set(this.key(template.channel, template.templateKey), record);
    return record;
  }

  listTemplates(channel?: CommunicationsTemplateRecord["channel"]): CommunicationsTemplateRecord[] {
    const list = Array.from(this.templates.values());
    return channel ? list.filter((template) => template.channel === channel) : list;
  }

  renderTemplate(template: CommunicationsTemplateRecord, data: Record<string, string>): { subject: string; body: string } {
    return {
      subject: interpolateTemplate(template.subject, data),
      body: interpolateTemplate(template.body, data),
    };
  }

  private key(channel: CommunicationsTemplateRecord["channel"], templateKey: string): string {
    return `${channel}:${templateKey}`;
  }
}

export class NotificationPreferenceService {
  private readonly preferences = new Map<string, NotificationPreferenceState>();

  getOrCreate(accountId: string, userId: string): NotificationPreferenceState {
    const key = this.key(accountId, userId);
    const existing = this.preferences.get(key);

    if (existing) {
      return existing;
    }

    const created: NotificationPreferenceState = {
      accountId,
      userId,
      clientEmailsEnabled: true,
      smsRemindersEnabled: false,
      adminAlertsEnabled: true,
      updatedAtIso: new Date().toISOString(),
    };

    this.preferences.set(key, created);
    return created;
  }

  update(
    accountId: string,
    userId: string,
    patch: Partial<Pick<NotificationPreferenceState, "clientEmailsEnabled" | "smsRemindersEnabled" | "adminAlertsEnabled">>,
  ): NotificationPreferenceState {
    const current = this.getOrCreate(accountId, userId);
    const updated: NotificationPreferenceState = {
      ...current,
      ...patch,
      updatedAtIso: new Date().toISOString(),
    };

    this.preferences.set(this.key(accountId, userId), updated);
    return updated;
  }

  private key(accountId: string, userId: string): string {
    return `${accountId}:${userId}`;
  }
}

export class DeliveryLogService {
  private readonly records: DeliveryLogRecord[] = [];

  create(input: DeliveryLogInput): DeliveryLogRecord {
    const recordBase = {
      id: globalThis.crypto.randomUUID(),
      accountId: input.accountId,
      appointmentId: input.appointment.appointmentId,
      channel: input.channel,
      templateKey: input.templateKey,
      status: input.status,
      createdAtIso: new Date().toISOString(),
    };

    const record: DeliveryLogRecord = input.reason
      ? { ...recordBase, reason: input.reason }
      : recordBase;

    this.records.push(record);
    return record;
  }

  listByAppointment(appointmentId: string): DeliveryLogRecord[] {
    return this.records.filter((record) => record.appointmentId === appointmentId);
  }
}

export class ReminderFollowUpFoundationService {
  getDueEvents(appointments: AppointmentAggregate[], policy: ReminderPolicy, now: Date): ReminderEvent[] {
    const nowMs = now.getTime();

    return appointments.flatMap((appointment) => {
      const startsAtMs = Date.parse(appointment.startsAtIso);
      const endsAtMs = Date.parse(appointment.endsAtIso);

      const reminderDueMs = startsAtMs - policy.reminderHoursBefore * 60 * 60 * 1000;
      const followUpDueMs = endsAtMs + policy.followUpHoursAfter * 60 * 60 * 1000;

      const events: ReminderEvent[] = [];
      if (appointment.status === "scheduled" || appointment.status === "rescheduled") {
        if (reminderDueMs <= nowMs) {
          events.push({
            appointmentId: appointment.appointmentId,
            accountId: appointment.accountId,
            eventType: "reminder_due",
            dueAtIso: new Date(reminderDueMs).toISOString(),
          });
        }

        if (followUpDueMs <= nowMs) {
          events.push({
            appointmentId: appointment.appointmentId,
            accountId: appointment.accountId,
            eventType: "follow_up_due",
            dueAtIso: new Date(followUpDueMs).toISOString(),
          });
        }
      }

      return events;
    });
  }
}

function interpolateTemplate(value: string, data: Record<string, string>): string {
  return value.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, token: string) => data[token] ?? "");
}

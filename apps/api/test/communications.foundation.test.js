import assert from "node:assert/strict";
import test from "node:test";

import {
  CommunicationsGatingService,
  CommunicationsTemplateService,
  DeliveryLogService,
  NotificationPreferenceService,
  ReminderFollowUpFoundationService,
} from "../dist/index.js";

const scheduledAppointment = {
  appointmentId: "apt_1",
  accountId: "acct_1",
  clientId: "client_1",
  appointmentTypeId: "type_1",
  startsAtIso: "2026-03-20T14:00:00.000Z",
  endsAtIso: "2026-03-20T15:00:00.000Z",
  status: "scheduled",
};

test("keeps channel gating separate", () => {
  const service = new CommunicationsGatingService();
  const snapshot = service.getCapabilities({
    role: "owner",
    plan: "free",
    trial: "active",
    verification: "verified",
    dependencies: {
      appointmentsEnabled: true,
      smsReminderInfrastructureReady: false,
    },
  });

  assert.equal(snapshot.clientEmails.editable, true);
  assert.equal(snapshot.adminAlerts.editable, true);
  assert.equal(snapshot.smsReminders.editable, false);
  assert(snapshot.smsReminders.reasonCodes.includes("plan_upgrade_required_standard_or_higher"));
  assert(snapshot.smsReminders.reasonCodes.includes("sms_dependency_missing"));
});

test("renders template foundations", () => {
  const templates = new CommunicationsTemplateService();
  const record = templates.upsertTemplate({
    templateKey: "appointment_reminder",
    channel: "client_email",
    subject: "Reminder for {{client_name}}",
    body: "See you at {{start_time}}",
    active: true,
  });

  const rendered = templates.renderTemplate(record, {
    client_name: "Morgan",
    start_time: "2:00 PM",
  });

  assert.equal(rendered.subject, "Reminder for Morgan");
  assert.equal(rendered.body, "See you at 2:00 PM");
  assert.equal(templates.listTemplates("client_email").length, 1);
});

test("stores preferences and delivery logs", () => {
  const preferences = new NotificationPreferenceService();
  const log = new DeliveryLogService();

  const defaultPreference = preferences.getOrCreate("acct_1", "user_1");
  assert.equal(defaultPreference.clientEmailsEnabled, true);
  assert.equal(defaultPreference.smsRemindersEnabled, false);

  const updated = preferences.update("acct_1", "user_1", { smsRemindersEnabled: true });
  assert.equal(updated.smsRemindersEnabled, true);

  const entry = log.create({
    accountId: "acct_1",
    appointment: scheduledAppointment,
    channel: "admin_alert",
    templateKey: "appointment_created_admin",
    status: "queued",
  });

  assert.equal(entry.appointmentId, "apt_1");
  assert.equal(log.listByAppointment("apt_1").length, 1);
});

test("derives reminder and follow-up due events", () => {
  const reminders = new ReminderFollowUpFoundationService();

  const events = reminders.getDueEvents(
    [scheduledAppointment],
    { reminderHoursBefore: 24, followUpHoursAfter: 1 },
    new Date("2026-03-20T16:30:00.000Z"),
  );

  assert.deepEqual(
    events.map((event) => event.eventType).sort(),
    ["follow_up_due", "reminder_due"],
  );
  assert(events.every((event) => event.appointmentId === "apt_1"));
});

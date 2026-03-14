import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { Appointment } from "../src/domain/appointment";
import {
  type AdminAuthContext,
  type AppointmentRepository,
  AdminCalendarActionsService,
} from "../src/services/admin-calendar-actions-service";

class InMemoryAppointmentRepository implements AppointmentRepository {
  private readonly appointments = new Map<string, Appointment>();

  async getById(appointmentId: string): Promise<Appointment | null> {
    return this.appointments.get(appointmentId) ?? null;
  }

  async save(appointment: Appointment): Promise<void> {
    this.appointments.set(appointment.snapshot.id, appointment);
  }

  async createBlock(input: {
    id: string;
    accountId: string;
    calendarId: string;
    startsAt: string;
    endsAt: string;
    reason: string;
    actorId: string;
  }): Promise<Appointment> {
    const appointment = Appointment.createScheduled({
      id: input.id,
      accountId: input.accountId,
      calendarId: input.calendarId,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
    });
    this.appointments.set(input.id, appointment);
    return appointment;
  }

  seed(appointment: Appointment): void {
    this.appointments.set(appointment.snapshot.id, appointment);
  }
}

const auth: AdminAuthContext = {
  actorId: randomUUID(),
  role: "admin",
  plan: "standard",
  trialState: "active",
  dependencyState: "healthy",
  verified: true,
};

test("blocks off time and records audit events", async () => {
  const repository = new InMemoryAppointmentRepository();
  const service = new AdminCalendarActionsService(repository);

  const result = await service.blockOffTime("acct-1", auth, {
    calendarId: randomUUID(),
    startsAt: "2026-01-01T10:00:00.000Z",
    endsAt: "2026-01-01T11:00:00.000Z",
    reason: "Staff meeting",
    confirmation: { confirmed: true, confirmationText: "confirm" },
  });

  assert.equal(result.sidePanelToast, "Time blocked off successfully.");
  assert.equal(result.auditTrail.at(-1)?.type, "block.created");
});

test("cancels appointment with side panel completion payload", async () => {
  const repository = new InMemoryAppointmentRepository();
  const appointment = Appointment.createScheduled({
    id: randomUUID(),
    accountId: "acct-1",
    calendarId: randomUUID(),
    startsAt: "2026-01-01T10:00:00.000Z",
    endsAt: "2026-01-01T11:00:00.000Z",
  });
  repository.seed(appointment);

  const service = new AdminCalendarActionsService(repository);

  const result = await service.cancelAppointment(auth, {
    appointmentId: appointment.snapshot.id,
    reason: "Client requested cancellation",
    sendClientEmail: true,
    confirmation: { confirmed: true, confirmationText: "confirm" },
  });

  assert.equal(result.appointment.status, "canceled");
  assert.equal(result.sidePanelToast, "Appointment canceled.");
});

test("marks no-show and reschedules through the same aggregate", async () => {
  const repository = new InMemoryAppointmentRepository();
  const appointment = Appointment.createScheduled({
    id: randomUUID(),
    accountId: "acct-1",
    calendarId: randomUUID(),
    startsAt: "2026-01-01T10:00:00.000Z",
    endsAt: "2026-01-01T11:00:00.000Z",
  });
  repository.seed(appointment);

  const service = new AdminCalendarActionsService(repository);

  const noShowResult = await service.markNoShow(auth, {
    appointmentId: appointment.snapshot.id,
    notes: "Client did not arrive.",
    confirmation: { confirmed: true, confirmationText: "confirm" },
  });

  assert.equal(noShowResult.appointment.status, "no_show");
  assert.equal(noShowResult.auditTrail.at(-1)?.type, "appointment.no_show");

  const rescheduled = await service.rescheduleAppointment(auth, {
    appointmentId: appointment.snapshot.id,
    startsAt: "2026-01-02T10:00:00.000Z",
    endsAt: "2026-01-02T11:00:00.000Z",
    reason: "Manual reschedule",
    confirmation: { confirmed: true, confirmationText: "confirm" },
  });

  assert.equal(rescheduled.appointment.startsAt, "2026-01-02T10:00:00.000Z");
  assert.equal(rescheduled.auditTrail.at(-1)?.type, "appointment.rescheduled");
});

test("enforces destructive confirmation and auth gating", async () => {
  const repository = new InMemoryAppointmentRepository();
  const service = new AdminCalendarActionsService(repository);

  await assert.rejects(
    service.blockOffTime("acct-1", { ...auth, verified: false }, {
      calendarId: randomUUID(),
      startsAt: "2026-01-01T10:00:00.000Z",
      endsAt: "2026-01-01T11:00:00.000Z",
      reason: "System maintenance",
      confirmation: { confirmed: true, confirmationText: "confirm" },
    }),
    /Admin verification required/,
  );

  await assert.rejects(
    service.blockOffTime("acct-1", auth, {
      calendarId: randomUUID(),
      startsAt: "2026-01-01T10:00:00.000Z",
      endsAt: "2026-01-01T11:00:00.000Z",
      reason: "System maintenance",
      confirmation: { confirmed: true, confirmationText: "wrong" },
    }),
    /Destructive action confirmation failed/,
  );
});

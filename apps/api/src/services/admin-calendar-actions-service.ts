import { randomUUID } from "node:crypto";
import {
  type BlockOffTimeRequest,
  type CancelAppointmentRequest,
  type NoShowAppointmentRequest,
  type RescheduleAppointmentRequest,
  validateBlockOffTimeRequest,
  validateCancelAppointmentRequest,
  validateNoShowAppointmentRequest,
  validateRescheduleAppointmentRequest,
} from "../../../../packages/contracts/src/admin-calendar-actions";
import { Appointment } from "../domain/appointment";

export interface AdminAuthContext {
  actorId: string;
  role: "owner" | "admin" | "contributor";
  plan: "starter" | "standard" | "premium";
  trialState: "trial" | "active";
  dependencyState: "healthy" | "degraded";
  verified: boolean;
}

export interface AppointmentRepository {
  getById(appointmentId: string): Promise<Appointment | null>;
  save(appointment: Appointment): Promise<void>;
  createBlock(input: {
    id: string;
    accountId: string;
    calendarId: string;
    startsAt: string;
    endsAt: string;
    reason: string;
    actorId: string;
  }): Promise<Appointment>;
}

export interface ActionResult {
  appointment: import("../domain/appointment").AppointmentProps;
  sidePanelToast: string;
  auditTrail: import("../domain/appointment").AppointmentAuditEvent[];
}

export class AdminCalendarActionsService {
  constructor(private readonly repository: AppointmentRepository) {}

  async blockOffTime(accountId: string, auth: AdminAuthContext, request: BlockOffTimeRequest): Promise<ActionResult> {
    this.assertActionAllowed(auth);
    const parsed = validateBlockOffTimeRequest(request);
    this.assertTemporalRange(parsed.startsAt, parsed.endsAt);

    const block = await this.repository.createBlock({
      id: randomUUID(),
      accountId,
      calendarId: parsed.calendarId,
      startsAt: parsed.startsAt,
      endsAt: parsed.endsAt,
      reason: parsed.reason,
      actorId: auth.actorId,
    });

    block.recordBlock(auth.actorId, parsed.reason);
    await this.repository.save(block);

    return {
      appointment: block.snapshot,
      sidePanelToast: "Time blocked off successfully.",
      auditTrail: block.events,
    };
  }

  async cancelAppointment(auth: AdminAuthContext, request: CancelAppointmentRequest): Promise<ActionResult> {
    this.assertActionAllowed(auth);
    const parsed = validateCancelAppointmentRequest(request);
    const appointment = await this.loadAppointment(parsed.appointmentId);

    appointment.cancel(auth.actorId, parsed.reason, parsed.sendClientEmail);
    await this.repository.save(appointment);

    return {
      appointment: appointment.snapshot,
      sidePanelToast: "Appointment canceled.",
      auditTrail: appointment.events,
    };
  }

  async markNoShow(auth: AdminAuthContext, request: NoShowAppointmentRequest): Promise<ActionResult> {
    this.assertActionAllowed(auth);
    const parsed = validateNoShowAppointmentRequest(request);
    const appointment = await this.loadAppointment(parsed.appointmentId);

    appointment.markNoShow(auth.actorId, parsed.notes);
    await this.repository.save(appointment);

    return {
      appointment: appointment.snapshot,
      sidePanelToast: "Appointment marked as no-show.",
      auditTrail: appointment.events,
    };
  }

  async rescheduleAppointment(auth: AdminAuthContext, request: RescheduleAppointmentRequest): Promise<ActionResult> {
    this.assertActionAllowed(auth);
    const parsed = validateRescheduleAppointmentRequest(request);
    this.assertTemporalRange(parsed.startsAt, parsed.endsAt);

    const appointment = await this.loadAppointment(parsed.appointmentId);
    appointment.reschedule(auth.actorId, parsed.startsAt, parsed.endsAt, parsed.reason);
    await this.repository.save(appointment);

    return {
      appointment: appointment.snapshot,
      sidePanelToast: "Appointment rescheduled.",
      auditTrail: appointment.events,
    };
  }

  private async loadAppointment(id: string): Promise<Appointment> {
    const appointment = await this.repository.getById(id);
    if (!appointment) {
      throw new Error("Appointment not found.");
    }

    return appointment;
  }

  private assertActionAllowed(auth: AdminAuthContext): void {
    if (!auth.verified) {
      throw new Error("Admin verification required for destructive action.");
    }

    if (auth.role === "contributor") {
      throw new Error("Contributor role cannot perform admin destructive actions.");
    }

    if (auth.dependencyState !== "healthy") {
      throw new Error("Action blocked due to dependency state.");
    }
  }

  private assertTemporalRange(startsAt: string, endsAt: string): void {
    if (new Date(startsAt).getTime() >= new Date(endsAt).getTime()) {
      throw new Error("Invalid time range.");
    }
  }
}

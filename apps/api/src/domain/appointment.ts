import { randomUUID } from "node:crypto";
import type { AppointmentStatus } from "../../../../packages/contracts/src/admin-calendar-actions";

export type AppointmentAuditEventType =
  | "appointment.created"
  | "appointment.canceled"
  | "appointment.no_show"
  | "appointment.rescheduled"
  | "block.created";

export interface AppointmentAuditEvent {
  id: string;
  type: AppointmentAuditEventType;
  at: string;
  actorId: string;
  appointmentId: string;
  details: Record<string, string | boolean>;
}

export interface AppointmentProps {
  id: string;
  accountId: string;
  calendarId: string;
  startsAt: string;
  endsAt: string;
  status: AppointmentStatus;
  updatedAt: string;
  cancellationReason?: string;
  noShowNotes?: string;
}

export class Appointment {
  private props: AppointmentProps;

  private readonly auditEvents: AppointmentAuditEvent[];

  constructor(props: AppointmentProps, auditEvents: AppointmentAuditEvent[] = []) {
    this.props = { ...props };
    this.auditEvents = [...auditEvents];
  }

  static createScheduled(input: Omit<AppointmentProps, "status" | "updatedAt">): Appointment {
    const now = new Date().toISOString();
    const appointment = new Appointment({
      ...input,
      status: "scheduled",
      updatedAt: now,
    });

    appointment.recordEvent("appointment.created", input.id, "system", {
      startsAt: input.startsAt,
      endsAt: input.endsAt,
    });

    return appointment;
  }

  get snapshot(): AppointmentProps {
    return { ...this.props };
  }

  get events(): AppointmentAuditEvent[] {
    return [...this.auditEvents];
  }

  cancel(actorId: string, reason: string, sendClientEmail: boolean): void {
    this.assertMutableState("canceled");
    this.props.status = "canceled";
    this.props.cancellationReason = reason;
    this.props.updatedAt = new Date().toISOString();
    this.recordEvent("appointment.canceled", this.props.id, actorId, {
      reason,
      sendClientEmail,
    });
  }

  markNoShow(actorId: string, notes: string): void {
    this.assertMutableState("no_show");
    this.props.status = "no_show";
    this.props.noShowNotes = notes;
    this.props.updatedAt = new Date().toISOString();
    this.recordEvent("appointment.no_show", this.props.id, actorId, { notes });
  }

  reschedule(actorId: string, startsAt: string, endsAt: string, reason: string): void {
    this.assertMutableState("rescheduled");
    this.props.startsAt = startsAt;
    this.props.endsAt = endsAt;
    this.props.updatedAt = new Date().toISOString();
    this.recordEvent("appointment.rescheduled", this.props.id, actorId, {
      startsAt,
      endsAt,
      reason,
    });
  }

  recordBlock(actorId: string, reason: string): void {
    this.recordEvent("block.created", this.props.id, actorId, { reason });
  }

  private recordEvent(
    type: AppointmentAuditEventType,
    appointmentId: string,
    actorId: string,
    details: Record<string, string | boolean>,
  ): void {
    this.auditEvents.push({
      id: randomUUID(),
      type,
      at: new Date().toISOString(),
      actorId,
      appointmentId,
      details,
    });
  }

  private assertMutableState(action: "canceled" | "no_show" | "rescheduled"): void {
    if (this.props.status === "completed") {
      throw new Error(`Cannot apply ${action} to completed appointment.`);
    }

    if (this.props.status === "canceled" && action !== "rescheduled") {
      throw new Error(`Cannot apply ${action} to canceled appointment.`);
    }
  }
}

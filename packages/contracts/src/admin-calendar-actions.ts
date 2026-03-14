export type AppointmentStatus = "scheduled" | "canceled" | "no_show" | "completed";

export interface DestructiveActionConfirmation {
  confirmed: boolean;
  confirmationText: string;
}

export interface BlockOffTimeRequest {
  calendarId: string;
  startsAt: string;
  endsAt: string;
  reason: string;
  confirmation: DestructiveActionConfirmation;
}

export interface CancelAppointmentRequest {
  appointmentId: string;
  reason: string;
  sendClientEmail: boolean;
  confirmation: DestructiveActionConfirmation;
}

export interface NoShowAppointmentRequest {
  appointmentId: string;
  notes: string;
  confirmation: DestructiveActionConfirmation;
}

export interface RescheduleAppointmentRequest {
  appointmentId: string;
  startsAt: string;
  endsAt: string;
  reason: string;
  confirmation: DestructiveActionConfirmation;
}

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function assertUUID(value: string, field: string): void {
  if (!uuidRegex.test(value)) {
    throw new Error(`${field} must be a UUID.`);
  }
}

function assertISODate(value: string, field: string): void {
  if (Number.isNaN(Date.parse(value))) {
    throw new Error(`${field} must be an ISO datetime.`);
  }
}

function assertText(value: string, field: string): void {
  if (!value || !value.trim()) {
    throw new Error(`${field} is required.`);
  }
}

function assertConfirmation(confirmation: DestructiveActionConfirmation): void {
  if (!confirmation.confirmed || confirmation.confirmationText.trim().toLowerCase() !== "confirm") {
    throw new Error("Destructive action confirmation failed.");
  }
}

export function validateBlockOffTimeRequest(request: BlockOffTimeRequest): BlockOffTimeRequest {
  assertUUID(request.calendarId, "calendarId");
  assertISODate(request.startsAt, "startsAt");
  assertISODate(request.endsAt, "endsAt");
  assertText(request.reason, "reason");
  assertConfirmation(request.confirmation);
  return request;
}

export function validateCancelAppointmentRequest(request: CancelAppointmentRequest): CancelAppointmentRequest {
  assertUUID(request.appointmentId, "appointmentId");
  assertText(request.reason, "reason");
  assertConfirmation(request.confirmation);
  return request;
}

export function validateNoShowAppointmentRequest(request: NoShowAppointmentRequest): NoShowAppointmentRequest {
  assertUUID(request.appointmentId, "appointmentId");
  assertText(request.notes, "notes");
  assertConfirmation(request.confirmation);
  return request;
}

export function validateRescheduleAppointmentRequest(
  request: RescheduleAppointmentRequest,
): RescheduleAppointmentRequest {
  assertUUID(request.appointmentId, "appointmentId");
  assertISODate(request.startsAt, "startsAt");
  assertISODate(request.endsAt, "endsAt");
  assertText(request.reason, "reason");
  assertConfirmation(request.confirmation);
  return request;
}

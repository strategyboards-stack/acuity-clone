export interface Appointment {
  id: string;
  startsAtIso: string;
  serviceSlug: string;
}

export const isAppointment = (value: unknown): value is Appointment => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.startsAtIso === "string" &&
    typeof candidate.serviceSlug === "string"
  );
};

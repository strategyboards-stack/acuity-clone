export type SelfServiceAction = "edit" | "reschedule" | "cancel";

export type AppointmentSummary = {
  id: string;
  serviceName: string;
  startsAtIso: string;
  canEdit: boolean;
  canReschedule: boolean;
  canCancel: boolean;
};

export type ClientRouteKey =
  | "client.login"
  | "client.appointments"
  | "client.manageCodes"
  | "client.appointmentActions";

export type RouteDefinition = {
  key: ClientRouteKey;
  pathname: string;
  mobileParity: true;
};

export const CLIENT_SELF_SERVICE_ROUTES: RouteDefinition[] = [
  { key: "client.login", pathname: "/client/login", mobileParity: true },
  { key: "client.appointments", pathname: "/client/appointments", mobileParity: true },
  { key: "client.manageCodes", pathname: "/client/manage-codes", mobileParity: true },
  { key: "client.appointmentActions", pathname: "/appointments/:appointmentId/actions", mobileParity: true },
];

export function getConfirmationActions(appointment: AppointmentSummary): SelfServiceAction[] {
  const actions: SelfServiceAction[] = [];
  if (appointment.canEdit) actions.push("edit");
  if (appointment.canReschedule) actions.push("reschedule");
  if (appointment.canCancel) actions.push("cancel");
  return actions;
}

export function isSelfServiceRoute(pathname: string): boolean {
  return pathname.startsWith("/client/") || pathname.startsWith("/appointments/");
}

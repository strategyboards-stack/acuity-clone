export const PLAN_TIERS = ["free", "standard", "premium", "enterprise", "legacy_powerhouse"];
export const ROLES = ["owner", "admin", "contributor"];

export const PROVIDER_CONNECTION_STATES = [
  "never_connected",
  "connected",
  "disconnected",
  "action_required",
  "reauth_required",
  "error"
];

export const INTEGRATION_PROVIDERS = [
  "google_analytics",
  "zoho_flow",
  "zapier",
  "google_calendar",
  "icloud",
  "office365",
  "exchange",
  "outlook_com",
  "one_way_ics_publication"
];

export const CONNECTION_DIRECTIONS = ["two_way_sync", "one_way_publish"];

export const WEBHOOK_EVENT_TYPES = [
  "appointment_new",
  "appointment_rescheduled",
  "appointment_canceled",
  "appointment_updated",
  "order_completed"
];

function assertIn(value, allowed, label) {
  if (!allowed.includes(value)) {
    throw new Error(`${label} is invalid: ${value}`);
  }
}

export function validateIntegrationGateContext(context) {
  assertIn(context.role, ROLES, "role");
  assertIn(context.plan, PLAN_TIERS, "plan");
  if (typeof context.trialActive !== "boolean") throw new Error("trialActive must be boolean");
  if (typeof context.dependencyReady !== "boolean") throw new Error("dependencyReady must be boolean");
  assertIn(context.verificationState, ["verified", "unverified"], "verificationState");
  return context;
}

export function validateWebhookEndpoint(endpoint) {
  assertIn(endpoint.eventType, WEBHOOK_EVENT_TYPES, "eventType");
  if (typeof endpoint.targetUrl !== "string" || !endpoint.targetUrl.startsWith("http")) {
    throw new Error("targetUrl must be an absolute URL");
  }
  if (typeof endpoint.enabled !== "boolean") throw new Error("enabled must be boolean");
  return endpoint;
}

export function validateInternalDomainEvent(event) {
  assertIn(event.eventName, ["appointment.created", "appointment.rescheduled", "appointment.canceled", "order.completed"], "eventName");
  if (typeof event.aggregateId !== "string") throw new Error("aggregateId must be string");
  if (typeof event.occurredAt !== "string") throw new Error("occurredAt must be ISO string");
  if (typeof event.payload !== "object" || event.payload === null) throw new Error("payload must be object");
  return event;
}

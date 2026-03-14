import {
  PROVIDER_CONNECTION_STATES,
  validateIntegrationGateContext,
  validateInternalDomainEvent,
  validateWebhookEndpoint
} from "@acuity/contracts";

export class IntegrationFoundationService {
  evaluateHub(context) {
    const gateContext = validateIntegrationGateContext(context);

    return {
      gate: this.#evaluateBaseGate(gateContext),
      apiCredentials: this.#evaluateApiCredentialsGate(gateContext),
      webhooks: this.#evaluateWebhookGate(gateContext),
      analyticsAndCustomIntegrations: this.#evaluateDeveloperSurfaceGate(gateContext),
      calendarSync: this.#evaluateCalendarSyncGate(gateContext),
      oneWayIcsPublication: {
        feature: "one_way_ics_publication",
        enabled: true,
        reasons: ["one-way publication is always distinct from two-way calendar sync"]
      },
      adapterBoundaryNote:
        "Integrations subscribe to internal domain events; they do not own booking-core state transitions."
    };
  }

  listProviderStates() {
    return [...PROVIDER_CONNECTION_STATES];
  }

  validateWebhookEndpoints(endpoints) {
    return endpoints.map((endpoint) => validateWebhookEndpoint(endpoint));
  }

  defaultDeveloperSurfaceConfig() {
    return {
      customSidebarHtml: "",
      customConversionTrackingHtml: ""
    };
  }

  defaultApiCredentialState(userId) {
    return {
      userId,
      apiKeyPreview: "••••••••",
      lastRotatedAt: null,
      canReset: true
    };
  }

  getCalendarSyncFoundation() {
    return [
      { provider: "google_calendar", direction: "two_way_sync", state: "never_connected", calendarMappingConfigured: false, availabilityBlockingEnabled: false },
      { provider: "icloud", direction: "two_way_sync", state: "never_connected", calendarMappingConfigured: false, availabilityBlockingEnabled: false },
      { provider: "office365", direction: "two_way_sync", state: "never_connected", calendarMappingConfigured: false, availabilityBlockingEnabled: false },
      { provider: "exchange", direction: "two_way_sync", state: "never_connected", calendarMappingConfigured: false, availabilityBlockingEnabled: false },
      { provider: "outlook_com", direction: "two_way_sync", state: "never_connected", calendarMappingConfigured: false, availabilityBlockingEnabled: false },
      { provider: "one_way_ics_publication", direction: "one_way_publish", state: "never_connected", calendarMappingConfigured: false, availabilityBlockingEnabled: false }
    ];
  }

  buildAdapterDispatchPlan(event) {
    const validatedEvent = validateInternalDomainEvent(event);

    if (["appointment.created", "appointment.rescheduled", "appointment.canceled"].includes(validatedEvent.eventName)) {
      return {
        sourceEvent: validatedEvent.eventName,
        adapters: ["webhook", "analytics", "calendar_sync"],
        mode: "internal-event-fanout"
      };
    }

    if (validatedEvent.eventName === "order.completed") {
      return {
        sourceEvent: validatedEvent.eventName,
        adapters: ["webhook", "analytics"],
        mode: "internal-event-fanout"
      };
    }

    throw new Error(`Unhandled event: ${validatedEvent.eventName}`);
  }

  #evaluateBaseGate(context) {
    const reasons = [];

    if (context.role === "contributor") {
      reasons.push("contributors cannot change account-level integrations");
    }

    if (context.verificationState !== "verified") {
      reasons.push("account verification is required");
    }

    return { feature: "integrations_hub", enabled: reasons.length === 0, reasons };
  }

  #evaluateApiCredentialsGate(context) {
    const reasons = [];
    const premiumLikePlan = ["premium", "enterprise", "legacy_powerhouse"].includes(context.plan);

    if (!premiumLikePlan) {
      reasons.push("premium or legacy developer tier is required for API credentials");
    }

    if (context.verificationState !== "verified") {
      reasons.push("verified account required for API credential reset");
    }

    return { feature: "api_credentials", enabled: reasons.length === 0, reasons };
  }

  #evaluateWebhookGate(context) {
    const reasons = [];
    if (!context.dependencyReady) {
      reasons.push("integration dependency state is not ready");
    }

    return { feature: "webhooks", enabled: reasons.length === 0, reasons };
  }

  #evaluateDeveloperSurfaceGate(context) {
    const reasons = [];

    if (context.plan === "free") {
      reasons.push("developer custom integration surfaces require paid plan");
    }

    if (context.trialActive) {
      reasons.push("trial state limits developer custom integration execution");
    }

    return { feature: "analytics_custom_integrations", enabled: reasons.length === 0, reasons };
  }

  #evaluateCalendarSyncGate(context) {
    const reasons = [];

    if (!context.dependencyReady) {
      reasons.push("calendar sync dependency (adapter provider) not ready");
    }

    return { feature: "calendar_sync", enabled: reasons.length === 0, reasons };
  }
}

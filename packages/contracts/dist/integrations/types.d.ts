export type IntegrationProviderState = 'never-connected' | 'connected' | 'disconnected' | 'action-required' | 'reauth-required' | 'error';
export type IntegrationRole = 'owner' | 'admin' | 'contributor' | 'viewer';
export type IntegrationPlan = 'starter' | 'standard' | 'premium' | 'enterprise';
export interface IntegrationGatingContext {
    role: IntegrationRole;
    plan: IntegrationPlan;
    trialActive: boolean;
    dependencyReady: boolean;
    verificationReady: boolean;
}
export type IntegrationCapability = 'api-credentials' | 'webhooks' | 'analytics-config' | 'custom-sidebar' | 'conversion-tracking' | 'calendar-sync-two-way' | 'calendar-sync-ics';
export interface CapabilityGateDecision {
    capability: IntegrationCapability;
    allowed: boolean;
    reason: 'ok' | 'insufficient-role' | 'plan-lock' | 'trial-lock' | 'dependency-lock' | 'verification-lock';
}
export type WebhookEventFamily = 'appointment.new' | 'appointment.rescheduled' | 'appointment.canceled' | 'appointment.updated' | 'order.completed';
export interface WebhookEndpointConfig {
    eventFamily: WebhookEventFamily;
    targetUrl: string;
    enabled: boolean;
    state: 'active' | 'inactive' | 'invalid-url' | 'error';
    lastDeliveryAttemptAt?: string;
}
export interface ApiCredentialState {
    userId: string;
    apiKeyMasked: string;
    rotatedAt: string | null;
    state: 'active' | 'revoked' | 'rotation-required';
}
export interface AnalyticsIntegrationConfig {
    measurementId: string;
    secretValueMasked: string;
    anonymizeIp: boolean;
    enabled: boolean;
}
export interface DeveloperSurfaceConfig {
    customSidebarHtml: string;
    customConversionTrackingHtml: string;
}
export type CalendarSyncProvider = 'google-calendar' | 'icloud' | 'outlook-office365' | 'outlook-exchange' | 'outlook-com';
export interface CalendarTwoWayConnection {
    provider: CalendarSyncProvider;
    state: IntegrationProviderState;
    cronofyProfileId: string | null;
    mappedCalendarIds: string[];
    availabilityBlockingEnabled: boolean;
}
export interface CalendarIcsPublication {
    enabled: boolean;
    feedUrl: string | null;
    rotatedAt: string | null;
}
export type InternalIntegrationEvent = 'appointment.booked' | 'appointment.rescheduled' | 'appointment.canceled' | 'appointment.updated' | 'order.completed';

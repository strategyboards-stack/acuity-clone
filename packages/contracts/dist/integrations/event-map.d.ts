import type { InternalIntegrationEvent, WebhookEventFamily } from './types.js';
export declare function toWebhookEventFamily(event: InternalIntegrationEvent): WebhookEventFamily;
export declare function listMappedInternalEvents(): InternalIntegrationEvent[];
export declare function listMappedWebhookFamilies(): WebhookEventFamily[];

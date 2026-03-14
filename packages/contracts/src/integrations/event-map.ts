import type { InternalIntegrationEvent, WebhookEventFamily } from './types.js';

const eventMap: Record<InternalIntegrationEvent, WebhookEventFamily> = {
  'appointment.booked': 'appointment.new',
  'appointment.rescheduled': 'appointment.rescheduled',
  'appointment.canceled': 'appointment.canceled',
  'appointment.updated': 'appointment.updated',
  'order.completed': 'order.completed'
};

export function toWebhookEventFamily(
  event: InternalIntegrationEvent
): WebhookEventFamily {
  return eventMap[event];
}

export function listMappedInternalEvents(): InternalIntegrationEvent[] {
  return Object.keys(eventMap) as InternalIntegrationEvent[];
}

export function listMappedWebhookFamilies(): WebhookEventFamily[] {
  return Object.values(eventMap);
}

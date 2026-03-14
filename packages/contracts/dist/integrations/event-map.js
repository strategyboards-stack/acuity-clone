const eventMap = {
    'appointment.booked': 'appointment.new',
    'appointment.rescheduled': 'appointment.rescheduled',
    'appointment.canceled': 'appointment.canceled',
    'appointment.updated': 'appointment.updated',
    'order.completed': 'order.completed'
};
export function toWebhookEventFamily(event) {
    return eventMap[event];
}
export function listMappedInternalEvents() {
    return Object.keys(eventMap);
}
export function listMappedWebhookFamilies() {
    return Object.values(eventMap);
}

export function buildOrdersOperationalView(orders) {
    return {
        totalOrders: orders.length,
        completedOrders: orders.filter((order) => order.status === "completed").length,
        refundedOrders: orders.filter((order) => order.status === "refunded").length,
        appointmentLinkedOrders: orders.filter((order) => Boolean(order.appointmentId)).length,
    };
}
export function buildSubscribersOperationalView(subscribers) {
    return {
        totalSubscribers: subscribers.length,
        activeSubscribers: subscribers.filter((subscriber) => subscriber.status === "active").length,
        pausedSubscribers: subscribers.filter((subscriber) => subscriber.status === "paused").length,
        appointmentLinkedSubscribers: subscribers.filter((subscriber) => Boolean(subscriber.appointmentId)).length,
    };
}

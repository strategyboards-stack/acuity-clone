import type { OrderSummary, SubscriberSummary } from "@acuity/contracts";

export interface OrdersOperationalView {
  totalOrders: number;
  completedOrders: number;
  refundedOrders: number;
  appointmentLinkedOrders: number;
}

export interface SubscribersOperationalView {
  totalSubscribers: number;
  activeSubscribers: number;
  pausedSubscribers: number;
  appointmentLinkedSubscribers: number;
}

export function buildOrdersOperationalView(orders: ReadonlyArray<OrderSummary>): OrdersOperationalView {
  return {
    totalOrders: orders.length,
    completedOrders: orders.filter((order) => order.status === "completed").length,
    refundedOrders: orders.filter((order) => order.status === "refunded").length,
    appointmentLinkedOrders: orders.filter((order) => Boolean(order.appointmentId)).length,
  };
}

export function buildSubscribersOperationalView(
  subscribers: ReadonlyArray<SubscriberSummary>,
): SubscribersOperationalView {
  return {
    totalSubscribers: subscribers.length,
    activeSubscribers: subscribers.filter((subscriber) => subscriber.status === "active").length,
    pausedSubscribers: subscribers.filter((subscriber) => subscriber.status === "paused").length,
    appointmentLinkedSubscribers: subscribers.filter((subscriber) => Boolean(subscriber.appointmentId)).length,
  };
}

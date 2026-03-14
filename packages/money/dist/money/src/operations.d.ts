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
export declare function buildOrdersOperationalView(orders: ReadonlyArray<OrderSummary>): OrdersOperationalView;
export declare function buildSubscribersOperationalView(subscribers: ReadonlyArray<SubscriberSummary>): SubscribersOperationalView;

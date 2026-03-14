export type AdminRole = "owner" | "admin" | "contributor";
export type PlanTier = "starter" | "standard" | "premium" | "enterprise";
export type TrialState = "trial" | "paid" | "expired";
export type VerificationState = "verified" | "verification_required";
export type ProcessorProvider = "none" | "stripe" | "square" | "paypal";
export type ProcessorConnectionState = "never_connected" | "connected" | "action_required" | "reauth_required" | "error";
export type MoneySurface = "packages" | "gift_certificates" | "subscriptions" | "orders" | "subscribers";
export type MoneyProductKind = "package" | "gift_certificate" | "subscription";
export interface GateContext {
    role: AdminRole;
    plan: PlanTier;
    trialState: TrialState;
    verificationState: VerificationState;
    processor: {
        provider: ProcessorProvider;
        state: ProcessorConnectionState;
    };
}
export interface ProductSellability {
    allowed: boolean;
    reasons: string[];
    requiresProcessorConnection: boolean;
}
export interface MoneyProduct {
    id: string;
    kind: MoneyProductKind;
    name: string;
    code: string;
    active: boolean;
}
export interface AppointmentCoupon {
    id: string;
    code: string;
    discountLabel: string;
    appliesToAppointmentTypes: string[];
}
export interface MoneyCodeRegistry {
    packages: MoneyProduct[];
    giftCertificates: MoneyProduct[];
    subscriptions: MoneyProduct[];
    appointmentCoupons: AppointmentCoupon[];
}
export interface OrderSummary {
    id: string;
    productId: string;
    productKind: MoneyProductKind;
    clientId: string;
    appointmentId?: string;
    purchasedAtIso: string;
    status: "completed" | "refunded" | "pending";
}
export interface SubscriberSummary {
    id: string;
    subscriptionProductId: string;
    clientId: string;
    appointmentId?: string;
    status: "active" | "paused" | "canceled";
    nextChargeAtIso?: string;
}
export interface AdminSurfaceState {
    surface: MoneySurface;
    mode: "ready" | "empty" | "locked";
    title: string;
    description: string;
    ctaLabel?: string;
    lockReasons?: string[];
}

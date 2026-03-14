export type PaymentProcessor = "stripe" | "square" | "paypal";

export type ProcessorConnectionState =
  | "never_connected"
  | "connected"
  | "disconnected"
  | "action_required"
  | "reauth_required"
  | "error";

export type FeatureLockReason =
  | "plan_restricted"
  | "processor_missing"
  | "processor_action_required"
  | "verification_required";

export type PaymentAtBookingMode =
  | "none"
  | "deposit_required"
  | "full_payment_required";

export interface MoneyDependencyState {
  processor: {
    provider: PaymentProcessor | null;
    state: ProcessorConnectionState;
  };
  verificationComplete: boolean;
  planSupportsMoneySurfaces: boolean;
}

export interface PaymentPolicy {
  mode: PaymentAtBookingMode;
  depositPercent?: number;
}

export interface InvoiceDraft {
  invoiceId: string;
  appointmentId: string;
  clientId: string;
  amountCents: number;
  currency: string;
  collectableNow: boolean;
  lockReasons: FeatureLockReason[];
}

export interface MoneySurfaceState {
  paymentSettingsLocked: boolean;
  invoiceSurfaceLocked: boolean;
  emptyStateKey: "no_invoices" | "processor_not_connected";
  lockReasons: FeatureLockReason[];
  canCollectPayments: boolean;
}

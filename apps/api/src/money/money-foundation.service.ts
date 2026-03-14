import {
  type InvoiceDraft,
  type MoneyDependencyState,
  type MoneySurfaceState,
  type PaymentPolicy,
  type ProcessorConnectionState,
} from "@acuity/contracts";

const COLLECTABLE_STATES: ReadonlySet<ProcessorConnectionState> = new Set(["connected"]);

export class MoneyFoundationService {
  public evaluateSurfaceState(dependency: MoneyDependencyState): MoneySurfaceState {
    const lockReasons = this.computeLockReasons(dependency);
    const canCollectPayments = this.canCollectPayments(dependency);

    return {
      paymentSettingsLocked: lockReasons.length > 0,
      invoiceSurfaceLocked: lockReasons.length > 0,
      emptyStateKey: canCollectPayments ? "no_invoices" : "processor_not_connected",
      lockReasons,
      canCollectPayments,
    };
  }

  public resolvePaymentPolicy(
    requestedPolicy: PaymentPolicy,
    dependency: MoneyDependencyState,
  ): PaymentPolicy {
    if (!this.canCollectPayments(dependency)) {
      return { mode: "none" };
    }

    if (requestedPolicy.mode === "deposit_required") {
      const depositPercent = requestedPolicy.depositPercent;
      if (!depositPercent || depositPercent <= 0 || depositPercent > 100) {
        return { mode: "none" };
      }
    }

    return requestedPolicy;
  }

  public createInvoiceDraft(
    invoice: Omit<InvoiceDraft, "collectableNow" | "lockReasons">,
    dependency: MoneyDependencyState,
  ): InvoiceDraft {
    const lockReasons = this.computeLockReasons(dependency);
    return {
      ...invoice,
      collectableNow: this.canCollectPayments(dependency),
      lockReasons,
    };
  }

  private canCollectPayments(dependency: MoneyDependencyState): boolean {
    return (
      dependency.planSupportsMoneySurfaces &&
      dependency.verificationComplete &&
      dependency.processor.provider !== null &&
      COLLECTABLE_STATES.has(dependency.processor.state)
    );
  }

  private computeLockReasons(dependency: MoneyDependencyState) {
    const reasons: MoneySurfaceState["lockReasons"] = [];

    if (!dependency.planSupportsMoneySurfaces) {
      reasons.push("plan_restricted");
    }

    if (!dependency.verificationComplete) {
      reasons.push("verification_required");
    }

    if (dependency.processor.provider === null || dependency.processor.state === "never_connected") {
      reasons.push("processor_missing");
    } else if (!COLLECTABLE_STATES.has(dependency.processor.state)) {
      reasons.push("processor_action_required");
    }

    return reasons;
  }
}

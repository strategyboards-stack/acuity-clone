import type {
  AdminSurfaceState,
  GateContext,
  MoneyProduct,
  MoneyProductKind,
  MoneySurface,
  ProductSellability,
} from "@acuity/contracts";

const PLAN_ALLOWED_BY_PRODUCT: Record<MoneyProductKind, readonly string[]> = {
  package: ["standard", "premium", "enterprise"],
  gift_certificate: ["standard", "premium", "enterprise"],
  subscription: ["premium", "enterprise"],
};

const SURFACE_PRODUCT_KIND: Partial<Record<MoneySurface, MoneyProductKind>> = {
  packages: "package",
  gift_certificates: "gift_certificate",
  subscriptions: "subscription",
  subscribers: "subscription",
};

function hasConnectedProcessor(context: GateContext): boolean {
  return context.processor.provider !== "none" && context.processor.state === "connected";
}

export function evaluateProductSellability(kind: MoneyProductKind, context: GateContext): ProductSellability {
  const reasons: string[] = [];

  if (!PLAN_ALLOWED_BY_PRODUCT[kind].includes(context.plan)) {
    reasons.push("plan_locked");
  }

  if (context.role === "contributor") {
    reasons.push("role_locked");
  }

  if (context.verificationState !== "verified") {
    reasons.push("verification_required");
  }

  if (!hasConnectedProcessor(context)) {
    reasons.push("payment_processor_required");
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    requiresProcessorConnection: true,
  };
}

export function deriveAdminSurfaceState(
  surface: MoneySurface,
  context: GateContext,
  products: ReadonlyArray<MoneyProduct>,
): AdminSurfaceState {
  const kind = SURFACE_PRODUCT_KIND[surface];
  const empty = products.length === 0;

  if (kind) {
    const sellability = evaluateProductSellability(kind, context);
    if (!sellability.allowed) {
      return {
        surface,
        mode: "locked",
        title: `Unlock ${surface.replace("_", " ")}`,
        description: "This surface is visible but locked until role, plan, verification, and processor states are satisfied.",
        lockReasons: sellability.reasons,
      };
    }
  }

  if (empty) {
    return {
      surface,
      mode: "empty",
      title: `No ${surface.replace("_", " ")} yet`,
      description: "Create your first item to begin selling and operations tracking.",
      ctaLabel: "Create",
    };
  }

  return {
    surface,
    mode: "ready",
    title: `${surface.replace("_", " ")} ready`,
    description: "Operational list is available.",
  };
}

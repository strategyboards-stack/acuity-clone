import type { AdminSurfaceState, GateContext, MoneyProduct, MoneyProductKind, MoneySurface, ProductSellability } from "@acuity/contracts";
export declare function evaluateProductSellability(kind: MoneyProductKind, context: GateContext): ProductSellability;
export declare function deriveAdminSurfaceState(surface: MoneySurface, context: GateContext, products: ReadonlyArray<MoneyProduct>): AdminSurfaceState;

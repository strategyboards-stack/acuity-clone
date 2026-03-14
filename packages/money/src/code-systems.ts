import type { MoneyCodeRegistry } from "@acuity/contracts";

export interface CodeSystemIntegrityResult {
  valid: boolean;
  collisions: string[];
}

export function validateCodeSystemSeparation(registry: MoneyCodeRegistry): CodeSystemIntegrityResult {
  const coupons = new Set(registry.appointmentCoupons.map((coupon) => coupon.code.toLowerCase()));
  const productCodes = [
    ...registry.packages,
    ...registry.giftCertificates,
    ...registry.subscriptions,
  ].map((product) => product.code.toLowerCase());

  const collisions = productCodes.filter((code) => coupons.has(code));

  return {
    valid: collisions.length === 0,
    collisions,
  };
}

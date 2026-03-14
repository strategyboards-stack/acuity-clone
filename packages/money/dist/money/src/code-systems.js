export function validateCodeSystemSeparation(registry) {
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

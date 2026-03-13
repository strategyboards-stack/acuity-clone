import { describe, expect, it } from 'vitest';
import {
  CreateAppointmentCouponSchema,
  CreateIntakeFormSchema,
  FeatureContextSchema
} from '../src/index.js';

describe('phase 2b contracts', () => {
  it('accepts coupon without expiration as non-expiring input', () => {
    const parsed = CreateAppointmentCouponSchema.parse({
      accountId: crypto.randomUUID(),
      code: 'SAVE10',
      discountPercent: 10
    });
    expect(parsed.expiresAt).toBeUndefined();
  });

  it('accepts internal-use intake form with questions', () => {
    const parsed = CreateIntakeFormSchema.parse({
      accountId: crypto.randomUUID(),
      name: 'SOAP Intake',
      internalUse: true,
      questions: [{ prompt: 'History', required: true, position: 0 }]
    });
    expect(parsed.internalUse).toBe(true);
    expect(parsed.questions).toHaveLength(1);
  });

  it('requires server-aware feature context fields', () => {
    const parsed = FeatureContextSchema.parse({
      role: 'ADMIN',
      plan: 'STANDARD',
      inTrial: true,
      dependencyReady: true,
      verificationReady: false
    });
    expect(parsed.role).toBe('ADMIN');
  });
});

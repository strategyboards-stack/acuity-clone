import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { CatalogService } from '../src/catalog/catalog.service.js';
import { FeatureGateService } from '../src/catalog/feature-gate.service.js';
import { InMemoryCatalogRepository } from '../src/catalog/in-memory.repository.js';

const adminContext = {
  role: 'ADMIN' as const,
  plan: 'STANDARD' as const,
  inTrial: false,
  dependencyReady: true,
  verificationReady: true
};

describe('CatalogService phase 2b', () => {
  it('filters private/internal/admin-only entities from public listing', async () => {
    const accountId = randomUUID();
    const service = new CatalogService(new InMemoryCatalogRepository(), new FeatureGateService());

    await service.createAppointmentType(adminContext, {
      accountId,
      name: 'Public consult',
      durationMinutes: 30,
      privateType: false
    });
    await service.createAppointmentType(adminContext, {
      accountId,
      name: 'Private VIP',
      durationMinutes: 60,
      privateType: true
    });
    await service.createAddOn(adminContext, {
      accountId,
      name: 'Tea Service',
      priceCents: 900,
      durationMinutes: 10,
      adminOnly: false
    });
    await service.createAddOn(adminContext, {
      accountId,
      name: 'Backoffice prep',
      priceCents: 0,
      durationMinutes: 0,
      adminOnly: true
    });
    await service.createIntakeForm(adminContext, {
      accountId,
      name: 'Public intake',
      internalUse: false,
      questions: [{ prompt: 'What brings you in?', required: true, position: 0 }]
    });
    await service.createIntakeForm(adminContext, {
      accountId,
      name: 'Internal SOAP',
      internalUse: true,
      questions: []
    });

    const publicView = await service.listPublicCatalogView(accountId);
    expect(publicView.appointmentTypes).toHaveLength(1);
    expect(publicView.addOns).toHaveLength(1);
    expect(publicView.intakeForms).toHaveLength(1);
  });

  it('creates non-expiring appointment coupon when expiration omitted', async () => {
    const service = new CatalogService(new InMemoryCatalogRepository(), new FeatureGateService());
    const created = await service.createAppointmentCoupon(adminContext, {
      accountId: randomUUID(),
      code: 'FOREVER15',
      discountPercent: 15
    });
    expect(created.expiresAt).toBeNull();
  });

  it('enforces role/plan/trial/dependency/verification gate on writes', async () => {
    const service = new CatalogService(new InMemoryCatalogRepository(), new FeatureGateService());
    await expect(
      service.createAddOn(
        {
          role: 'CONTRIBUTOR',
          plan: 'FREE',
          inTrial: false,
          dependencyReady: false,
          verificationReady: false
        },
        {
          accountId: randomUUID(),
          name: 'Blocked Add-on',
          priceCents: 100,
          durationMinutes: 5,
          adminOnly: false
        }
      )
    ).rejects.toThrowError(/requires OWNER or ADMIN role/i);
  });
});

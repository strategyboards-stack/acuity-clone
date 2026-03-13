import test from 'node:test';
import assert from 'node:assert/strict';
import { CatalogService, InMemoryCatalogRepository } from '../dist/index.js';

const adminContext = { role: 'ADMIN', plan: 'STANDARD', inTrial: false, dependencyReady: true, verificationReady: true };

test('filters private/internal/admin-only entities from public listing', async () => {
  const accountId = 'acct-1';
  const service = new CatalogService(new InMemoryCatalogRepository());
  await service.createAppointmentType(adminContext, { accountId, name: 'Public consult', durationMinutes: 30, privateType: false });
  await service.createAppointmentType(adminContext, { accountId, name: 'Private VIP', durationMinutes: 60, privateType: true });
  await service.createAddOn(adminContext, { accountId, name: 'Tea', priceCents: 900, durationMinutes: 10, adminOnly: false });
  await service.createAddOn(adminContext, { accountId, name: 'Ops', priceCents: 0, durationMinutes: 0, adminOnly: true });
  await service.createIntakeForm(adminContext, { accountId, name: 'Public intake', internalUse: false, questions: [{ prompt: 'Goal?', required: true, position: 0 }] });
  await service.createIntakeForm(adminContext, { accountId, name: 'Internal SOAP', internalUse: true, questions: [] });
  const publicView = await service.listPublicCatalogView(accountId);
  assert.equal(publicView.appointmentTypes.length, 1);
  assert.equal(publicView.addOns.length, 1);
  assert.equal(publicView.intakeForms.length, 1);
});

test('creates non-expiring appointment coupon when expiration omitted', async () => {
  const service = new CatalogService(new InMemoryCatalogRepository());
  const created = await service.createAppointmentCoupon(adminContext, { accountId: 'acct-2', code: 'FOREVER15', discountPercent: 15 });
  assert.equal(created.expiresAt, null);
});

test('enforces server-aware gating on writes', async () => {
  const service = new CatalogService(new InMemoryCatalogRepository());
  await assert.rejects(
    service.createAddOn(
      { role: 'CONTRIBUTOR', plan: 'FREE', inTrial: false, dependencyReady: false, verificationReady: false },
      { accountId: 'acct-3', name: 'Blocked', priceCents: 100, durationMinutes: 5, adminOnly: false }
    ),
    /OWNER or ADMIN/
  );
});

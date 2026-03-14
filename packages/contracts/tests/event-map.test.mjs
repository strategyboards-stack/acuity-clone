import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  listMappedInternalEvents,
  listMappedWebhookFamilies,
  toWebhookEventFamily
} from '../dist/integrations/event-map.js';

describe('integration event map', () => {
  it('maps appointment and order events to webhook families', () => {
    assert.equal(toWebhookEventFamily('appointment.booked'), 'appointment.new');
    assert.equal(
      toWebhookEventFamily('appointment.rescheduled'),
      'appointment.rescheduled'
    );
    assert.equal(
      toWebhookEventFamily('appointment.canceled'),
      'appointment.canceled'
    );
    assert.equal(toWebhookEventFamily('appointment.updated'), 'appointment.updated');
    assert.equal(toWebhookEventFamily('order.completed'), 'order.completed');
  });

  it('keeps an explicit inventory for adapter registration', () => {
    const internal = listMappedInternalEvents();
    const webhookFamilies = listMappedWebhookFamilies();

    assert.deepEqual(internal, [
      'appointment.booked',
      'appointment.rescheduled',
      'appointment.canceled',
      'appointment.updated',
      'order.completed'
    ]);
    assert.deepEqual(webhookFamilies, [
      'appointment.new',
      'appointment.rescheduled',
      'appointment.canceled',
      'appointment.updated',
      'order.completed'
    ]);
  });
});

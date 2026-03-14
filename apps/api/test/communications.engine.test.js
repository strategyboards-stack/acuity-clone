import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CommunicationEngine,
  StubAdminAlertAdapter,
  StubClientEmailAdapter,
  StubReceiptEmailAdapter,
  StubSmsReminderAdapter,
} from '../src/communications/engine.js';
import { InMemoryCommunicationRepository } from '../src/communications/repository.js';

const baseContext = {
  role: 'OWNER',
  plan: 'STANDARD',
  trialState: 'NA',
  verificationState: 'VERIFIED',
  dependencyState: { smsEnabled: true, emailEnabled: true },
};

const baseInput = (partial) => ({
  accountId: 'acct-1',
  appointmentId: 'appt-1',
  channel: 'CLIENT_EMAIL',
  purpose: 'APPOINTMENT_REMINDER',
  scheduledFor: new Date('2026-01-01T12:00:00.000Z'),
  payload: { to: 'client@example.com' },
  ...partial,
});

test('SMS reminders are plan-gated and locked on starter plan', () => {
  const repository = new InMemoryCommunicationRepository();
  const engine = new CommunicationEngine(repository, new Map());

  const event = engine.scheduleCommunication(
    baseInput({ channel: 'SMS_REMINDER', purpose: 'APPOINTMENT_REMINDER' }),
    { ...baseContext, plan: 'STARTER' },
  );

  assert.equal(event.status, 'LOCKED');
});

test('channels and purposes stay separated for reminders, receipts and admin alerts', async () => {
  const repository = new InMemoryCommunicationRepository();
  const adapters = new Map([
    ['CLIENT_EMAIL', new StubClientEmailAdapter()],
    ['RECEIPT_EMAIL', new StubReceiptEmailAdapter()],
    ['ADMIN_ALERT', new StubAdminAlertAdapter()],
    ['SMS_REMINDER', new StubSmsReminderAdapter()],
  ]);
  const engine = new CommunicationEngine(repository, adapters);

  engine.scheduleCommunication(baseInput({ channel: 'CLIENT_EMAIL', purpose: 'APPOINTMENT_FOLLOW_UP' }), baseContext);
  engine.scheduleCommunication(baseInput({ channel: 'RECEIPT_EMAIL', purpose: 'ORDER_RECEIPT' }), baseContext);
  engine.scheduleCommunication(baseInput({ channel: 'ADMIN_ALERT', purpose: 'ADMIN_SCHEDULE_NOTICE' }), baseContext);

  await engine.executeDueEvents(new Date('2026-01-01T12:10:00.000Z'));

  const history = engine.historyForAppointment('appt-1');
  assert.equal(history.length, 3);
  assert.deepEqual(new Set(history.map((item) => item.channel)), new Set(['CLIENT_EMAIL', 'RECEIPT_EMAIL', 'ADMIN_ALERT']));
  assert.equal(history.every((entry) => entry.status === 'SENT'), true);
});

test('failed-send state retries until max attempts then marks FAILED', async () => {
  const repository = new InMemoryCommunicationRepository();
  const engine = new CommunicationEngine(
    repository,
    new Map([
      ['SMS_REMINDER', new StubSmsReminderAdapter(true)],
    ]),
  );

  const event = engine.scheduleCommunication(
    baseInput({ channel: 'SMS_REMINDER', purpose: 'APPOINTMENT_REMINDER' }),
    baseContext,
  );

  await engine.executeDueEvents(new Date('2026-01-01T12:10:00.000Z'));
  const afterFirst = repository.findById(event.id);
  assert.equal(afterFirst.status, 'SCHEDULED');
  assert.equal(afterFirst.attempts, 1);

  await engine.executeDueEvents(new Date('2026-01-01T12:20:00.000Z'));
  await engine.executeDueEvents(new Date('2026-01-01T12:30:00.000Z'));

  const afterThird = repository.findById(event.id);
  assert.equal(afterThird.status, 'FAILED');
  assert.equal(afterThird.attempts, 3);
  assert.equal(afterThird.lastErrorCode, 'PROVIDER_UNAVAILABLE');
});

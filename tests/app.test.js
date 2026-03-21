import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BASE_DATE,
  DOMAIN_SCHEMA_VERSION,
  DOMAIN_STORAGE_KEY,
  cancelAppointment,
  createAppointment,
  createBlockedSlot,
  createDefaultSchedulingConfig,
  createDomainExportPayload,
  createInitialState,
  createReportExportPayload,
  createSeedDomainState,
  deriveReportRows,
  findClientAppointments,
  getAvailableSlots,
  getBookingBarSnippet,
  getBookingButtonSnippet,
  getDirectLinks,
  getEmbedSnippet,
  getFilteredAppointments,
  getGeneralLink,
  importDomainPayload,
  loadDomainState,
  persistDomainState,
  rescheduleAppointment,
  rotateApiKey,
} from '../logic.js';

function createMockStorage(initialValues = {}) {
  const values = new Map(Object.entries(initialValues));
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    dump(key) {
      return values.get(key);
    },
  };
}

test('seed bootstrap initializes storage and survives reload', () => {
  const storage = createMockStorage();
  const state = createInitialState(storage);
  assert.equal(state.domain.schemaVersion, DOMAIN_SCHEMA_VERSION);
  assert.ok(storage.dump(DOMAIN_STORAGE_KEY));

  const reloaded = createInitialState(storage);
  assert.equal(reloaded.domain.appointments.length, state.domain.appointments.length);
  assert.equal(reloaded.domain.blockedSlots.length, state.domain.blockedSlots.length);
});

test('schema mismatch resets safely to seed state', () => {
  const storage = createMockStorage({
    [DOMAIN_STORAGE_KEY]: JSON.stringify({ schemaVersion: 999, appointments: [], blockedSlots: [] }),
  });

  const domain = loadDomainState(storage);
  const seed = createSeedDomainState();
  assert.equal(domain.schemaVersion, DOMAIN_SCHEMA_VERSION);
  assert.deepEqual(domain.appointments, seed.appointments);
  assert.deepEqual(domain.blockedSlots, seed.blockedSlots);
});

test('booking, manual create, and block off persist across refresh and affect availability', () => {
  const storage = createMockStorage();
  const state = createInitialState(storage);

  const booked = createAppointment(state.domain, {
    service: 'Discovery Call',
    clientName: 'Jordan Kim',
    clientEmail: 'jordan@example.com',
    date: BASE_DATE,
    time: '10:00',
    status: 'scheduled',
    staff: 'Morgan Lee',
    source: 'booking-demo',
  });

  const manual = createAppointment(state.domain, {
    service: 'Initial Consultation',
    clientName: 'Taylor Brooks',
    clientEmail: 'taylor@example.com',
    date: '2026-03-20',
    time: '14:00',
    status: 'scheduled',
    staff: 'Morgan Lee',
    source: 'admin-manual',
  });

  createBlockedSlot(state.domain, { date: BASE_DATE, time: '13:00', reason: 'Focus block' });
  persistDomainState(storage, state.domain);

  const reloaded = createInitialState(storage);
  assert.ok(reloaded.domain.appointments.some((appointment) => appointment.bookingReference === booked.bookingReference));
  assert.ok(reloaded.domain.appointments.some((appointment) => appointment.bookingReference === manual.bookingReference));
  assert.equal(getAvailableSlots(BASE_DATE, reloaded.domain.appointments, reloaded.domain.blockedSlots).includes('10:00'), false);
  assert.equal(getAvailableSlots(BASE_DATE, reloaded.domain.appointments, reloaded.domain.blockedSlots).includes('13:00'), false);
});

test('client lookup is honest and uses persisted email/reference criteria', () => {
  const storage = createMockStorage();
  const state = createInitialState(storage);
  const appointment = createAppointment(state.domain, {
    service: 'Discovery Call',
    clientName: 'Jordan Kim',
    clientEmail: 'jordan@example.com',
    date: BASE_DATE,
    time: '10:00',
    status: 'scheduled',
    staff: 'Morgan Lee',
    source: 'booking-demo',
  });
  persistDomainState(storage, state.domain);

  assert.equal(findClientAppointments(state.domain, { email: 'jordan@example.com', bookingReference: '' }).length, 1);
  assert.equal(findClientAppointments(state.domain, { email: '', bookingReference: appointment.bookingReference }).length, 1);
  assert.equal(findClientAppointments(state.domain, { email: 'nobody@example.com', bookingReference: '' }).length, 0);
});

test('client reschedule and cancel mutate the same persisted appointment record', () => {
  const storage = createMockStorage();
  const state = createInitialState(storage);
  const appointment = createAppointment(state.domain, {
    service: 'Discovery Call',
    clientName: 'Jordan Kim',
    clientEmail: 'jordan@example.com',
    date: BASE_DATE,
    time: '10:00',
    status: 'scheduled',
    staff: 'Morgan Lee',
    source: 'booking-demo',
  });

  const rescheduled = rescheduleAppointment(state.domain, appointment.id, { date: '2026-03-19', time: '10:00' });
  assert.equal(rescheduled.error, null);
  assert.equal(rescheduled.appointment.status, 'rescheduled');
  assert.equal(rescheduled.appointment.date, '2026-03-19');

  cancelAppointment(state.domain, appointment.id);
  persistDomainState(storage, state.domain);

  const reloaded = createInitialState(storage);
  const reloadedAppointment = reloaded.domain.appointments.find((entry) => entry.id === appointment.id);
  assert.equal(reloadedAppointment.status, 'cancelled');
  assert.equal(reloadedAppointment.date, '2026-03-19');
  assert.equal(reloadedAppointment.time, '10:00');
});

test('v1 persisted payload migrates to v2 and keeps appointments/blocked slots', () => {
  const storage = createMockStorage({
    [DOMAIN_STORAGE_KEY]: JSON.stringify({
      schemaVersion: 1,
      nextAppointmentNumber: 1003,
      nextBlockedSlotNumber: 1002,
      appointments: [{
        id: 'apt-1001',
        bookingReference: 'BK-1001',
        service: 'Discovery Call',
        clientName: 'Jamie Rivera',
        clientEmail: 'jamie@example.com',
        staff: 'Morgan Lee',
        date: BASE_DATE,
        time: '09:00',
        durationMinutes: 30,
        status: 'scheduled',
        source: 'booking-demo',
      }],
      blockedSlots: [{ id: 'block-1001', date: BASE_DATE, time: '11:00', reason: 'Team planning hold' }],
    }),
  });

  const migrated = loadDomainState(storage);
  assert.equal(migrated.schemaVersion, DOMAIN_SCHEMA_VERSION);
  assert.ok(migrated.schedulingConfig);
  assert.ok(migrated.integrationsConfig);
  assert.equal(migrated.appointments.length, 1);
  assert.equal(migrated.blockedSlots.length, 1);
});

test('persisted scheduling config drives derived links and snippets', () => {
  const config = createDefaultSchedulingConfig();
  config.businessName = 'Demo Studio';
  config.generalPath = '/booking/demo';
  config.buttonLabel = 'Reserve now';
  config.enabledServiceSlugs = ['initial-consultation'];

  assert.equal(getGeneralLink(config, 'https://demo.test'), 'https://demo.test/booking/demo');
  assert.equal(getDirectLinks(config, 'https://demo.test')[0].url, 'https://demo.test/booking/demo?service=initial-consultation');
  assert.match(getEmbedSnippet(config, 'https://demo.test'), /Demo Studio/);
  assert.match(getBookingButtonSnippet(config, 'https://demo.test'), /Reserve now/);
  assert.match(getBookingBarSnippet(config, 'https://demo.test'), /Reserve now/);
});

test('integrations config persists analytics fields, custom editors, and api key rotation', () => {
  const storage = createMockStorage();
  const state = createInitialState(storage);
  state.domain.integrationsConfig.googleAnalytics.measurementId = 'G-TEST123';
  state.domain.integrationsConfig.googleAnalytics.secretValue = 'secret_123';
  state.domain.integrationsConfig.customSidebar.html = '<div>Custom sidebar</div>';
  state.domain.integrationsConfig.customConversionTracking.html = '<script>track()</script>';
  const oldKey = state.domain.integrationsConfig.apiCredentials.apiKey;
  const newKey = rotateApiKey(state.domain);
  persistDomainState(storage, state.domain);

  const reloaded = createInitialState(storage);
  assert.equal(reloaded.domain.integrationsConfig.googleAnalytics.measurementId, 'G-TEST123');
  assert.equal(reloaded.domain.integrationsConfig.googleAnalytics.secretValue, 'secret_123');
  assert.equal(reloaded.domain.integrationsConfig.customSidebar.html, '<div>Custom sidebar</div>');
  assert.equal(reloaded.domain.integrationsConfig.customConversionTracking.html, '<script>track()</script>');
  assert.notEqual(newKey, oldKey);
  assert.equal(reloaded.domain.integrationsConfig.apiCredentials.apiKey, newKey);
});

test('shared report filters change datasets and intake rows are derived', () => {
  const state = createInitialState(createMockStorage());
  const allAppointments = deriveReportRows('appointments', state.domain, { dateRange: 'last-30', calendar: 'all' });
  const virtualOnly = deriveReportRows('appointments', state.domain, { dateRange: 'last-30', calendar: 'virtual' });
  const intakeRows = deriveReportRows('intake-forms', state.domain, { dateRange: 'last-30', calendar: 'all' }, {
    question: 'How did you hear about us?',
  });

  assert.ok(allAppointments.length > virtualOnly.length);
  assert.ok(intakeRows.some((row) => row.label === 'Website' || row.label === 'Referral'));
});

test('report export and import-export payloads are honest JSON actions', () => {
  const state = createInitialState(createMockStorage());
  const revenuePayload = createReportExportPayload('revenue', state.domain, { dateRange: 'last-30', calendar: 'all' });
  const domainPayload = createDomainExportPayload(state.domain);
  const imported = importDomainPayload(domainPayload);

  assert.match(revenuePayload, /"tab": "revenue"/);
  assert.match(domainPayload, /"appointments"/);
  assert.equal(imported.error, null);
  assert.equal(imported.domainState.schemaVersion, DOMAIN_SCHEMA_VERSION);
});

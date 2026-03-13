import test from 'node:test';
import assert from 'node:assert/strict';
import { SchedulingConfigService } from '../apps/api/src/scheduling-config/service.js';
import { validateAvailabilityRule } from '../packages/contracts/src/scheduling-config.js';

const tenantId = 'e6fbec19-0608-40cb-ab2a-72cd4c44ad8e';
const calendarId = '0b7955ce-7778-420e-be0f-c7a2c63809ac';

test('creates phase 2A records and enforces availability ranges', () => {
  const service = new SchedulingConfigService();
  const cal = service.createCalendar({ tenantId, name: 'Main', timezone: 'UTC', isPrimary: true });
  assert.equal(cal.tenantId, tenantId);

  const rule = { tenantId, calendarId, dayOfWeek: 1, startMinute: 540, endMinute: 1020, timezone: 'UTC' };
  validateAvailabilityRule(rule);
  const saved = service.createAvailabilityRule(rule);
  assert.equal(saved.dayOfWeek, 1);

  assert.throws(() => service.createAvailabilityRule({ ...rule, endMinute: 200 }), /greater than/);
});

test('upserts global scheduling limits', () => {
  const service = new SchedulingConfigService();
  const first = service.upsertGlobalLimits({
    tenantId,
    minimumNoticeMinutes: 120,
    maximumAdvanceDays: 180,
    maxAppointmentsPerDay: 25,
    allowClientReschedule: true,
    allowClientCancel: true
  });
  const second = service.upsertGlobalLimits({ ...first, maxAppointmentsPerDay: 30 });
  assert.equal(second.maxAppointmentsPerDay, 30);
});

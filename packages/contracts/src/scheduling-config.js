export const LocationKind = Object.freeze({
  IN_PERSON: 'IN_PERSON',
  PHONE: 'PHONE',
  VIDEO: 'VIDEO',
  CUSTOM: 'CUSTOM'
});

export function assertUuid(value, field) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(value)) throw new Error(`${field} must be a UUID`);
}

export function validateAvailabilityRule(input) {
  assertUuid(input.tenantId, 'tenantId');
  assertUuid(input.calendarId, 'calendarId');
  if (input.dayOfWeek < 0 || input.dayOfWeek > 6) throw new Error('dayOfWeek out of range');
  if (input.startMinute < 0 || input.startMinute > 1439) throw new Error('startMinute out of range');
  if (input.endMinute < 1 || input.endMinute > 1440) throw new Error('endMinute out of range');
  if (input.endMinute <= input.startMinute) throw new Error('endMinute must be greater than startMinute');
}

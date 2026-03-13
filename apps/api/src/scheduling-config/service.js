export class SchedulingConfigService {
  constructor() {
    this.calendars = new Map();
    this.locations = new Map();
    this.rules = new Map();
    this.overrides = new Map();
    this.resources = new Map();
    this.globalLimits = new Map();
  }

  createCalendar(input) {
    const record = { ...input, id: crypto.randomUUID(), isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.calendars.set(record.id, record);
    return record;
  }

  createLocation(input) {
    const record = { ...input, id: crypto.randomUUID(), isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.locations.set(record.id, record);
    return record;
  }

  createAvailabilityRule(input) {
    if (input.endMinute <= input.startMinute) throw new Error('endMinute must be greater than startMinute');
    const record = { ...input, id: crypto.randomUUID(), isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.rules.set(record.id, record);
    return record;
  }

  createAvailabilityOverride(input) {
    const startsAt = new Date(input.startsAt);
    const endsAt = new Date(input.endsAt);
    if (endsAt <= startsAt) throw new Error('endsAt must be greater than startsAt');
    const record = { ...input, startsAt: startsAt.toISOString(), endsAt: endsAt.toISOString(), id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.overrides.set(record.id, record);
    return record;
  }

  createResource(input) {
    const record = { ...input, id: crypto.randomUUID(), isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.resources.set(record.id, record);
    return record;
  }

  upsertGlobalLimits(input) {
    const existing = this.globalLimits.get(input.tenantId);
    const now = new Date().toISOString();
    const record = existing
      ? { ...existing, ...input, updatedAt: now }
      : { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
    this.globalLimits.set(input.tenantId, record);
    return record;
  }
}

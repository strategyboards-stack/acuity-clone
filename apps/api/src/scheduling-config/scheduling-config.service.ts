import { Injectable } from "@nestjs/common";
import { prisma } from "@acuity/db";
import { CreateAvailabilityOverrideDto, CreateAvailabilityRuleDto, CreateCalendarDto, CreateLocationDto, CreateResourceDto, UpsertGlobalSchedulingLimitDto } from "./dto.js";

@Injectable()
export class SchedulingConfigService {
  createCalendar(input: CreateCalendarDto) {
    return prisma.calendar.create({ data: input });
  }

  createLocation(input: CreateLocationDto) {
    return prisma.location.create({ data: input });
  }

  createAvailabilityRule(input: CreateAvailabilityRuleDto) {
    return prisma.availabilityRule.create({
      data: {
        tenantId: input.tenantId,
        calendarId: input.calendarId,
        dayOfWeek: input.dayOfWeek,
        startMinute: input.startMinute,
        endMinute: input.endMinute,
        timezone: input.timezone
      }
    });
  }

  createAvailabilityOverride(input: CreateAvailabilityOverrideDto) {
    return prisma.availabilityOverride.create({
      data: {
        tenantId: input.tenantId,
        calendarId: input.calendarId,
        startsAt: new Date(input.startsAt),
        endsAt: new Date(input.endsAt),
        isAvailable: input.isAvailable,
        reason: input.reason
      }
    });
  }

  createResource(input: CreateResourceDto) {
    return prisma.resource.create({ data: input });
  }

  upsertGlobalLimit(input: UpsertGlobalSchedulingLimitDto) {
    return prisma.globalSchedulingLimit.upsert({
      where: { tenantId: input.tenantId },
      create: input,
      update: input
    });
  }
}

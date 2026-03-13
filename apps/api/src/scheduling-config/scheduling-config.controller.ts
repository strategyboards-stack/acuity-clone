import { Body, Controller, Post } from "@nestjs/common";
import { CreateAvailabilityOverrideDto, CreateAvailabilityRuleDto, CreateCalendarDto, CreateLocationDto, CreateResourceDto, UpsertGlobalSchedulingLimitDto } from "./dto.js";
import { SchedulingConfigService } from "./scheduling-config.service.js";

@Controller("admin/scheduling-config")
export class SchedulingConfigController {
  constructor(private readonly service: SchedulingConfigService) {}

  @Post("calendars")
  createCalendar(@Body() body: CreateCalendarDto) {
    return this.service.createCalendar(body);
  }

  @Post("locations")
  createLocation(@Body() body: CreateLocationDto) {
    return this.service.createLocation(body);
  }

  @Post("availability-rules")
  createAvailabilityRule(@Body() body: CreateAvailabilityRuleDto) {
    return this.service.createAvailabilityRule(body);
  }

  @Post("availability-overrides")
  createAvailabilityOverride(@Body() body: CreateAvailabilityOverrideDto) {
    return this.service.createAvailabilityOverride(body);
  }

  @Post("resources")
  createResource(@Body() body: CreateResourceDto) {
    return this.service.createResource(body);
  }

  @Post("global-limits")
  upsertGlobalLimit(@Body() body: UpsertGlobalSchedulingLimitDto) {
    return this.service.upsertGlobalLimit(body);
  }
}

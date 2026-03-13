import "reflect-metadata";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { describe, expect, it } from "vitest";
import { CreateAvailabilityRuleDto } from "../src/scheduling-config/dto.js";

describe("CreateAvailabilityRuleDto", () => {
  it("rejects invalid day and minute windows", () => {
    const dto = plainToInstance(CreateAvailabilityRuleDto, {
      tenantId: "e6fbec19-0608-40cb-ab2a-72cd4c44ad8e",
      calendarId: "0b7955ce-7778-420e-be0f-c7a2c63809ac",
      dayOfWeek: 9,
      startMinute: 700,
      endMinute: 600,
      timezone: "UTC"
    });

    const errors = validateSync(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});

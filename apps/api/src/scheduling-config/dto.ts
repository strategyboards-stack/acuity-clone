import { Type } from "class-transformer";
import { IsBoolean, IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min, ValidateIf } from "class-validator";

export enum LocationKindDto {
  IN_PERSON = "IN_PERSON",
  PHONE = "PHONE",
  VIDEO = "VIDEO",
  CUSTOM = "CUSTOM"
}

export class CreateCalendarDto {
  @IsUUID()
  tenantId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  timezone!: string;

  @IsBoolean()
  @Type(() => Boolean)
  isPrimary!: boolean;
}

export class CreateLocationDto {
  @IsUUID()
  tenantId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(LocationKindDto)
  kind!: LocationKindDto;

  @IsOptional()
  @IsString()
  details?: string;
}

export class CreateAvailabilityRuleDto {
  @IsUUID()
  tenantId!: string;

  @IsUUID()
  calendarId!: string;

  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek!: number;

  @IsInt()
  @Min(0)
  @Max(1439)
  startMinute!: number;

  @IsInt()
  @Min(1)
  @Max(1440)
  endMinute!: number;

  @ValidateIf((o) => o.endMinute <= o.startMinute)
  @IsInt({ message: "endMinute must be greater than startMinute" })
  invalidRangeGuard?: number;

  @IsString()
  @IsNotEmpty()
  timezone!: string;
}

export class CreateAvailabilityOverrideDto {
  @IsUUID()
  tenantId!: string;

  @IsUUID()
  calendarId!: string;

  @IsDateString()
  startsAt!: string;

  @IsDateString()
  endsAt!: string;

  @IsBoolean()
  @Type(() => Boolean)
  isAvailable!: boolean;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class CreateResourceDto {
  @IsUUID()
  tenantId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsInt()
  @Min(1)
  @Max(500)
  capacity!: number;
}

export class UpsertGlobalSchedulingLimitDto {
  @IsUUID()
  tenantId!: string;

  @IsInt()
  @Min(0)
  @Max(525600)
  minimumNoticeMinutes!: number;

  @IsInt()
  @Min(1)
  @Max(730)
  maximumAdvanceDays!: number;

  @IsInt()
  @Min(1)
  @Max(10000)
  maxAppointmentsPerDay!: number;

  @IsBoolean()
  @Type(() => Boolean)
  allowClientReschedule!: boolean;

  @IsBoolean()
  @Type(() => Boolean)
  allowClientCancel!: boolean;
}

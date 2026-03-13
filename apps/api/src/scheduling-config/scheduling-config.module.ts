import { Module } from "@nestjs/common";
import { SchedulingConfigController } from "./scheduling-config.controller.js";
import { SchedulingConfigService } from "./scheduling-config.service.js";

@Module({
  controllers: [SchedulingConfigController],
  providers: [SchedulingConfigService]
})
export class SchedulingConfigModule {}

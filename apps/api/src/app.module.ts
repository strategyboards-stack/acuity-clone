import { Module } from "@nestjs/common";
import { SchedulingConfigModule } from "./scheduling-config/scheduling-config.module.js";

@Module({
  imports: [SchedulingConfigModule]
})
export class AppModule {}

import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AppController } from "./app.controller.js";
import { EntitlementMiddleware } from "./entitlements.js";

@Module({
  controllers: [AppController]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(EntitlementMiddleware).forRoutes("api/v1/*");
  }
}

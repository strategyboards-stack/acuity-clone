import { Controller, Get } from "@nestjs/common";

@Controller("api/v1")
export class AppController {
  @Get("health")
  health() {
    return { status: "ok", surface: "platform-shell" };
  }

  @Get("workspace/shell")
  workspaceShell() {
    return { routes: ["/workspace/calendar", "/workspace/integrations", "/workspace/reports"] };
  }

  @Get("account/shell")
  accountShell() {
    return { routes: ["/account/manage-users", "/account/billing"] };
  }
}

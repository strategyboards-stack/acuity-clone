import { ForbiddenException, Injectable, NestMiddleware } from "@nestjs/common";
import { entitlementContextSchema, type FeatureKey } from "@acuity/contracts";
import type { NextFunction, Request, Response } from "express";

const featurePolicies: Record<FeatureKey, (ctx: ReturnType<typeof entitlementContextSchema.parse>) => boolean> = {
  "host.manageUsers": (ctx) => ctx.role === "owner",
  "host.billing": (ctx) => ["owner", "admin"].includes(ctx.role),
  "workspace.calendar": (ctx) => ["owner", "admin", "contributor"].includes(ctx.role),
  "workspace.integrations": (ctx) => ctx.plan !== "free" && ctx.verificationComplete,
  "workspace.reports": (ctx) => ctx.plan !== "free"
};

@Injectable()
export class EntitlementMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const raw = {
      role: req.header("x-role") ?? "client",
      plan: req.header("x-plan") ?? "free",
      trialActive: req.header("x-trial") === "true",
      dependencies: {
        paymentsConnected: req.header("x-payments-connected") === "true",
        emailVerified: req.header("x-email-verified") === "true"
      },
      verificationComplete: req.header("x-verification-complete") === "true"
    };

    const context = entitlementContextSchema.parse(raw);
    const requestedFeature = req.header("x-feature") as FeatureKey | undefined;

    if (requestedFeature && !featurePolicies[requestedFeature](context)) {
      throw new ForbiddenException(`Feature ${requestedFeature} not available for this context`);
    }

    (req as Request & { entitlementContext?: typeof context }).entitlementContext = context;
    next();
  }
}

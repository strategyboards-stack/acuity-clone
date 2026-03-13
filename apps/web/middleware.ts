import { NextResponse, type NextRequest } from "next/server";
import { entitlementContextSchema, type FeatureKey } from "@acuity/contracts";

const featureByPath: Array<{ matcher: RegExp; feature: FeatureKey }> = [
  { matcher: /^\/account\/manage-users/, feature: "host.manageUsers" },
  { matcher: /^\/account\/billing/, feature: "host.billing" },
  { matcher: /^\/workspace/, feature: "workspace.calendar" }
];

const allow = (feature: FeatureKey, ctx: ReturnType<typeof entitlementContextSchema.parse>) => {
  switch (feature) {
    case "host.manageUsers":
      return ctx.role === "owner";
    case "host.billing":
      return ["owner", "admin"].includes(ctx.role);
    case "workspace.calendar":
      return ["owner", "admin", "contributor"].includes(ctx.role);
    case "workspace.integrations":
      return ctx.plan !== "free" && ctx.verificationComplete;
    case "workspace.reports":
      return ctx.plan !== "free";
  }
};

export function middleware(request: NextRequest) {
  const featureMatch = featureByPath.find((entry) => entry.matcher.test(request.nextUrl.pathname));
  if (!featureMatch) {
    return NextResponse.next();
  }

  const context = entitlementContextSchema.parse({
    role: request.headers.get("x-role") ?? "client",
    plan: request.headers.get("x-plan") ?? "free",
    trialActive: request.headers.get("x-trial") === "true",
    dependencies: {
      paymentsConnected: request.headers.get("x-payments-connected") === "true",
      emailVerified: request.headers.get("x-email-verified") === "true"
    },
    verificationComplete: request.headers.get("x-verification-complete") === "true"
  });

  if (!allow(featureMatch.feature, context)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/workspace/:path*", "/account/:path*"]
};

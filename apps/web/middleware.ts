import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authCookieName } from "./lib/auth/session";
import { isClientAuthEntry, requiresClientAuth } from "./lib/auth/guards";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasSession = Boolean(request.cookies.get(authCookieName)?.value);

  if (requiresClientAuth(pathname) && !hasSession) {
    return NextResponse.redirect(new URL("/client/login", request.url));
  }

  if (isClientAuthEntry(pathname) && hasSession) {
    return NextResponse.redirect(new URL("/client", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/client/:path*"]
};

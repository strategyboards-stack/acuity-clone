export function requiresClientAuth(pathname: string) {
  return pathname.startsWith("/client") &&
    pathname !== "/client/login" &&
    pathname !== "/client/signup" &&
    pathname !== "/client/reset-password";
}

export function isClientAuthEntry(pathname: string) {
  return pathname === "/client/login" || pathname === "/client/signup";
}

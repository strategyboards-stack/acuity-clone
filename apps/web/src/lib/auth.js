export function isCrmAllowed(role) {
  return role === "owner" || role === "admin" || role === "contributor";
}

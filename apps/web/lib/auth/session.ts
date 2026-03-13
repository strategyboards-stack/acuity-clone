import { cookies } from "next/headers";
import { getClientById } from "../data/store";

const SESSION_COOKIE = "acuity_client_session";

export async function setClientSession(clientId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, clientId, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 14
  });
}

export async function clearClientSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionClient() {
  const cookieStore = await cookies();
  const clientId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!clientId) return null;
  return getClientById(clientId);
}

export const authCookieName = SESSION_COOKIE;

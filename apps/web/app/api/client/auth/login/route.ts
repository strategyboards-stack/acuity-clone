import { ClientLoginInputSchema } from "@acuity/contracts";
import { NextResponse } from "next/server";
import { authenticateClient } from "@/lib/data/store";
import { setClientSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  const parsed = ClientLoginInputSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid login data." }, { status: 400 });
  }

  const user = authenticateClient(parsed.data.email, parsed.data.password);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  await setClientSession(user.id);
  return NextResponse.json({ ok: true });
}

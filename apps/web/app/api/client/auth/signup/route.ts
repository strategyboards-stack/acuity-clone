import { ClientSignupInputSchema } from "@acuity/contracts";
import { NextResponse } from "next/server";
import { setClientSession } from "@/lib/auth/session";
import { createClientUser } from "@/lib/data/store";

export async function POST(request: Request) {
  const parsed = ClientSignupInputSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid signup data." }, { status: 400 });
  }

  const user = createClientUser(parsed.data);
  if (!user) {
    return NextResponse.json({ error: "Email already exists." }, { status: 409 });
  }

  await setClientSession(user.id);
  return NextResponse.json({ ok: true });
}

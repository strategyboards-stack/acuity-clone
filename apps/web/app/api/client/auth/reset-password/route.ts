import { ClientResetPasswordInputSchema } from "@acuity/contracts";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const parsed = ClientResetPasswordInputSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid reset request." }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    message: "If an account exists for this email, a password reset link has been sent."
  });
}

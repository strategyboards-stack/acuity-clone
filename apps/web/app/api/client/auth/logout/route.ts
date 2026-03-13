import { NextResponse } from "next/server";
import { clearClientSession } from "@/lib/auth/session";

export async function POST() {
  await clearClientSession();
  return NextResponse.json({ ok: true });
}

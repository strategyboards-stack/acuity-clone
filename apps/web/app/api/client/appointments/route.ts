import { NextResponse } from "next/server";
import { getSessionClient } from "@/lib/auth/session";
import { getAppointmentsForClient } from "@/lib/data/store";

export async function GET() {
  const client = await getSessionClient();
  if (!client) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({ appointments: getAppointmentsForClient(client.id) });
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function ClientNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/client/auth/logout", { method: "POST" });
    router.push("/client/login");
    router.refresh();
  }

  return (
    <nav className="nav" aria-label="Client navigation">
      <Link href="/client" style={{ opacity: pathname === "/client" ? 1 : 0.7 }}>Appointments</Link>
      <Link href="/client/codes" style={{ opacity: pathname === "/client/codes" ? 1 : 0.7 }}>Manage codes</Link>
      <button onClick={logout} style={{ background: "#374151" }}>Logout</button>
    </nav>
  );
}

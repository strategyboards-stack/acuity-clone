import type { ReactNode } from "react";
import { getSessionClient } from "@/lib/auth/session";
import { ClientNav } from "@/components/client/client-nav";

export default async function ClientLayout({ children }: { children: ReactNode }) {
  const user = await getSessionClient();

  return (
    <>
      {user && <ClientNav />}
      {children}
    </>
  );
}

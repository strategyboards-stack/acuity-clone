import Link from "next/link";
import type { ReactNode } from "react";

const links = [
  ["/admin/calendar", "Calendar"],
  ["/admin/scheduling-page", "Scheduling Page"],
  ["/admin/integrations", "Integrations"],
  ["/admin/reports", "Reports"],
  ["/booking/demo", "Booking Demo"],
  ["/client", "Client"]
] as const;

export function AdminShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <main className="page stack">
      <header className="card">
        <h1 className="title">{title}</h1>
        <p className="muted">{subtitle}</p>
      </header>
      <section className="shell">
        <aside className="sidebar card">
          <nav className="nav">
            {links.map(([href, label]) => (
              <Link key={href} className="pill" href={href}>
                {label}
              </Link>
            ))}
          </nav>
          <p className="muted">Manage Users and Billing remain shell-level account surfaces and are intentionally not flattened into these scheduling pages.</p>
        </aside>
        <div className="stack">{children}</div>
      </section>
    </main>
  );
}

import type { PropsWithChildren } from "react";

export function ShellFrame({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <main style={{ fontFamily: "Inter, sans-serif", margin: "0 auto", maxWidth: 960, padding: 24 }}>
      <header style={{ borderBottom: "1px solid #e5e7eb", marginBottom: 16, paddingBottom: 8 }}>
        <h1 style={{ fontSize: 28, margin: 0 }}>{title}</h1>
      </header>
      {children}
    </main>
  );
}

export function ModuleCard({ title, description }: { title: string; description: string }) {
  return (
    <section style={{ border: "1px solid #d1d5db", borderRadius: 12, marginBottom: 12, padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <p style={{ color: "#4b5563", marginBottom: 0 }}>{description}</p>
    </section>
  );
}

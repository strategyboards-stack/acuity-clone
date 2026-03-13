import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "3rem 1rem" }}>
      <h1>Acuity Clone</h1>
      <p>Phase 3A public scheduler foundation is available at the route below.</p>
      <Link href="/schedule">Open public scheduler</Link>
    </main>
  );
}

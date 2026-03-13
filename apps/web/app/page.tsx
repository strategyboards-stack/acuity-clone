import Link from "next/link";

export default function HomePage() {
  return (
    <main className="stack">
      <h1>Acuity Clone Foundation</h1>
      <div className="card stack">
        <p>Public booking surface is intentionally separated from authenticated client self-service.</p>
        <div className="stack">
          <Link href="/public">Go to public scheduler shell</Link>
          <Link href="/client/login">Client login</Link>
          <Link href="/client/signup">Client signup</Link>
        </div>
      </div>
    </main>
  );
}

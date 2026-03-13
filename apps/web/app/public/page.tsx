import Link from "next/link";

export default function PublicSchedulerShell() {
  return (
    <main className="stack">
      <h1>Public Scheduling Page</h1>
      <div className="card stack">
        <p>This is the public scheduler boundary. Authenticated client self-service lives under /client.</p>
        <Link href="/client/login">Returning client login</Link>
      </div>
    </main>
  );
}

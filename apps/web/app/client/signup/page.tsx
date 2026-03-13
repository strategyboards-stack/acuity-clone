import Link from "next/link";
import { AuthForm } from "@/components/client/auth-form";

export default function ClientSignupPage() {
  return (
    <main className="stack">
      <h1>Client signup</h1>
      <div className="card stack">
        <AuthForm mode="signup" />
        <Link href="/client/login">Already have an account? Log in</Link>
      </div>
    </main>
  );
}

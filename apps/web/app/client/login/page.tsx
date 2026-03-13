import Link from "next/link";
import { AuthForm } from "@/components/client/auth-form";

export default function ClientLoginPage() {
  return (
    <main className="stack">
      <h1>Client login</h1>
      <div className="card stack">
        <AuthForm mode="login" />
        <Link href="/client/reset-password">Forgot password?</Link>
        <Link href="/client/signup">Create an account</Link>
      </div>
    </main>
  );
}

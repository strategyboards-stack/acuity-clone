import Link from "next/link";
import { AuthForm } from "@/components/client/auth-form";

export default function ClientResetPasswordPage() {
  return (
    <main className="stack">
      <h1>Reset password</h1>
      <div className="card stack">
        <AuthForm mode="reset" />
        <Link href="/client/login">Back to login</Link>
      </div>
    </main>
  );
}

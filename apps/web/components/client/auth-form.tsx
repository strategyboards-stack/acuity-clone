"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Mode = "signup" | "login" | "reset";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus(null);

    const formData = new FormData(event.currentTarget);
    const payload: Record<string, string> = {
      email: String(formData.get("email") ?? "")
    };

    if (mode !== "reset") {
      payload.password = String(formData.get("password") ?? "");
    }
    if (mode === "signup") {
      payload.name = String(formData.get("name") ?? "");
    }

    const url =
      mode === "signup"
        ? "/api/client/auth/signup"
        : mode === "login"
          ? "/api/client/auth/login"
          : "/api/client/auth/reset-password";

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const body = (await response.json()) as { error?: string; message?: string };

    if (!response.ok) {
      setError(body.error ?? "Request failed.");
      return;
    }

    if (mode === "reset") {
      setStatus(body.message ?? "Check your email for reset instructions.");
      return;
    }

    router.push("/client");
    router.refresh();
  }

  return (
    <form className="stack" onSubmit={onSubmit}>
      {mode === "signup" && (
        <div className="stack">
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" required autoComplete="name" />
        </div>
      )}

      <div className="stack">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" />
      </div>

      {mode !== "reset" && (
        <div className="stack">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required autoComplete="current-password" />
        </div>
      )}

      <button type="submit">
        {mode === "signup" ? "Create account" : mode === "login" ? "Log in" : "Send reset link"}
      </button>
      {error && <p style={{ color: "#991b1b" }}>{error}</p>}
      {status && <p style={{ color: "#14532d" }}>{status}</p>}
    </form>
  );
}

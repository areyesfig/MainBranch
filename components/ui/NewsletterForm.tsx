"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok || res.status === 201) {
        setStatus("success");
        setMessage("Revisa tu email para confirmar la suscripción.");
        setEmail("");
      } else if (res.status === 429) {
        setStatus("error");
        setMessage("Demasiados intentos. Vuelve en una hora.");
      } else {
        setStatus("error");
        setMessage("Error al suscribirse. Intenta de nuevo.");
      }
    } catch {
      setStatus("error");
      setMessage("Error de conexión. Intenta de nuevo.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300">
        ✅ {message}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
          disabled={status === "loading"}
          className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          <Mail className="h-3.5 w-3.5" />
          {status === "loading" ? "..." : "Suscribirse"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-red-600 dark:text-red-400">{message}</p>
      )}
    </form>
  );
}

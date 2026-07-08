"use client";

import dynamic from "next/dynamic";

// The existing app is a client-rendered React Router SPA (Vite origin).
// We load it with `ssr: false` so browser-only APIs (window, history,
// Supabase auth) are never touched during server rendering.
const Providers = dynamic(() => import("./providers"), { ssr: false });

export default function Page() {
  return <Providers />;
}

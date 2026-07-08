"use client";

// Placeholder for non-public (authenticated) routes. The dashboard SPA
// currently can't be bundled by Next 16's Turbopack (deadlocks on a
// dependency in the client graph); it runs via `npm run dev:vite`.
// This keeps the Next build green for the SEO public pages.
export default function Page() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "system-ui" }}>
      <p>Loading…</p>
    </div>
  );
}

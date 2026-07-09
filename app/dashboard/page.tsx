"use client";

import { useEffect } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";
import Dashboard from "@/src/routes/Dashboard";

export default function DashboardPage() {
  const { user, sessionChecked } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (sessionChecked && !user) {
      router.replace("/login");
    }
  }, [sessionChecked, user, router]);

  if (!sessionChecked || !user) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return <Dashboard />;
}
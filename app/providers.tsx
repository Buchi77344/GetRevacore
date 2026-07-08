"use client";

import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/src/hooks/useAuth";
import App from "@/src/App";

export default function Providers() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
}

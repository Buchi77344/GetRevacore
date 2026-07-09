"use client";

import { AuthProvider } from "@/src/hooks/useAuth";
import { NotificationProvider } from "@/src/context/NotificationContext";
import { Toaster } from 'react-hot-toast';
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Toaster
          position="top-right"
          containerClassName="toaster-container"
          toastOptions={{
            style: {
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '12px',
              boxShadow: 'var(--shadow-lg)',
              fontFamily: 'var(--font-body)',
              padding: '12px 16px',
              backdropFilter: 'blur(8px)',
            },
            success: {
              style: {
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-primary)',
              },
              iconTheme: {
                primary: 'var(--color-sage)',
                secondary: 'var(--bg-secondary)',
              },
              duration: 4000,
            },
            error: {
              style: {
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-primary)',
              },
              iconTheme: {
                primary: 'var(--color-error)',
                secondary: 'var(--bg-secondary)',
              },
              duration: 5000,
            },
            loading: {
              style: {
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-primary)',
              },
              iconTheme: {
                primary: 'var(--color-ochre)',
                secondary: 'var(--bg-secondary)',
              },
              duration: 4000,
            },
            duration: 4000,
          }}
        />
        {children}
      </NotificationProvider>
    </AuthProvider>
  );
}
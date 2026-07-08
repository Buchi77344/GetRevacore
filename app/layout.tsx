import type { Metadata } from "next";
import "./globals.css";
import "@/src/index.css";
import "@/src/App.css";

export const metadata: Metadata = {
  title: "Bliss",
  description: "RevaCore CRM",
};

// Set the theme before paint to avoid a flash of the wrong theme.
// Mirrors the logic that used to live in src/main.tsx.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}var r=document.documentElement;r.setAttribute('data-theme',t);r.classList.remove('light','dark');r.classList.add(t);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

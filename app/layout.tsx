import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "@/src/index.css";
import "@/src/App.css";
import Providers from "./providers";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bliss - RevaCore CRM",
    template: "%s | Bliss - RevaCore CRM",
  },
  description:
    "RevaCore CRM - The intelligent CRM for real estate agents. Manage leads, properties, pipeline, and grow your agency.",
  keywords: [
    "real estate CRM",
    "property management",
    "lead management",
    "real estate agency",
    "RevaCore",
  ],
  openGraph: {
    title: "Bliss - RevaCore CRM",
    description:
      "The intelligent CRM for real estate agents. Manage leads, properties, pipeline, and grow your agency.",
    type: "website",
    siteName: "Bliss",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bliss - RevaCore CRM",
    description:
      "The intelligent CRM for real estate agents.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Set the theme before paint to avoid a flash of the wrong theme.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}var r=document.documentElement;r.setAttribute('data-theme',t);r.classList.remove('light','dark');r.classList.add(t);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${fraunces.variable}`}
    >
      <head>
        <Script id="theme-script" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
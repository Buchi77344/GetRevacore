export const siteConfig = {
  name: "Bliss",
  description: "A Next.js application built with the App Router.",
  url: "http://localhost:3000",
  links: {
    github: "https://github.com/your-username/bliss",
  },
} as const;

export type SiteConfig = typeof siteConfig;

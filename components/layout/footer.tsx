import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-black/5">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6 text-sm text-zinc-500">
        <span>
          &copy; {new Date().getFullYear()} {siteConfig.name}
        </span>
        <a
          href={siteConfig.links.github}
          target="_blank"
          rel="noreferrer"
          className="hover:text-zinc-900"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}

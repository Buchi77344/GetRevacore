import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Header() {
  return (
    <header className="border-b border-black/5">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
        <Link href="/" className="font-semibold tracking-tight">
          {siteConfig.name}
        </Link>
        <nav className="flex items-center gap-6 text-sm text-zinc-600">
          <Link href="/" className="hover:text-zinc-900">
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}

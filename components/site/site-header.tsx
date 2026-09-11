import Link from "next/link"

import registry from "@/registry.json"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center justify-between gap-4 px-6">
        <div className="flex items-baseline gap-6">
          <Link href="/" className="font-semibold tracking-tight">
            {registry.name}
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Components
            </Link>
          </nav>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}

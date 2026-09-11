"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export type SidebarGroup = {
  category: string
  items: { name: string; title: string }[]
}

export function ComponentsSidebar({ groups }: { groups: SidebarGroup[] }) {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Components"
      className="flex flex-col gap-6 pr-4 pb-10 text-sm"
    >
      {groups.map(({ category, items }) => (
        <div key={category} className="flex flex-col gap-1">
          <h4 className="px-3 py-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {category}
          </h4>
          <ul className="flex flex-col">
            {items.map((item) => {
              const href = `/components/${item.name}`
              const active = pathname === href
              return (
                <li key={item.name}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                      active && "bg-muted font-medium text-foreground"
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

import Link from "next/link"

import registry from "@/registry.json"
import { examplesFor } from "@/components/previews/examples"
import { ThemeToggle } from "@/components/theme-toggle"

export const metadata = {
  title: "Component previews",
}

export default function PreviewPage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-10 px-6 py-16">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            &larr; Back to registry
          </Link>
          <ThemeToggle />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Component previews
        </h1>
        <p className="text-muted-foreground">
          Live demos of every item in this registry.
        </p>
      </header>

      <div className="flex flex-col gap-8">
        {registry.items.map((item) => {
          const examples = examplesFor(item.name)

          return (
            <section
              key={item.name}
              className="flex flex-col overflow-hidden rounded-xl border"
            >
              <div className="flex flex-col gap-1 border-b bg-muted/40 px-6 py-4">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-medium">{item.title}</h2>
                  <code className="font-mono text-xs text-muted-foreground">
                    {item.type}
                  </code>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>

              <div className="flex flex-col gap-8 px-6 py-10">
                {examples.length > 0 ? (
                  examples.map((example) => (
                    <div key={example.name} className="flex flex-col gap-3">
                      {examples.length > 1 && (
                        <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                          {example.title}
                        </h3>
                      )}
                      <div className="flex min-h-24 items-center justify-center">
                        <example.component />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-muted-foreground">
                    No preview registered for this item. Add one in{" "}
                    <code className="font-mono">components/previews</code>.
                  </p>
                )}
              </div>

              <div className="border-t bg-muted/40 px-6 py-3">
                <code className="font-mono text-xs text-muted-foreground">
                  pnpm dlx shadcn@latest add @private/{item.name}
                </code>
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}

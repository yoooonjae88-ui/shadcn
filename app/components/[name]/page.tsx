import fs from "node:fs/promises"
import path from "node:path"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import registry from "@/registry.json"
import { examplesFor } from "@/components/previews/examples"
import { CopyButton } from "@/components/site/copy-button"
import { ExampleCard } from "@/components/site/example-card"
import { componentBlurb } from "@/lib/component-blurbs"

export function generateStaticParams() {
  return registry.items.map((item) => ({ name: item.name }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>
}): Promise<Metadata> {
  const { name } = await params
  const item = registry.items.find((i) => i.name === name)
  return { title: item ? item.title : "Component" }
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const item = registry.items.find((i) => i.name === name)
  if (!item) notFound()

  const installCommand = `pnpm dlx shadcn@latest add @private/${item.name}`

  // Read each example's source at render time (statically generated, so this
  // happens at build) for the code drawer.
  const examples = await Promise.all(
    examplesFor(item.name).map(async (example) => ({
      ...example,
      code: await fs.readFile(
        path.join(process.cwd(), example.file),
        "utf8"
      ),
    }))
  )

  return (
    <article className="flex flex-col gap-8 pb-16">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">
          {item.meta?.group || "Others"}
        </p>
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">
            {item.title}
          </h1>
          <code className="font-mono text-xs text-muted-foreground">
            {item.type}
          </code>
        </div>
        <p className="max-w-3xl text-muted-foreground">
          {componentBlurb(item, examples.length)}
        </p>
      </header>

      <div className="flex max-w-3xl items-center justify-between gap-4 rounded-lg bg-muted px-4 py-2">
        <code className="overflow-x-auto font-mono text-sm whitespace-nowrap">
          {installCommand}
        </code>
        <CopyButton text={installCommand} variant="ghost" />
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 xl:grid-cols-2">
        {examples.length > 0 ? (
          examples.map((example) => (
            <ExampleCard
              key={example.name}
              title={example.title}
              file={example.file}
              code={example.code}
              // A lone example (the unsplit kitchen-sink demo) gets the full
              // width instead of being squeezed into one column.
              className={examples.length === 1 ? "xl:col-span-2" : undefined}
            >
              <example.component />
            </ExampleCard>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No preview registered for this item. Add one in{" "}
            <code className="font-mono">components/previews</code>.
          </p>
        )}
      </div>
    </article>
  )
}

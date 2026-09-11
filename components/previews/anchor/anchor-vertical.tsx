"use client"

import * as React from "react"

import { Anchor } from "@/registry/anchor/anchor"

function Section({
  id,
  title,
  height = 224,
}: {
  id: string
  title: string
  height?: number
}) {
  return (
    <section id={id} style={{ minHeight: height }} className="px-4 py-3">
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <p className="mt-2 text-xs text-muted-foreground">
        Scroll or click a link on the anchor to jump here. The highlight and ink
        indicator follow whichever section is under the reading line.
      </p>
    </section>
  )
}

// A vertical table of contents with nested links; the ink segment slides along
// the rail as you scroll or click.
export function AnchorVerticalExample() {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState("")

  return (
    <div className="flex w-full max-w-3xl flex-col gap-2">
      <div className="flex gap-6">
        <div ref={scrollRef} className="h-72 flex-1 overflow-y-auto rounded-lg bg-muted/50">
          <Section id="anchor-intro" title="Introduction" />
          <Section id="anchor-usage" title="Usage" height={140} />
          <Section id="anchor-usage-items" title="Usage · items" height={140} />
          <Section id="anchor-usage-container" title="Usage · getContainer" height={140} />
          <Section id="anchor-api" title="API" height={288} />
        </div>
        <Anchor
          affix={false}
          showInkInFixed
          className="w-44 shrink-0 self-start"
          getContainer={() => scrollRef.current ?? window}
          onChange={setActive}
          items={[
            { key: "intro", href: "#anchor-intro", title: "Introduction" },
            {
              key: "usage",
              href: "#anchor-usage",
              title: "Usage",
              children: [
                { key: "items", href: "#anchor-usage-items", title: "items" },
                { key: "container", href: "#anchor-usage-container", title: "getContainer" },
              ],
            },
            { key: "api", href: "#anchor-api", title: "API" },
          ]}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {active ? `onChange: ${active}` : "scroll or click to see onChange"}
      </p>
    </div>
  )
}

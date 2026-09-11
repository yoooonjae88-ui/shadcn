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
        Scroll or click a link on the anchor to jump here. The highlight follows
        whichever section is under the reading line.
      </p>
    </section>
  )
}

// direction="horizontal" lays the links in a row with a sliding underline.
export function AnchorHorizontalExample() {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  return (
    <div className="flex w-full max-w-3xl flex-col gap-2">
      <Anchor
        direction="horizontal"
        affix={false}
        showInkInFixed
        getContainer={() => scrollRef.current ?? window}
        items={[
          { key: "one", href: "#anchor-h-one", title: "Overview" },
          { key: "two", href: "#anchor-h-two", title: "Features" },
          { key: "three", href: "#anchor-h-three", title: "Pricing" },
          { key: "four", href: "#anchor-h-four", title: "FAQ" },
        ]}
      />
      <div ref={scrollRef} className="h-56 overflow-y-auto rounded-lg bg-muted/50">
        <Section id="anchor-h-one" title="Overview" />
        <Section id="anchor-h-two" title="Features" />
        <Section id="anchor-h-three" title="Pricing" />
        <Section id="anchor-h-four" title="FAQ" height={240} />
      </div>
    </div>
  )
}

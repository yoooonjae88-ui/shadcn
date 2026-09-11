"use client"

import { Check, Sparkles, Tag as TagIcon } from "lucide-react"

import { Tag } from "@/registry/tag/tag"

export function TagIconsExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tag icon={<TagIcon />}>Label</Tag>
      <Tag variant="solid" status="success" icon={<Check />}>
        Verified
      </Tag>
      <Tag variant="outlined" status="processing" icon={<Sparkles />}>
        AI
      </Tag>
    </div>
  )
}

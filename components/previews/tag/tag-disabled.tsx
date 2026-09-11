"use client"

import { Hash } from "lucide-react"

import { Tag } from "@/registry/tag/tag"

export function TagDisabledExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tag disabled>Disabled</Tag>
      <Tag variant="solid" status="error" disabled>
        Disabled
      </Tag>
      <Tag variant="outlined" icon={<Hash />} disabled>
        Disabled
      </Tag>
    </div>
  )
}

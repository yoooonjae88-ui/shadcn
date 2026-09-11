"use client"

import { Space } from "@/registry/space/space"

// A node rendered between adjacent items.
export function SpaceSplitExample() {
  return (
    <Space split={<span className="h-4 w-px bg-border" aria-hidden />}>
      <a className="text-sm text-primary underline-offset-4 hover:underline" href="#space">
        Link
      </a>
      <a className="text-sm text-primary underline-offset-4 hover:underline" href="#space">
        Link
      </a>
      <a className="text-sm text-primary underline-offset-4 hover:underline" href="#space">
        Link
      </a>
    </Space>
  )
}

"use client"

import { Tag, type TagStatus } from "@/registry/tag/tag"

const STATUSES: TagStatus[] = ["default", "success", "processing", "warning", "error"]

export function TagSolidExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {STATUSES.map((status) => (
        <Tag key={status} variant="solid" status={status}>
          {status}
        </Tag>
      ))}
    </div>
  )
}

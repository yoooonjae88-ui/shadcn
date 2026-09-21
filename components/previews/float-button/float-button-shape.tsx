"use client"

import { Plus, Settings } from "lucide-react"

import { FloatButton } from "@/registry/float-button/float-button"

export function FloatButtonShapeExample() {
  return (
    <div className="relative h-56 w-full overflow-hidden rounded-xl bg-muted/40">
      <FloatButton
        position="absolute"
        offset={{ x: 88, y: 16 }}
        shape="square"
        icon={<Settings />}
        aria-label="Settings"
      />
      <FloatButton
        position="absolute"
        offset={16}
        shape="circle"
        type="primary"
        icon={<Plus />}
        aria-label="New item"
      />
    </div>
  )
}

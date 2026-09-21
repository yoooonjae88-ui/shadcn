"use client"

import { BookOpen } from "lucide-react"

import { FloatButton } from "@/registry/float-button/float-button"

export function FloatButtonDescriptionExample() {
  return (
    <div className="relative h-56 w-full overflow-hidden rounded-xl bg-muted/40">
      {/* A description needs the square shape — a circle has no room for it. */}
      <FloatButton
        position="absolute"
        offset={{ x: 112, y: 16 }}
        shape="square"
        icon={null}
        description="HELP"
        aria-label="Help"
      />
      <FloatButton
        position="absolute"
        offset={16}
        shape="square"
        type="primary"
        icon={<BookOpen />}
        description="Docs"
        aria-label="Open docs"
      />
    </div>
  )
}

"use client"

import * as React from "react"
import { Camera, Image as ImageIcon, Sparkles } from "lucide-react"

import { FloatButton } from "@/registry/float-button/float-button"

export function FloatButtonControlledExample() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-xl bg-muted/40 p-5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
      >
        {open ? "Close" : "Open"} the menu
      </button>

      {/* Pass `open` to drive the menu yourself; `onOpenChange` reports the
          group's own toggles so the two stay in sync. */}
      <FloatButton.Group
        position="absolute"
        offset={16}
        trigger="click"
        type="primary"
        open={open}
        onOpenChange={setOpen}
        icon={<Sparkles />}
        triggerLabel="Create"
      >
        <FloatButton icon={<Camera />} tooltip="Photo" aria-label="Photo" />
        <FloatButton icon={<ImageIcon />} tooltip="Image" aria-label="Image" />
      </FloatButton.Group>
    </div>
  )
}

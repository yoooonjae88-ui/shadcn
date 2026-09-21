"use client"

import { MessageCircleQuestionMark } from "lucide-react"

import { FloatButton } from "@/registry/float-button/float-button"

export function FloatButtonBasicExample() {
  return (
    // The float button pins itself to a corner. `position="absolute"` keeps it
    // inside this box; the default, "fixed", pins it to the viewport instead.
    <div className="relative h-44 w-full overflow-hidden rounded-xl bg-muted/40 p-5">
      <div className="flex flex-col gap-2.5">
        <div className="h-2.5 w-40 rounded-full bg-muted-foreground/20" />
        <div className="h-2.5 w-64 rounded-full bg-muted-foreground/15" />
        <div className="h-2.5 w-52 rounded-full bg-muted-foreground/15" />
      </div>

      <FloatButton
        position="absolute"
        offset={16}
        icon={<MessageCircleQuestionMark />}
        aria-label="Help"
      />
    </div>
  )
}

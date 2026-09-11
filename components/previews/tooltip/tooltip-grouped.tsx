"use client"

import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"

import { Button } from "@/registry/button/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/tooltip/tooltip"

// A shared provider makes adjacent tooltips open instantly once one is shown.
export function TooltipGroupedExample() {
  return (
    <TooltipProvider delay={200}>
      <div className="flex items-center gap-1">
        {[
          { icon: BoldIcon, label: "Bold" },
          { icon: ItalicIcon, label: "Italic" },
          { icon: UnderlineIcon, label: "Underline" },
        ].map(({ icon: Icon, label }) => (
          <Tooltip key={label}>
            <TooltipTrigger
              render={<Button variant="ghost" size="icon" aria-label={label} />}
            >
              <Icon />
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}

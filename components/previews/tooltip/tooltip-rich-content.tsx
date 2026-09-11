"use client"

import { InfoIcon } from "lucide-react"

import { Button } from "@/registry/button/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/tooltip/tooltip"

// A tooltip can hold a title, description and keyboard hints.
export function TooltipRichContentExample() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="More info" />}>
        <InfoIcon />
      </TooltipTrigger>
      <TooltipContent className="max-w-64 px-3.5 py-3" align="start">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold">Keyboard shortcut</span>
          <span className="text-tooltip-foreground/80">
            Press the keys below to delete the selected item without a
            confirmation dialog.
          </span>
          <span className="mt-1.5 inline-flex items-center gap-1">
            <kbd className="rounded bg-tooltip-foreground/15 px-1.5 py-0.5 font-mono text-[0.7rem]">
              ⌘
            </kbd>
            <kbd className="rounded bg-tooltip-foreground/15 px-1.5 py-0.5 font-mono text-[0.7rem]">
              ⌫
            </kbd>
          </span>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

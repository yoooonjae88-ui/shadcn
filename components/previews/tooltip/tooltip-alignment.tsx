"use client"

import { Button } from "@/registry/button/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/tooltip/tooltip"

export function TooltipAlignmentExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {(["start", "center", "end"] as const).map((align) => (
        <Tooltip key={align}>
          <TooltipTrigger render={<Button variant="outline" className="capitalize" />}>
            {align}
          </TooltipTrigger>
          <TooltipContent side="bottom" align={align} className="max-w-none">
            Aligned to the {align}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}

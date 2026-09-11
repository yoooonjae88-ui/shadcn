"use client"

import { Button } from "@/registry/button/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/tooltip/tooltip"

export function TooltipArrowExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">With arrow</Button>} />
        <TooltipContent>Points at the trigger</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">No arrow</Button>} />
        <TooltipContent showArrow={false}>Clean edge</TooltipContent>
      </Tooltip>
    </div>
  )
}

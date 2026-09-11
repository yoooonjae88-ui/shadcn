"use client"

import { Button } from "@/registry/button/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/tooltip/tooltip"

export function TooltipDelayExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tooltip>
        <TooltipTrigger delay={0} render={<Button variant="outline">Instant</Button>} />
        <TooltipContent>Opens with no delay</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger delay={1000} render={<Button variant="outline">Slow (1s)</Button>} />
        <TooltipContent>Waited a second</TooltipContent>
      </Tooltip>
    </div>
  )
}

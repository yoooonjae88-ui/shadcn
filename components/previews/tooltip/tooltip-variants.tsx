"use client"

import { Button } from "@/registry/button/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/tooltip/tooltip"

const variants = [
  "default",
  "primary",
  "secondary",
  "destructive",
  "success",
  "warning",
  "info",
] as const

export function TooltipVariantsExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {variants.map((variant) => (
        <Tooltip key={variant}>
          <TooltipTrigger render={<Button variant="outline" className="capitalize" />}>
            {variant}
          </TooltipTrigger>
          <TooltipContent variant={variant} className="capitalize">
            {variant}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}

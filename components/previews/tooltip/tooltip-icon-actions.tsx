"use client"

import { PlusIcon, TrashIcon } from "lucide-react"

import { Button } from "@/registry/button/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/tooltip/tooltip"

// Icon-only actions, plus a disabled trigger that suppresses its tooltip.
export function TooltipIconActionsExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tooltip>
        <TooltipTrigger render={<Button size="icon" aria-label="Add item" />}>
          <PlusIcon />
        </TooltipTrigger>
        <TooltipContent variant="primary">Add item</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="destructive" size="icon" aria-label="Delete" />}>
          <TrashIcon />
        </TooltipTrigger>
        <TooltipContent variant="destructive">Delete forever</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger disabled render={<Button variant="outline">No tooltip</Button>} />
        <TooltipContent>You will never see me</TooltipContent>
      </Tooltip>
    </div>
  )
}

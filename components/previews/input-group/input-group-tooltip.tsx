"use client"

import { AtSign, Info } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/input-group/input-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/tooltip/tooltip"

export function InputGroupTooltipExample() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupAddon>
        <AtSign />
      </InputGroupAddon>
      <InputGroupInput type="email" placeholder="you@example.com" />
      <InputGroupAddon align="inline-end">
        <Tooltip>
          <TooltipTrigger
            render={
              <InputGroupButton size="icon-xs" aria-label="More info">
                <Info />
              </InputGroupButton>
            }
          />
          <TooltipContent>We’ll never share your email.</TooltipContent>
        </Tooltip>
      </InputGroupAddon>
    </InputGroup>
  )
}

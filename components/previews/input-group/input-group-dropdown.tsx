"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/dropdown/dropdown"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/input-group/input-group"

export function InputGroupDropdownExample() {
  const [currency, setCurrency] = React.useState("USD")

  return (
    <InputGroup className="max-w-sm">
      <InputGroupAddon>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <InputGroupButton>
                {currency}
                <ChevronDown />
              </InputGroupButton>
            }
          />
          <DropdownMenuContent align="start">
            {["USD", "EUR", "GBP"].map((c) => (
              <DropdownMenuItem key={c} onClick={() => setCurrency(c)}>
                {c}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </InputGroupAddon>
      <InputGroupInput placeholder="0.00" inputMode="decimal" />
    </InputGroup>
  )
}

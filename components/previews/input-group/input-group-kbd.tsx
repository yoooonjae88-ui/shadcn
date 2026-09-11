"use client"

import { Search } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/input-group/input-group"

export function InputGroupKbdExample() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupInput placeholder="Quick search" />
      <InputGroupAddon align="inline-end">
        <kbd className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </InputGroupAddon>
    </InputGroup>
  )
}

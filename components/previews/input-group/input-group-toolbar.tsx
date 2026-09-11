"use client"

import { Bold, Italic } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/registry/input-group/input-group"

// A textarea with a block-start formatting toolbar.
export function InputGroupToolbarExample() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupAddon align="block-start">
        <InputGroupButton size="icon-xs" aria-label="Bold">
          <Bold />
        </InputGroupButton>
        <InputGroupButton size="icon-xs" aria-label="Italic">
          <Italic />
        </InputGroupButton>
      </InputGroupAddon>
      <InputGroupTextarea placeholder="Write a note…" className="min-h-16" />
    </InputGroup>
  )
}

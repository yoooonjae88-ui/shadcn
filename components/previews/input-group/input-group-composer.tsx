"use client"

import { Mic, Paperclip, Send } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/registry/input-group/input-group"

// A textarea composer with a block-end toolbar.
export function InputGroupComposerExample() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupTextarea placeholder="Ask anything…" className="min-h-16" />
      <InputGroupAddon align="block-end">
        <InputGroupButton size="icon-xs" aria-label="Attach">
          <Paperclip />
        </InputGroupButton>
        <InputGroupButton size="icon-xs" aria-label="Dictate">
          <Mic />
        </InputGroupButton>
        <InputGroupButton variant="default" className="ml-auto" aria-label="Send">
          Send
          <Send />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

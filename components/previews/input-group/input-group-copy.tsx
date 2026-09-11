"use client"

import * as React from "react"
import { Check, Copy, CreditCard } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/input-group/input-group"

export function InputGroupCopyExample() {
  const [copied, setCopied] = React.useState(false)

  return (
    <InputGroup className="max-w-sm">
      <InputGroupAddon>
        <CreditCard />
      </InputGroupAddon>
      <InputGroupInput readOnly defaultValue="4242 4242 4242 4242" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          aria-label="Copy"
          onClick={() => {
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1200)
          }}
        >
          {copied ? <Check /> : <Copy />}
          {copied ? "Copied" : "Copy"}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

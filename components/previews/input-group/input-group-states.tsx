"use client"

import { AtSign, Search } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/input-group/input-group"

export function InputGroupStatesExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <InputGroup>
        <InputGroupAddon>
          <AtSign />
        </InputGroupAddon>
        <InputGroupInput aria-invalid defaultValue="not-an-email" />
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput disabled placeholder="Disabled" />
      </InputGroup>
    </div>
  )
}

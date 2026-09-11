"use client"

import { LoaderCircle } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/input-group/input-group"

export function InputGroupLoadingExample() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupInput placeholder="Checking availability…" />
      <InputGroupAddon align="inline-end">
        <LoaderCircle className="animate-spin" />
      </InputGroupAddon>
    </InputGroup>
  )
}

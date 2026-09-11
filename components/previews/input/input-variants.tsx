"use client"

import { Input } from "@/registry/input/input"

export function InputVariantsExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Input variant="filled" placeholder="Filled (default)" />
      <Input variant="outlined" placeholder="Outlined" />
      <Input variant="borderless" placeholder="Borderless" />
      <Input variant="underlined" placeholder="Underlined" />
    </div>
  )
}

"use client"

import { Input } from "@/registry/input/input"

// Sizes: large / middle / small.
export function InputBasicExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Input size="large" placeholder="Large" />
      <Input placeholder="Middle (default)" />
      <Input size="small" placeholder="Small" />
    </div>
  )
}

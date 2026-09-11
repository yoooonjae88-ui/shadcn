"use client"

import { Globe } from "lucide-react"

import { Input } from "@/registry/input/input"

// Addons attach outside the input frame.
export function InputAddonsExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Input addonBefore="https://" addonAfter=".com" placeholder="mysite" />
      <Input addonBefore={<Globe />} placeholder="Website" />
    </div>
  )
}

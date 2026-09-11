"use client"

import { Mail } from "lucide-react"

import { Input } from "@/registry/input/input"

export function InputStatusExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Input status="error" placeholder="Error" />
      <Input status="warning" placeholder="Warning" />
      <Input variant="outlined" status="error" prefix={<Mail />} placeholder="Outlined error" />
      <Input disabled placeholder="Disabled" defaultValue="Can't touch this" />
    </div>
  )
}

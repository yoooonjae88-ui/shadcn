"use client"

import { Input } from "@/registry/input/input"

export function InputPasswordExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Input.Password placeholder="Password" defaultValue="hunter2" />
      <Input.Password
        placeholder="No toggle"
        visibilityToggle={false}
        defaultValue="hunter2"
      />
    </div>
  )
}

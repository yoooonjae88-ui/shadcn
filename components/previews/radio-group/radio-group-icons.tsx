"use client"

import { MessageCircle, Smartphone, Mail } from "lucide-react"

import { RadioGroup, RadioGroupItem } from "@/registry/radio-group/radio-group"

const options = [
  { value: "email", label: "Email", icon: Mail },
  { value: "phone", label: "Phone", icon: Smartphone },
  { value: "chat", label: "Chat", icon: MessageCircle },
]

// A list panel: separated rows inside a single card surface.
export function RadioGroupIconsExample() {
  return (
    <div className="w-full max-w-xs rounded-xl bg-card text-card-foreground shadow-xs">
      <RadioGroup defaultValue="email" className="gap-0">
        {options.map((option, index) => (
          <div key={option.value}>
            {index > 0 && <div className="h-px bg-border" aria-hidden="true" />}
            <label className="flex cursor-pointer items-center justify-between gap-2.5 px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-medium">
                <option.icon aria-hidden="true" className="size-4 opacity-60" />
                {option.label}
              </span>
              <RadioGroupItem value={option.value} />
            </label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

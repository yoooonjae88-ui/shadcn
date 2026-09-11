"use client"

import { RadioGroup, RadioGroupItem } from "@/registry/radio-group/radio-group"

export function RadioGroupInvalidExample() {
  return (
    <RadioGroup defaultValue="email" className="w-fit">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="email" id="rg-invalid-email" aria-invalid />
        <label htmlFor="rg-invalid-email" className="text-sm font-medium text-destructive">
          Email only
        </label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="sms" id="rg-invalid-sms" aria-invalid />
        <label htmlFor="rg-invalid-sms" className="text-sm font-medium text-destructive">
          SMS only
        </label>
      </div>
      <p className="text-sm text-muted-foreground">
        Pick a notification channel to continue.
      </p>
    </RadioGroup>
  )
}

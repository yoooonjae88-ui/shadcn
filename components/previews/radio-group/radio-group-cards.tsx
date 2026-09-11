"use client"

import { RadioGroup, RadioGroupItem } from "@/registry/radio-group/radio-group"

// The label wraps the whole surface, so clicking anywhere selects the radio;
// the checked card is highlighted with a ring.
const cardLabel =
  "flex cursor-pointer items-center justify-between gap-4 rounded-xl bg-card p-4 text-card-foreground shadow-xs transition-[box-shadow,background-color] has-data-checked:ring-2 has-data-checked:ring-primary"

const plans = [
  { value: "plus", title: "Plus", description: "For individuals and small teams." },
  { value: "pro", title: "Pro", description: "For growing businesses." },
]

export function RadioGroupCardsExample() {
  return (
    <RadioGroup defaultValue="plus" className="w-full max-w-xs">
      {plans.map((plan) => (
        <label key={plan.value} className={cardLabel}>
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">{plan.title}</span>
            <span className="text-sm text-muted-foreground">{plan.description}</span>
          </span>
          <RadioGroupItem value={plan.value} />
        </label>
      ))}
    </RadioGroup>
  )
}

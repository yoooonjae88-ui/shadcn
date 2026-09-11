"use client"

import { RadioGroup, RadioGroupItem } from "@/registry/radio-group/radio-group"

const cardLabel =
  "flex cursor-pointer items-start gap-2.5 rounded-xl bg-card p-4 text-card-foreground shadow-xs transition-[box-shadow,background-color] has-data-checked:ring-2 has-data-checked:ring-primary"

const plans = [
  {
    value: "free",
    title: "Free",
    price: "$0",
    description: "For personal projects and experiments.",
  },
  {
    value: "pro",
    title: "Pro",
    price: "$19",
    description: "For professionals and small teams.",
  },
  {
    value: "enterprise",
    title: "Enterprise",
    price: "$49",
    description: "For organizations with advanced needs.",
  },
]

export function RadioGroupPricingExample() {
  return (
    <RadioGroup defaultValue="pro" className="w-full max-w-xs">
      {plans.map((plan) => (
        <label key={plan.value} className={cardLabel}>
          <RadioGroupItem value={plan.value} className="mt-0.5" />
          <span className="flex min-w-0 grow flex-col gap-0.5">
            <span className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">{plan.title}</span>
              <span className="text-sm font-semibold">{plan.price}/mo</span>
            </span>
            <span className="text-sm text-muted-foreground">{plan.description}</span>
          </span>
        </label>
      ))}
    </RadioGroup>
  )
}

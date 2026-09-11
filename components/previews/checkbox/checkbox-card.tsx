"use client"

import { Checkbox } from "@/registry/checkbox/checkbox"

const plans = [
  {
    value: "analytics",
    title: "Analytics",
    description: "Track visitors and conversions in real time.",
    defaultChecked: true,
  },
  {
    value: "reports",
    title: "Reports",
    description: "Weekly summaries delivered to your inbox.",
    defaultChecked: false,
  },
]

// Whole cards act as checkbox labels and highlight while checked.
export function CheckboxCardExample() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      {plans.map((plan) => (
        <label
          key={plan.value}
          className="flex cursor-pointer items-start gap-3 rounded-xl bg-card p-4 text-card-foreground shadow-xs transition-[box-shadow,background-color] has-data-checked:ring-2 has-data-checked:ring-primary has-data-disabled:cursor-not-allowed has-data-disabled:opacity-60"
        >
          <Checkbox defaultChecked={plan.defaultChecked} className="mt-0.5" />
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-medium leading-none">{plan.title}</span>
            <span className="text-sm text-muted-foreground">{plan.description}</span>
          </span>
        </label>
      ))}
    </div>
  )
}

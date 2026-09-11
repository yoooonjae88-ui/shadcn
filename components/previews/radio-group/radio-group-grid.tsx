"use client"

import { ChartColumn, CircleDollarSign, CreditCard, FileText } from "lucide-react"

import { RadioGroup, RadioGroupItem } from "@/registry/radio-group/radio-group"

const cardLabel =
  "relative flex cursor-pointer flex-col items-start gap-3 rounded-xl bg-card p-4 text-card-foreground shadow-xs transition-[box-shadow,background-color] has-data-checked:ring-2 has-data-checked:ring-primary"

const items = [
  {
    value: "payments",
    title: "Payments",
    description: "Receive payments from your customers",
    icon: CircleDollarSign,
  },
  {
    value: "invoices",
    title: "Invoices",
    description: "Create and send invoices to your customers",
    icon: FileText,
  },
  {
    value: "billing",
    title: "Billing",
    description: "Manage your billing and subscriptions",
    icon: CreditCard,
  },
  {
    value: "reports",
    title: "Reports",
    description: "View your reports and analytics",
    icon: ChartColumn,
  },
]

export function RadioGroupGridExample() {
  return (
    <RadioGroup defaultValue="payments" className="grid w-full max-w-sm grid-cols-2 gap-4">
      {items.map((item) => (
        <label key={item.value} className={cardLabel}>
          <span className="absolute top-3 right-3">
            <RadioGroupItem value={item.value} />
          </span>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
            <item.icon aria-hidden="true" className="size-4" />
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold">{item.title}</span>
            <span className="text-xs text-muted-foreground">{item.description}</span>
          </span>
        </label>
      ))}
    </RadioGroup>
  )
}

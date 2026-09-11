"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { Button } from "@/registry/button/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTitle,
  CardToolbar,
} from "@/registry/card/card"

const usageBreakdown = [
  { label: "API requests", used: "8,200", limit: "10,000" },
  { label: "Bandwidth", used: "42 GB", limit: "100 GB" },
  { label: "Team seats", used: "6", limit: "10" },
]

// A header toolbar toggles an expandable region.
export function CardExpandableExample() {
  const [open, setOpen] = React.useState(false)

  return (
    <Card className="w-full max-w-sm">
      <CardHeader separator>
        <CardHeading>
          <CardTitle>Billing usage</CardTitle>
          <CardDescription>Current cycle · resets in 12 days</CardDescription>
        </CardHeading>
        <CardToolbar>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            {open ? "Hide" : "Details"}
            <ChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
          </Button>
        </CardToolbar>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-6">
        <div>
          <p className="font-heading text-2xl font-semibold">$248.00</p>
          <p className="text-sm text-muted-foreground">82% of your monthly plan used</p>
        </div>
        {open ? (
          <div className="flex flex-col gap-3">
            {usageBreakdown.map((row) => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium">
                  {row.used} <span className="text-muted-foreground">/ {row.limit}</span>
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
      <CardFooter separator className="justify-end pt-6">
        <Button size="sm">Manage plan</Button>
      </CardFooter>
    </Card>
  )
}

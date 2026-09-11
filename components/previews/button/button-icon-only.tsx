"use client"

import { Check, Plus, Settings } from "lucide-react"

import { Button } from "@/registry/button/button"

export function ButtonIconOnlyExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button size="icon" aria-label="Settings">
        <Settings />
      </Button>
      <Button size="icon" variant="outline" shape="circle" aria-label="Add">
        <Plus />
      </Button>
      <Button size="icon-sm" variant="ghost" aria-label="Confirm">
        <Check />
      </Button>
      <Button shape="pill" variant="secondary">
        Pill
      </Button>
    </div>
  )
}

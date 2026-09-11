"use client"

import { ArrowRight, Plus, Trash2 } from "lucide-react"

import { Button } from "@/registry/button/button"

export function ButtonIconsExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button>
        <Plus />
        New item
      </Button>
      <Button variant="outline">
        Continue
        <ArrowRight />
      </Button>
      <Button variant="destructive">
        <Trash2 />
        Delete
      </Button>
    </div>
  )
}

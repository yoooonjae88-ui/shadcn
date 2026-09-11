"use client"

import * as React from "react"

import { Button, ButtonArrow } from "@/registry/button/button"

// ButtonArrow rotates 180° while the button is aria-expanded.
export function ButtonArrowExample() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        variant="outline"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        Options
        <ButtonArrow />
      </Button>
      <Button variant="ghost" aria-expanded={open}>
        Menu
        <ButtonArrow />
      </Button>
    </div>
  )
}

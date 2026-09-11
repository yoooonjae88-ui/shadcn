"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Divider, type DividerProps } from "@/registry/divider/divider"

const variantOptions = ["solid", "dashed", "dotted"] satisfies DividerProps["variant"][]

const paragraph =
  "A design is not just what it looks like and feels like — a design is how it works."

export function DividerVariantsExample() {
  const [variant, setVariant] = React.useState<DividerProps["variant"]>("solid")

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {variantOptions.map((option) => (
          <Button
            key={option}
            size="sm"
            variant={variant === option ? "default" : "outline"}
            onClick={() => setVariant(option)}
          >
            {option}
          </Button>
        ))}
      </div>
      <div className="text-sm">
        <p>{paragraph}</p>
        <Divider variant={variant} />
        <p>{paragraph}</p>
        <Divider variant={variant}>Title</Divider>
        <p>{paragraph}</p>
      </div>
    </div>
  )
}

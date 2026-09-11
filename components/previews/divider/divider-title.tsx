"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Divider, type DividerProps } from "@/registry/divider/divider"

const orientationOptions = ["start", "center", "end"] satisfies DividerProps["orientation"][]

const paragraph =
  "A design is not just what it looks like and feels like — a design is how it works."

export function DividerTitleExample() {
  const [orientation, setOrientation] =
    React.useState<DividerProps["orientation"]>("center")
  const [plain, setPlain] = React.useState(false)

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {orientationOptions.map((option) => (
          <Button
            key={option}
            size="sm"
            variant={orientation === option ? "default" : "outline"}
            onClick={() => setOrientation(option)}
          >
            {option}
          </Button>
        ))}
        <Button
          size="sm"
          variant={plain ? "default" : "outline"}
          onClick={() => setPlain((value) => !value)}
        >
          plain
        </Button>
      </div>
      <div className="text-sm">
        <p>{paragraph}</p>
        <Divider orientation={orientation} plain={plain}>
          Title
        </Divider>
        <p>{paragraph}</p>
      </div>
    </div>
  )
}

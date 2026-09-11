"use client"

import * as React from "react"

import { Button } from "@/registry/button/button"
import { RadioGroup, RadioGroupItem } from "@/registry/radio-group/radio-group"

const options = [
  { value: "standard", label: "Standard (3-5 days)" },
  { value: "express", label: "Express (1-2 days)" },
  { value: "overnight", label: "Overnight" },
]

export function RadioGroupFormExample() {
  const [submitted, setSubmitted] = React.useState<string | null>(null)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // The group's `name` is the form field key; its value is the selected item.
    const data = new FormData(event.currentTarget)
    setSubmitted(String(data.get("shipping")))
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-fit flex-col gap-4">
      <RadioGroup name="shipping" defaultValue="standard">
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <RadioGroupItem value={option.value} id={`rg-form-${option.value}`} />
            <label
              htmlFor={`rg-form-${option.value}`}
              className="text-sm font-medium"
            >
              {option.label}
            </label>
          </div>
        ))}
      </RadioGroup>
      <Button type="submit" className="w-fit">
        Submit
      </Button>
      {submitted !== null && (
        <p className="text-sm text-muted-foreground">
          Submitted <code className="font-mono">shipping</code>:{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
            {submitted}
          </code>
        </p>
      )}
    </form>
  )
}

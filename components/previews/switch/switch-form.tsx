"use client"

import * as React from "react"

import { Switch } from "@/registry/switch/switch"

export function SwitchFormExample() {
  const [submitted, setSubmitted] = React.useState<string | null>(null)
  return (
    <form
      className="flex w-full max-w-xs flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setSubmitted(data.get("marketing") === "on" ? "Subscribed" : "Not subscribed")
      }}
    >
      <label className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium select-none">Subscribe to newsletter</span>
        <Switch name="marketing" defaultChecked />
      </label>
      <button
        type="submit"
        className="w-fit rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
      >
        Save
      </button>
      {submitted && <p className="text-sm text-muted-foreground">{submitted}</p>}
    </form>
  )
}

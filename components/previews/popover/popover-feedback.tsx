"use client"

import * as React from "react"

import { PopoverFeedback } from "@/registry/popover/popover"

// A feedback-collection popover with sentiment, category chips and a message.
export function PopoverFeedbackExample() {
  const [saved, setSaved] = React.useState<string | null>(null)

  return (
    <div className="flex flex-col items-start gap-3">
      <PopoverFeedback
        categories={[
          { value: "issue", label: "Issue" },
          { value: "idea", label: "Idea" },
          { value: "other", label: "Other" },
        ]}
        onSubmit={async (value) => {
          await new Promise((resolve) => setTimeout(resolve, 900))
          setSaved(
            `feedback ${value.sentiment ?? "—"} · ${value.category ?? "no category"} · "${value.message}"`
          )
        }}
      />
      {saved ? (
        <p className="text-xs text-muted-foreground">
          Submitted: <code>{saved}</code>
        </p>
      ) : null}
    </div>
  )
}

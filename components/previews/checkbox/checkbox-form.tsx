"use client"

import * as React from "react"

import { Checkbox } from "@/registry/checkbox/checkbox"

// A required checkbox validated on submit.
export function CheckboxFormExample() {
  const id = React.useId()
  const [accepted, setAccepted] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)

  const showError = submitted && !accepted

  return (
    <form
      className="flex w-[300px] flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(true)
      }}
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Checkbox
            id={id}
            name="acceptTerms"
            required
            checked={accepted}
            onCheckedChange={setAccepted}
            aria-invalid={showError}
          />
          <label
            htmlFor={id}
            className={`cursor-pointer text-sm font-medium leading-none ${
              showError ? "text-destructive" : ""
            }`}
          >
            I accept the terms and conditions
          </label>
        </div>
        <p
          className={
            showError ? "text-sm text-destructive" : "text-sm text-muted-foreground"
          }
        >
          {showError
            ? "You must accept the terms and conditions."
            : "You need to agree to proceed."}
        </p>
        {submitted && accepted && (
          <p className="text-sm text-primary">Form submitted successfully.</p>
        )}
      </div>
      <div className="flex items-center justify-end gap-2.5">
        <button
          type="reset"
          onClick={() => {
            setAccepted(false)
            setSubmitted(false)
          }}
          className="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground outline-none transition-colors hover:bg-secondary/80 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Reset
        </button>
        <button
          type="submit"
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground outline-none transition-colors hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Submit
        </button>
      </div>
    </form>
  )
}

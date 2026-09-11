"use client"

import * as React from "react"

import { Button } from "@/registry/button/button"
import {
  Dropdown,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownLabel,
  DropdownTrigger,
  DropdownValue,
} from "@/registry/dropdown/dropdown"

// Maps option values to the labels shown in the trigger once selected.
const timezones = {
  "europe/amsterdam": "Amsterdam",
  "europe/london": "London",
  "america/new_york": "New York",
  "america/los_angeles": "Los Angeles",
}

// A form SELECT that submits its value with the form.
export function DropdownSelectExample() {
  const [submitted, setSubmitted] = React.useState<string | null>(null)

  return (
    <form
      className="flex flex-col items-start gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setSubmitted(String(data.get("timezone")))
      }}
    >
      <label className="text-sm font-medium" htmlFor="timezone-trigger">
        Timezone
      </label>
      <Dropdown name="timezone" items={timezones} required>
        <DropdownTrigger id="timezone-trigger">
          <DropdownValue placeholder="Select a timezone" />
        </DropdownTrigger>
        <DropdownContent>
          <DropdownGroup>
            <DropdownLabel>Europe</DropdownLabel>
            <DropdownItem value="europe/amsterdam">Amsterdam</DropdownItem>
            <DropdownItem value="europe/london">London</DropdownItem>
          </DropdownGroup>
          <DropdownGroup>
            <DropdownLabel>America</DropdownLabel>
            <DropdownItem value="america/new_york">New York</DropdownItem>
            <DropdownItem value="america/los_angeles">Los Angeles</DropdownItem>
          </DropdownGroup>
        </DropdownContent>
      </Dropdown>
      <Button type="submit">Submit</Button>
      {submitted ? (
        <p className="text-xs text-muted-foreground">
          Submitted value: <code>{submitted}</code>
        </p>
      ) : null}
    </form>
  )
}

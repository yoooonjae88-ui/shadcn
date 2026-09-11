"use client"

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  DropdownValue,
} from "@/registry/dropdown/dropdown"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/registry/field/field"

// Stacks below the group's own @md container width, inline above it.
export function FieldResponsiveExample() {
  return (
    <FieldGroup className="w-full max-w-xl">
      <Field orientation="responsive">
        <FieldContent>
          <FieldLabel htmlFor="field-timezone">Timezone</FieldLabel>
          <FieldDescription>Used for scheduling and digests.</FieldDescription>
        </FieldContent>
        <Dropdown
          items={{
            "europe/london": "London",
            "america/new_york": "New York",
          }}
        >
          <DropdownTrigger id="field-timezone">
            <DropdownValue placeholder="Select…" />
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem value="europe/london">London</DropdownItem>
            <DropdownItem value="america/new_york">New York</DropdownItem>
          </DropdownContent>
        </Dropdown>
      </Field>
    </FieldGroup>
  )
}

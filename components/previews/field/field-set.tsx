"use client"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/registry/field/field"
import { Slider } from "@/registry/slider/slider"

// FieldSet and FieldLegend caption a group of related fields.
export function FieldSetExample() {
  return (
    <FieldSet className="w-full max-w-sm">
      <FieldLegend>Notifications</FieldLegend>
      <FieldDescription>Choose how often we reach out.</FieldDescription>
      <FieldGroup>
        <Field orientation="horizontal">
          <Slider defaultValue={40} className="w-full max-w-xs" />
          <FieldContent>
            <FieldLabel>Digest volume</FieldLabel>
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}

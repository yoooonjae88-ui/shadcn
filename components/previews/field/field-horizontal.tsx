"use client"

import { Checkbox } from "@/registry/checkbox/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/registry/field/field"
import { Switch } from "@/registry/switch/switch"

// The control leads and the text sits beside it in FieldContent.
export function FieldHorizontalExample() {
  return (
    <FieldGroup className="w-full max-w-sm">
      <Field orientation="horizontal">
        <Switch id="field-marketing" defaultChecked />
        <FieldContent>
          <FieldLabel htmlFor="field-marketing">Marketing emails</FieldLabel>
          <FieldDescription>
            Product news and the occasional announcement.
          </FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="field-terms" />
        <FieldContent>
          <FieldLabel htmlFor="field-terms">I agree to the terms</FieldLabel>
          <FieldDescription>
            You can review them any time in settings.
          </FieldDescription>
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}

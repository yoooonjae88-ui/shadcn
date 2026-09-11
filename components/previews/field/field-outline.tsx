"use client"

import { Button } from "@/registry/button/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/registry/field/field"
import { Input } from "@/registry/input/input"

// The outline variant cards the group; FieldSeparator draws a rule with
// optional centered content.
export function FieldOutlineExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <FieldGroup variant="outline">
        <Field>
          <FieldLabel htmlFor="field-username">Username</FieldLabel>
          <Input id="field-username" placeholder="ada" />
        </Field>
        <FieldSeparator>OR</FieldSeparator>
        <Field>
          <FieldLabel htmlFor="field-sso">Work email (SSO)</FieldLabel>
          <Input id="field-sso" type="email" placeholder="ada@work.com" />
        </Field>
      </FieldGroup>
      <Button className="w-fit">Continue</Button>
    </div>
  )
}

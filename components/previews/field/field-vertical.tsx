"use client"

import * as React from "react"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/registry/field/field"
import { Input } from "@/registry/input/input"

// Label above control, description and error below.
export function FieldVerticalExample() {
  const [email, setEmail] = React.useState("")
  const emailError =
    email.length > 0 && !email.includes("@") ? "Enter a valid email address." : ""

  return (
    <FieldGroup className="w-full max-w-sm">
      <Field>
        <FieldLabel htmlFor="field-name">Full name</FieldLabel>
        <Input id="field-name" placeholder="Ada Lovelace" />
        <FieldDescription>As it appears on your ID.</FieldDescription>
      </Field>
      <Field data-invalid={emailError ? "true" : undefined}>
        <FieldLabel htmlFor="field-email">Email</FieldLabel>
        <Input
          id="field-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          status={emailError ? "error" : undefined}
        />
        <FieldError>{emailError}</FieldError>
      </Field>
    </FieldGroup>
  )
}

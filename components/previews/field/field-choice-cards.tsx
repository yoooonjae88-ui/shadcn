"use client"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/registry/field/field"
import { RadioGroup, RadioGroupItem } from "@/registry/radio-group/radio-group"

const plans = [
  { value: "starter", title: "Starter", hint: "1 project, community support" },
  { value: "pro", title: "Pro", hint: "Unlimited projects, priority support" },
]

// FieldLabel wraps a Field to become a selectable card that highlights when
// its radio is checked.
export function FieldChoiceCardsExample() {
  return (
    <RadioGroup defaultValue="pro" className="w-full max-w-sm">
      <FieldGroup>
        {plans.map((plan) => (
          <FieldLabel key={plan.value} htmlFor={`plan-${plan.value}`}>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>{plan.title}</FieldTitle>
                <FieldDescription>{plan.hint}</FieldDescription>
              </FieldContent>
              <RadioGroupItem id={`plan-${plan.value}`} value={plan.value} />
            </Field>
          </FieldLabel>
        ))}
      </FieldGroup>
    </RadioGroup>
  )
}

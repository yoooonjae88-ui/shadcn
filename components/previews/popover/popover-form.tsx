"use client"

import * as React from "react"
import { Settings2Icon } from "lucide-react"

import { Button } from "@/registry/button/button"
import {
  PopoverForm,
  PopoverFormBody,
  PopoverFormCancel,
  PopoverFormContent,
  PopoverFormDescription,
  PopoverFormField,
  PopoverFormFooter,
  PopoverFormHeader,
  PopoverFormInput,
  PopoverFormSubmit,
  PopoverFormTitle,
  PopoverFormTrigger,
} from "@/registry/popover/popover"

const dimensions = [
  { id: "width", label: "Width", value: "100%" },
  { id: "maxWidth", label: "Max. width", value: "300px" },
  { id: "height", label: "Height", value: "25px" },
  { id: "maxHeight", label: "Max. height", value: "none" },
]

// The classic quick-edit form in a popover.
export function PopoverFormExample() {
  const [saved, setSaved] = React.useState<string | null>(null)

  return (
    <div className="flex flex-col items-start gap-3">
      <PopoverForm
        onSubmit={(event) => {
          const data = new FormData(event.currentTarget)
          setSaved(dimensions.map((d) => `${d.label}: ${data.get(d.id)}`).join(", "))
        }}
      >
        <PopoverFormTrigger render={<Button variant="outline" />}>
          <Settings2Icon />
          Dimensions
        </PopoverFormTrigger>
        <PopoverFormContent align="start">
          <PopoverFormHeader>
            <PopoverFormTitle>Dimensions</PopoverFormTitle>
            <PopoverFormDescription>
              Set the dimensions for the layer.
            </PopoverFormDescription>
          </PopoverFormHeader>
          <PopoverFormBody>
            {dimensions.map((field) => (
              <PopoverFormField key={field.id} label={field.label} htmlFor={field.id}>
                <PopoverFormInput id={field.id} name={field.id} defaultValue={field.value} />
              </PopoverFormField>
            ))}
          </PopoverFormBody>
          <PopoverFormFooter>
            <PopoverFormCancel>Cancel</PopoverFormCancel>
            <PopoverFormSubmit>Save</PopoverFormSubmit>
          </PopoverFormFooter>
        </PopoverFormContent>
      </PopoverForm>
      {saved ? (
        <p className="text-xs text-muted-foreground">
          Submitted: <code>{saved}</code>
        </p>
      ) : null}
    </div>
  )
}

"use client"

import * as React from "react"
import { SlidersHorizontalIcon } from "lucide-react"

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
import { Slider } from "@/registry/slider/slider"

// The same form shell with any control dropped into the body (a Slider here).
export function PopoverFormSliderExample() {
  const [saved, setSaved] = React.useState<string | null>(null)
  const [opacity, setOpacity] = React.useState(80)

  return (
    <div className="flex flex-col items-start gap-3">
      <PopoverForm
        onSubmit={(event) => {
          const data = new FormData(event.currentTarget)
          setSaved(`Layer "${data.get("name")}" · opacity ${opacity}%`)
        }}
      >
        <PopoverFormTrigger render={<Button variant="outline" />}>
          <SlidersHorizontalIcon />
          Layer style
        </PopoverFormTrigger>
        <PopoverFormContent align="start" className="w-80">
          <PopoverFormHeader>
            <PopoverFormTitle>Layer style</PopoverFormTitle>
            <PopoverFormDescription>
              Any control drops straight into the body.
            </PopoverFormDescription>
          </PopoverFormHeader>
          <PopoverFormBody>
            <PopoverFormField label="Name" htmlFor="name" orientation="vertical">
              <PopoverFormInput id="name" name="name" defaultValue="Cover" />
            </PopoverFormField>
            <PopoverFormField label={`Opacity — ${opacity}%`} orientation="vertical">
              <Slider
                value={opacity}
                onValueChange={(value) =>
                  setOpacity(Array.isArray(value) ? value[0] : value)
                }
                className="py-1.5"
              />
            </PopoverFormField>
          </PopoverFormBody>
          <PopoverFormFooter>
            <PopoverFormCancel>Cancel</PopoverFormCancel>
            <PopoverFormSubmit>Apply</PopoverFormSubmit>
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

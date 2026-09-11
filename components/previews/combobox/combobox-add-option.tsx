"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  type ComboboxOption,
} from "@/registry/combobox/combobox"

// When the search matches nothing, offer to create the option on the fly.
export function ComboboxAddOptionExample() {
  const [options, setOptions] = React.useState<ComboboxOption[]>([
    { value: "design", label: "Design" },
    { value: "engineering", label: "Engineering" },
    { value: "marketing", label: "Marketing" },
    { value: "sales", label: "Sales" },
  ])
  const [value, setValue] = React.useState<ComboboxOption | null>(null)
  const [query, setQuery] = React.useState("")

  const trimmed = query.trim()
  const matches = options.filter((option) =>
    option.label.toLowerCase().includes(trimmed.toLowerCase())
  )
  const exact = options.some(
    (option) => option.label.toLowerCase() === trimmed.toLowerCase()
  )

  const CREATE_PREFIX = "__create__:"
  const items: ComboboxOption[] =
    trimmed !== "" && !exact
      ? [...matches, { value: `${CREATE_PREFIX}${trimmed}`, label: trimmed }]
      : matches

  return (
    <div className="w-full max-w-xs">
      <Combobox
        items={items}
        filter={null}
        value={value}
        inputValue={query}
        onInputValueChange={setQuery}
        isItemEqualToValue={(a: ComboboxOption, b: ComboboxOption) =>
          a.value === b.value
        }
        onValueChange={(next: ComboboxOption | null) => {
          if (next && next.value.startsWith(CREATE_PREFIX)) {
            const created = { value: next.label, label: next.label }
            setOptions((previous) => [...previous, created])
            setValue(created)
          } else {
            setValue(next)
          }
        }}
      >
        <ComboboxTrigger>
          <ComboboxValue placeholder="Select or add a team…" />
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder="Search or add a team…" />
          <ComboboxList>
            {(item: ComboboxOption) =>
              item.value.startsWith(CREATE_PREFIX) ? (
                <ComboboxItem key={item.value} value={item} showIndicator={false}>
                  <PlusIcon
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  Add “{item.label}”
                </ComboboxItem>
              ) : (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )
            }
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

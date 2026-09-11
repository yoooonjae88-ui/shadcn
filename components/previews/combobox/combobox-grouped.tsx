"use client"

import * as React from "react"

import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  type ComboboxOption,
} from "@/registry/combobox/combobox"

interface OptionGroup {
  value: string
  items: ComboboxOption[]
}

const timezones: OptionGroup[] = [
  {
    value: "Americas",
    items: [
      { value: "new-york", label: "New York (GMT-5)" },
      { value: "sao-paulo", label: "São Paulo (GMT-3)" },
      { value: "vancouver", label: "Vancouver (GMT-8)" },
    ],
  },
  {
    value: "Europe",
    items: [
      { value: "berlin", label: "Berlin (GMT+1)" },
      { value: "london", label: "London (GMT+0)" },
    ],
  },
  {
    value: "Asia",
    items: [
      { value: "seoul", label: "Seoul (GMT+9)" },
      { value: "singapore", label: "Singapore (GMT+8)" },
      { value: "tokyo", label: "Tokyo (GMT+9)" },
    ],
  },
]

// Labeled sections with separators; search filters within groups.
export function ComboboxGroupedExample() {
  return (
    <div className="w-full max-w-xs">
      <Combobox items={timezones}>
        <ComboboxTrigger>
          <ComboboxValue placeholder="Select a timezone…" />
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder="Search timezone…" />
          <ComboboxEmpty>No timezone found.</ComboboxEmpty>
          <ComboboxList>
            {(group: OptionGroup, index: number) => (
              <React.Fragment key={group.value}>
                {index > 0 && <ComboboxSeparator />}
                <ComboboxGroup items={group.items}>
                  <ComboboxGroupLabel>{group.value}</ComboboxGroupLabel>
                  <ComboboxCollection>
                    {(item: ComboboxOption) => (
                      <ComboboxItem key={item.value} value={item}>
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxCollection>
                </ComboboxGroup>
              </React.Fragment>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

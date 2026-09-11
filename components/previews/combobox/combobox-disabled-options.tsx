"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  type ComboboxOption,
} from "@/registry/combobox/combobox"

const planets: ComboboxOption[] = [
  { value: "mercury", label: "Mercury" },
  { value: "venus", label: "Venus" },
  { value: "earth", label: "Earth" },
  { value: "mars", label: "Mars", disabled: true },
  { value: "jupiter", label: "Jupiter", disabled: true },
  { value: "saturn", label: "Saturn" },
]

// Individual items marked non-selectable.
export function ComboboxDisabledOptionsExample() {
  return (
    <div className="w-full max-w-xs">
      <Combobox items={planets}>
        <ComboboxTrigger>
          <ComboboxValue placeholder="Select a planet…" />
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder="Search planet…" />
          <ComboboxEmpty>No planet found.</ComboboxEmpty>
          <ComboboxList>
            {(item: ComboboxOption) => (
              <ComboboxItem key={item.value} value={item} disabled={item.disabled}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

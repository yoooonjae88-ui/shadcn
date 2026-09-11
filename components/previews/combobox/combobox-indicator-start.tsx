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

const frameworks: ComboboxOption[] = [
  { value: "next", label: "Next.js" },
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "nuxt", label: "Nuxt" },
  { value: "svelte", label: "Svelte" },
]

// The selected check rendered at the start of the row.
export function ComboboxIndicatorStartExample() {
  return (
    <div className="w-full max-w-xs">
      <Combobox items={frameworks} defaultValue={frameworks[0]}>
        <ComboboxTrigger>
          <ComboboxValue placeholder="Select a framework…" />
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder="Search framework…" />
          <ComboboxEmpty>No framework found.</ComboboxEmpty>
          <ComboboxList>
            {(item: ComboboxOption) => (
              <ComboboxItem key={item.value} value={item} indicatorPosition="start">
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

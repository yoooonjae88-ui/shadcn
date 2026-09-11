"use client"

import {
  Combobox,
  ComboboxClear,
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

// An inline ✕ resets the selection without opening the popup.
export function ComboboxClearableExample() {
  return (
    <div className="w-full max-w-xs">
      <Combobox items={frameworks} defaultValue={frameworks[1]}>
        <ComboboxTrigger>
          <ComboboxValue placeholder="Select a framework…" />
          <ComboboxClear />
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder="Search framework…" />
          <ComboboxEmpty>No framework found.</ComboboxEmpty>
          <ComboboxList>
            {(item: ComboboxOption) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

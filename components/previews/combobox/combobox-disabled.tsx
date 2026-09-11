"use client"

import {
  Combobox,
  ComboboxContent,
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

// The whole combobox ignores interaction.
export function ComboboxDisabledExample() {
  return (
    <div className="w-full max-w-xs">
      <Combobox items={frameworks} defaultValue={frameworks[4]} disabled>
        <ComboboxTrigger>
          <ComboboxValue placeholder="Select a framework…" />
        </ComboboxTrigger>
        <ComboboxContent>
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

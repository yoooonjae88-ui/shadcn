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
  { value: "solid", label: "SolidJS" },
  { value: "astro", label: "Astro" },
  { value: "remix", label: "Remix" },
]

// Single select with search and filtering.
export function ComboboxDefaultExample() {
  return (
    <div className="w-full max-w-xs">
      <Combobox items={frameworks}>
        <ComboboxTrigger>
          <ComboboxValue placeholder="Select a framework…" />
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

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
]

// Checkbox-style selection with a count summary in the trigger.
export function ComboboxMultipleExample() {
  return (
    <div className="w-full max-w-xs">
      <Combobox items={frameworks} multiple>
        <ComboboxTrigger>
          <ComboboxValue>
            {(selected: ComboboxOption[]) =>
              selected.length === 0 ? (
                <span className="text-muted-foreground">Select frameworks…</span>
              ) : selected.length <= 2 ? (
                selected.map((option) => option.label).join(", ")
              ) : (
                `${selected.length} selected`
              )
            }
          </ComboboxValue>
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

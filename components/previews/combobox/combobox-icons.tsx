"use client"

import type * as React from "react"
import {
  AtomIcon,
  CodeXmlIcon,
  FlameIcon,
  HexagonIcon,
  LeafIcon,
  MountainIcon,
  TriangleIcon,
  WindIcon,
} from "lucide-react"

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

interface IconOption extends ComboboxOption {
  icon: React.ComponentType<{ className?: string }>
}

const iconFrameworks: IconOption[] = [
  { value: "react", label: "React", icon: AtomIcon },
  { value: "vue", label: "Vue.js", icon: LeafIcon },
  { value: "svelte", label: "Svelte", icon: FlameIcon },
  { value: "solid", label: "SolidJS", icon: HexagonIcon },
  { value: "astro", label: "Astro", icon: TriangleIcon },
  { value: "alpine", label: "Alpine.js", icon: MountainIcon },
  { value: "htmx", label: "htmx", icon: CodeXmlIcon },
  { value: "tailwind", label: "Tailwind CSS", icon: WindIcon },
]

// Options and the selected value render with an icon.
export function ComboboxIconsExample() {
  return (
    <div className="w-full max-w-xs">
      <Combobox items={iconFrameworks}>
        <ComboboxTrigger>
          <ComboboxValue placeholder="Select a library…">
            {(selected: IconOption | null) =>
              selected ? (
                <span className="flex items-center gap-2">
                  <selected.icon className="size-4 text-muted-foreground" />
                  {selected.label}
                </span>
              ) : (
                <span className="text-muted-foreground">Select a library…</span>
              )
            }
          </ComboboxValue>
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder="Search library…" />
          <ComboboxEmpty>No library found.</ComboboxEmpty>
          <ComboboxList>
            {(item: IconOption) => (
              <ComboboxItem key={item.value} value={item}>
                <item.icon className="size-4 text-muted-foreground" />
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

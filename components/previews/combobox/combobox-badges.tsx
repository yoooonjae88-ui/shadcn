"use client"

import * as React from "react"

import {
  Combobox,
  ComboboxBadge,
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

// Multi-select rendered as removable badges inside the trigger, collapsed to
// "+N" past a limit and expandable with a click.
export function ComboboxBadgesExample() {
  const [selected, setSelected] = React.useState<ComboboxOption[]>([
    frameworks[0],
    frameworks[1],
    frameworks[3],
  ])
  const [expanded, setExpanded] = React.useState(false)

  const limit = 2
  const visible = expanded ? selected : selected.slice(0, limit)
  const hidden = selected.length - visible.length

  return (
    <div className="w-full max-w-xs">
      <Combobox
        items={frameworks}
        multiple
        value={selected}
        onValueChange={setSelected}
      >
        <ComboboxTrigger className="h-auto min-h-9">
          <ComboboxValue placeholder="Select frameworks…">
            {(current: ComboboxOption[]) =>
              current.length === 0 ? (
                <span className="text-muted-foreground">Select frameworks…</span>
              ) : (
                <>
                  {visible.map((option) => (
                    <ComboboxBadge
                      key={option.value}
                      removeLabel={`Remove ${option.label}`}
                      onRemove={() =>
                        setSelected((previous) =>
                          previous.filter((item) => item.value !== option.value)
                        )
                      }
                    >
                      {option.label}
                    </ComboboxBadge>
                  ))}
                  {hidden > 0 && (
                    <ComboboxBadge>
                      <span
                        role="button"
                        aria-label={`Show ${hidden} more`}
                        className="cursor-pointer"
                        onClick={(event) => {
                          event.stopPropagation()
                          setExpanded(true)
                        }}
                      >
                        +{hidden} more
                      </span>
                    </ComboboxBadge>
                  )}
                </>
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

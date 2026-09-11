"use client"

import { Segmented } from "@/registry/segmented/segmented"

const people = [
  { value: "user1", initials: "AL", name: "Alice" },
  { value: "user2", initials: "BO", name: "Bob" },
  { value: "user3", initials: "CA", name: "Carol" },
]

// Any node can be a label — here a stacked avatar and name.
export function SegmentedCustomRenderExample() {
  return (
    <Segmented
      defaultValue="user1"
      options={people.map((person) => ({
        value: person.value,
        label: (
          <div className="flex flex-col items-center gap-1 py-1">
            <span className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-semibold">
              {person.initials}
            </span>
            <span className="text-xs">{person.name}</span>
          </div>
        ),
      }))}
    />
  )
}

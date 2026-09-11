"use client"

import { Mention, type MentionOption } from "@/registry/mention/mention"

const users: MentionOption[] = [
  { value: "afc163", label: "Afc163" },
  { value: "zombiej", label: "Zombie J" },
  { value: "yesmeck", label: "Yes Meck" },
]

// Suggestions open upward.
export function MentionPlacementExample() {
  return (
    <Mention
      className="max-w-sm"
      options={users}
      placement="top"
      placeholder="Suggestions open upward"
      autoSize={{ minRows: 2 }}
    />
  )
}

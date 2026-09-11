"use client"

import { Mention, type MentionOption } from "@/registry/mention/mention"

const users: MentionOption[] = [
  { value: "afc163", label: "Afc163" },
  { value: "zombiej", label: "Zombie J" },
]

export function MentionReadOnlyExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Mention
        options={users}
        readOnly
        defaultValue="This is read only — @afc163 cannot be edited. "
        autoSize={{ minRows: 2 }}
      />
      <Mention
        options={users}
        disabled
        defaultValue="Disabled @afc163 "
        autoSize={{ minRows: 2 }}
      />
    </div>
  )
}

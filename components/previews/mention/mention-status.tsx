"use client"

import { Mention, type MentionOption } from "@/registry/mention/mention"

const users: MentionOption[] = [
  { value: "afc163", label: "Afc163" },
  { value: "zombiej", label: "Zombie J" },
  { value: "yesmeck", label: "Yes Meck" },
]

export function MentionStatusExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Mention options={users} status="error" defaultValue="@" autoSize={{ minRows: 2 }} />
      <Mention
        options={users}
        status="warning"
        autoSize={{ minRows: 2 }}
        placeholder="Warning state"
      />
    </div>
  )
}

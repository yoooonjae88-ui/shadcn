"use client"

import * as React from "react"

import { Mention, type MentionOption } from "@/registry/mention/mention"

const users: MentionOption[] = [
  { value: "afc163", label: "Afc163" },
  { value: "zombiej", label: "Zombie J" },
  { value: "yesmeck", label: "Yes Meck" },
  { value: "benjycui", label: "Benjy Cui" },
  { value: "jljsj33", label: "Jljsj" },
]

// Controlled value with a live readout of the mentioned users.
export function MentionControlledExample() {
  const [value, setValue] = React.useState("Hello @afc163, how are you? ")
  const mentioned = Mention.getMentions(value, { prefix: "@" })

  return (
    <div className="flex w-full max-w-sm flex-col gap-1.5">
      <Mention
        value={value}
        onChange={setValue}
        options={users}
        placeholder="Type @ to mention someone"
        autoSize={{ minRows: 2, maxRows: 6 }}
        allowClear
      />
      <span className="text-xs text-muted-foreground">
        Mentions:{" "}
        {mentioned.length
          ? mentioned.map((m) => `@${m.value}`).join(", ")
          : "none yet"}
      </span>
    </div>
  )
}

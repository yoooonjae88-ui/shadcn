"use client"

import * as React from "react"

import { Mention, type MentionOption } from "@/registry/mention/mention"

const users: MentionOption[] = [
  { value: "afc163", label: "Afc163" },
  { value: "zombiej", label: "Zombie J" },
  { value: "yesmeck", label: "Yes Meck" },
]

const tags: MentionOption[] = [
  { value: "React", label: "#React" },
  { value: "TypeScript", label: "#TypeScript" },
  { value: "TailwindCSS", label: "#TailwindCSS" },
  { value: "shadcn", label: "#shadcn" },
]

// The option list switches with the active trigger (@ users, # tags).
export function MentionMultiTriggerExample() {
  const [options, setOptions] = React.useState<MentionOption[]>(users)

  return (
    <Mention
      className="max-w-sm"
      prefix={["@", "#"]}
      options={options}
      autoSize={{ minRows: 2 }}
      placeholder="@ a person or # a topic"
      onSearch={(_text, trigger) => {
        setOptions(trigger === "#" ? tags : users)
      }}
    />
  )
}

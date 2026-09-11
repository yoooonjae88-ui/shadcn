"use client"

import { Mention, type MentionOption } from "@/registry/mention/mention"

const tags: MentionOption[] = [
  { value: "React", label: "#React" },
  { value: "TypeScript", label: "#TypeScript" },
  { value: "TailwindCSS", label: "#TailwindCSS" },
  { value: "shadcn", label: "#shadcn" },
]

// Outlined variant with a # trigger and a space separator.
export function MentionOutlinedExample() {
  return (
    <Mention
      className="max-w-sm"
      variant="outlined"
      options={tags}
      prefix="#"
      split=" "
      autoSize={{ minRows: 2 }}
      placeholder="Type # to add a tag"
    />
  )
}

"use client"

import * as React from "react"
import { FileText, Files, Mail, Sparkles, Tag as TagIcon } from "lucide-react"

import { Tag, TagGroup } from "@/registry/tag/tag"

// Filled chips act as single-select filters within a TagGroup.
export function TagSelectableExample() {
  const [mailbox, setMailbox] = React.useState<string[]>(["all"])
  const [section, setSection] = React.useState<string[]>(["details"])

  return (
    <div className="flex flex-col gap-4">
      <TagGroup value={mailbox} onValueChange={setMailbox}>
        <Tag value="all" icon={<TagIcon />}>
          All
        </Tag>
        <Tag value="unread" icon={<Mail />}>
          Unread
        </Tag>
      </TagGroup>
      <TagGroup value={section} onValueChange={setSection}>
        <Tag value="details" icon={<FileText />}>
          Details
        </Tag>
        <Tag value="files" icon={<Files />}>
          Files
        </Tag>
        <Tag value="ai" icon={<Sparkles />}>
          AI
        </Tag>
      </TagGroup>
    </div>
  )
}

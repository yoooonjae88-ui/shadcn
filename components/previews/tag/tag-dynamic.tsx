"use client"

import * as React from "react"

import { Tag, TagInput } from "@/registry/tag/tag"

export function TagDynamicExample() {
  const [tags, setTags] = React.useState(["Design", "Research"])

  return (
    <div className="flex w-full flex-col gap-6">
      {/* TagInput owns the whole pattern: each entry is a closable tag, and
          the trailing control swaps itself for a field. Enter adds, Escape or
          clicking away closes it, Backspace on an empty field takes the last
          tag back. */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          Topics ({tags.length})
        </span>
        <TagInput value={tags} onValueChange={setTags} max={6} />
      </div>

      {/* Or drive it yourself: `closable` puts a × on any tag and reports it
          through `onClose`, leaving the list to whoever owns it. */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          Removable on their own
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <Tag
              key={tag}
              status="processing"
              closable
              closeLabel={`Remove ${tag}`}
              onClose={() => setTags((current) => current.filter((t) => t !== tag))}
            >
              {tag}
            </Tag>
          ))}
          {tags.length === 0 && (
            <span className="text-xs text-muted-foreground">
              No topics left — add one above.
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

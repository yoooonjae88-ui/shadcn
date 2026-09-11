"use client"

import * as React from "react"

import { SearchInput } from "@/registry/search-input/search-input"

export function SearchInputDemo() {
  const [query, setQuery] = React.useState<string | null>(null)

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex items-center gap-3">
        <SearchInput
          value={query ?? ""}
          onValueChange={setQuery}
          onSearch={setQuery}
          placeholder="Search components…"
        />
        <SearchInput
          background={false}
          placeholder="No background…"
        />
      </div>
      {query ? (
        <p className="text-xs text-muted-foreground">
          Query: <code>{query}</code>
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Click the icon to expand the search field.
        </p>
      )}
    </div>
  )
}

"use client"

import { Search } from "lucide-react"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/empty/empty"
import { InputSearch } from "@/registry/input/input"

// EmptyContent holding an input action instead of buttons.
export function EmptyInputExample() {
  return (
    <Empty variant="outline" className="w-full max-w-sm">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Search aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>No results found</EmptyTitle>
        <EmptyDescription>
          We couldn&apos;t find anything matching your search. Try a different
          keyword.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <InputSearch placeholder="Search again…" className="w-full" aria-label="Search" />
      </EmptyContent>
    </Empty>
  )
}

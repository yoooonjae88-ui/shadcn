"use client"

import { Text } from "@/registry/typography/typography"

const LONG_TEXT =
  "This registry is offline-first: consumers install from it in environments with no internet access, so every dependency an item needs must be resolvable from this registry. The typography component bundles text, titles, links, and inline editing into one item."

export function TypographyEllipsisExample() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-1.5">
      <Text ellipsis className="block">
        {LONG_TEXT}
      </Text>
      <Text ellipsis={{ rows: 2, expandable: true }} className="block">
        {LONG_TEXT}
      </Text>
    </div>
  )
}

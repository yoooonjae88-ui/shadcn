"use client"

import { Text } from "@/registry/typography/typography"

export function TypographyCopyableExample() {
  return (
    <div className="flex flex-col gap-1.5">
      <Text copyable>pnpm dlx shadcn add @private/typography</Text>
      <Text copyable={{ text: "Copied a custom string!" }}>
        Copy something else
      </Text>
    </div>
  )
}

"use client"

import { Text } from "@/registry/typography/typography"

export function TypographyTextExample() {
  return (
    <div className="flex max-w-xl flex-wrap items-center justify-center gap-x-3 gap-y-1">
      <Text>Default</Text>
      <Text type="secondary">Secondary</Text>
      <Text type="success">Success</Text>
      <Text type="warning">Warning</Text>
      <Text type="danger">Danger</Text>
      <Text strong>Strong</Text>
      <Text italic>Italic</Text>
      <Text code>cn()</Text>
      <Text mark>Highlighted</Text>
      <Text del>Deleted</Text>
      <Text disabled>Disabled</Text>
    </div>
  )
}

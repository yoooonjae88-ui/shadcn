"use client"

import { Button } from "@/components/ui/button"
import { Space } from "@/registry/space/space"

// Adjacent controls attach into one visual group.
export function SpaceCompactExample() {
  return (
    <Space direction="vertical" size="middle" className="w-full max-w-xl items-stretch">
      <Space.Compact>
        <Button variant="outline">Left</Button>
        <Button variant="outline">Middle</Button>
        <Button variant="outline">Right</Button>
      </Space.Compact>
      <Space.Compact block>
        <input
          className="h-9 min-w-0 flex-1 rounded-md bg-muted px-3 text-sm outline-none placeholder:text-muted-foreground"
          placeholder="https://example.com"
        />
        <Button>Submit</Button>
      </Space.Compact>
      <Space.Compact direction="vertical">
        <Button variant="outline">Top</Button>
        <Button variant="outline">Middle</Button>
        <Button variant="outline">Bottom</Button>
      </Space.Compact>
    </Space>
  )
}

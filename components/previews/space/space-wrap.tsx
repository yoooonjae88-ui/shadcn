"use client"

import { Button } from "@/components/ui/button"
import { Space } from "@/registry/space/space"

// Items flow onto new lines; size takes a [horizontal, vertical] pair.
export function SpaceWrapExample() {
  return (
    <Space wrap size={[8, 16]} className="max-w-xl">
      {Array.from({ length: 12 }, (_, index) => (
        <Button key={index} size="sm" variant="outline">
          Button {index + 1}
        </Button>
      ))}
    </Space>
  )
}

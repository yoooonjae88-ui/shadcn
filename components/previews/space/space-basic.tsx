"use client"

import { Button } from "@/components/ui/button"
import { Space } from "@/registry/space/space"

export function SpaceBasicExample() {
  return (
    <Space>
      <Button>Primary</Button>
      <Button variant="outline">Default</Button>
      <span className="text-sm">Space keeps them apart</span>
    </Space>
  )
}

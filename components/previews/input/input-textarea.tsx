"use client"

import { Input } from "@/registry/input/input"

// autoSize between 2 and 4 rows, with count and clear.
export function InputTextareaExample() {
  return (
    <Input.TextArea
      className="max-w-sm"
      autoSize={{ minRows: 2, maxRows: 4 }}
      allowClear
      showCount
      maxLength={100}
      placeholder="Grows with content up to 4 rows"
    />
  )
}

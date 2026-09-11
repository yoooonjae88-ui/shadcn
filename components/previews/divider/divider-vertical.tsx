"use client"

import { Divider } from "@/registry/divider/divider"

export function DividerVerticalExample() {
  return (
    <div className="text-sm">
      Text
      <Divider type="vertical" />
      <a className="text-primary" href="#top">
        Link
      </a>
      <Divider type="vertical" />
      <a className="text-primary" href="#top">
        Link
      </a>
      <Divider type="vertical" variant="dashed" />
      Dashed
    </div>
  )
}

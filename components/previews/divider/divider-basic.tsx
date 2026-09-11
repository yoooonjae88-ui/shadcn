"use client"

import { Divider } from "@/registry/divider/divider"

const paragraph =
  "A design is not just what it looks like and feels like — a design is how it works."

export function DividerBasicExample() {
  return (
    <div className="w-full max-w-xl text-sm">
      <p>{paragraph}</p>
      <Divider />
      <p>{paragraph}</p>
    </div>
  )
}

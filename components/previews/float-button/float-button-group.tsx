"use client"

import { Bookmark, Share2, Star } from "lucide-react"

import { FloatButton } from "@/registry/float-button/float-button"

export function FloatButtonGroupExample() {
  return (
    <div className="relative h-56 w-full overflow-hidden rounded-xl bg-muted/40">
      {/* A group without a trigger simply stacks its buttons. Square stacks
          merge into one slab; circles stay separate. */}
      <FloatButton.Group position="absolute" offset={{ x: 88, y: 16 }} shape="circle">
        <FloatButton icon={<Star />} aria-label="Star" />
        <FloatButton icon={<Bookmark />} aria-label="Save" />
      </FloatButton.Group>

      <FloatButton.Group position="absolute" offset={16} shape="square">
        <FloatButton icon={<Star />} aria-label="Star" />
        <FloatButton icon={<Bookmark />} aria-label="Save" />
        <FloatButton icon={<Share2 />} aria-label="Share" />
      </FloatButton.Group>
    </div>
  )
}

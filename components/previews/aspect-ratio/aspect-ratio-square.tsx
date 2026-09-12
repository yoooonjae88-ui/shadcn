"use client"

import { AspectRatio } from "@/registry/aspect-ratio/aspect-ratio"

// ratio={1 / 1} keeps a perfect square — avatars, product tiles, thumbnails.
export function AspectRatioSquareExample() {
  return (
    <AspectRatio
      ratio={1 / 1}
      className="w-full max-w-[12rem] rounded-lg bg-muted"
    >
      <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
        1 / 1
      </div>
    </AspectRatio>
  )
}

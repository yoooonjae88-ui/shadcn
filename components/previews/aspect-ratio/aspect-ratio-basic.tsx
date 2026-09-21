"use client"

import { AspectRatio } from "@/registry/aspect-ratio/aspect-ratio"

// The box keeps a 16:9 shape at any width — the height follows from the ratio,
// so nothing jumps as the image or embed inside loads.
export function AspectRatioBasicExample() {
  return (
    <AspectRatio
      ratio={16 / 9}
      className="w-full max-w-sm rounded-lg bg-muted"
    >
      <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
        16 / 9
      </div>
    </AspectRatio>
  )
}

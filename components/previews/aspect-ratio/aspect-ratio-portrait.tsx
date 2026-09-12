"use client"

import { AspectRatio } from "@/registry/aspect-ratio/aspect-ratio"

// ratio={9 / 16} is the phone-video shape — stories, reels, portrait covers.
export function AspectRatioPortraitExample() {
  return (
    <AspectRatio
      ratio={9 / 16}
      className="w-full max-w-[10rem] rounded-lg bg-muted"
    >
      <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
        9 / 16
      </div>
    </AspectRatio>
  )
}

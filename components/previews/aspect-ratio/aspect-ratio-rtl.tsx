"use client"

import { AspectRatio } from "@/registry/aspect-ratio/aspect-ratio"

// The shape is direction-agnostic: the same ratio holds under `dir="rtl"`,
// and only the surrounding text flows the other way.
export function AspectRatioRtlExample() {
  return (
    <figure className="w-full max-w-sm" dir="rtl">
      <AspectRatio ratio={16 / 9} className="rounded-lg bg-muted">
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
          16 / 9
        </div>
      </AspectRatio>
      <figcaption className="mt-2 text-center text-sm text-muted-foreground">
        منظر طبيعي جميل
      </figcaption>
    </figure>
  )
}

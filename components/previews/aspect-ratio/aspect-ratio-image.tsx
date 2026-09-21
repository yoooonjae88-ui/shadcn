"use client"

import { AspectRatio } from "@/registry/aspect-ratio/aspect-ratio"

// The usual job: crop an image to a fixed shape. The box is `relative`, so the
// image fills it with `absolute inset-0 size-full object-cover` — with
// next/image, pass `fill` instead.
export function AspectRatioImageExample() {
  return (
    <AspectRatio
      ratio={16 / 9}
      className="w-full max-w-sm overflow-hidden rounded-lg bg-muted"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- static asset, no optimisation needed */}
      <img
        src="/globe.svg"
        alt="A globe"
        className="absolute inset-0 size-full object-contain p-10 opacity-60"
      />
    </AspectRatio>
  )
}

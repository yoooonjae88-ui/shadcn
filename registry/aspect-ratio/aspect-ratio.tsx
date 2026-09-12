import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Displays content within a desired ratio.
 *
 * Base UI has no aspect-ratio primitive, so this is plain CSS: the ratio rides
 * in on a `--ratio` custom property and Tailwind's `aspect-(--ratio)` turns it
 * into `aspect-ratio: var(--ratio)`. Children are positioned against it, so an
 * image inside can fill the box with `absolute inset-0 size-full object-cover`
 * (or `fill` with next/image).
 */
function AspectRatio({
  ratio,
  className,
  style,
  ...props
}: React.ComponentProps<"div"> & { ratio: number }) {
  return (
    <div
      data-slot="aspect-ratio"
      style={
        {
          "--ratio": ratio,
          ...style,
        } as React.CSSProperties
      }
      className={cn("relative aspect-(--ratio)", className)}
      {...props}
    />
  )
}

export { AspectRatio }

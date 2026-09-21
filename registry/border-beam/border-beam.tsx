"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- *
 * Border Beam
 *
 * A light that travels around an element's border. It renders as an overlay
 * that masks itself down to the border ring, so it traces whatever corner
 * radius its parent has: give the parent `relative` and a radius, and drop a
 * BorderBeam inside it.
 *
 * The beam is a square of gradient riding an `offset-path` lap of the box,
 * animated by one CSS keyframe — no JS ticks, and it stops under
 * prefers-reduced-motion. Both gradient ends resolve from a --border-beam-*
 * theme token unless the caller passes colours of their own.
 *
 * How gently the beam rounds a corner comes down to two things, because it
 * swings through the whole right angle over the length of that corner's arc:
 * a browser caps the lap's rounding at half the box's shorter side, so a wide
 * strip of a box turns more sharply than a card does, and a shorter
 * `duration` runs the whole lap — corners included — that much faster.
 * -------------------------------------------------------------------------- */

interface BorderBeamProps extends React.ComponentProps<"div"> {
  /** Length of the beam along the border, in px. */
  size?: number
  /** Seconds the beam takes to travel all the way round. */
  duration?: number
  /** Seconds to wait before it sets off. */
  delay?: number
  /** Thickness of the border it travels, in px. */
  borderWidth?: number
  /**
   * Corner radius of the lap the beam travels, in px. It defaults to the
   * beam's own length, which is what keeps each corner a gentle turn: the
   * beam swings through a right angle over the whole of that arc, so a lap
   * pinned tight to a small radius whips round its corners instead.
   */
  radius?: number
  /** Colour the beam fades in from. Any CSS colour. */
  colorFrom?: string
  /** Colour the beam fades out to. Any CSS colour. */
  colorTo?: string
  /** Travel anticlockwise. */
  reverse?: boolean
  /** How far into the lap the beam starts, 0–100. */
  initialOffset?: number
}

function BorderBeam({
  className,
  style,
  size = 64,
  duration = 6,
  delay = 0,
  borderWidth = 2,
  radius,
  colorFrom,
  colorTo,
  reverse = false,
  initialOffset = 0,
  ...props
}: BorderBeamProps) {
  const from = colorFrom ?? "var(--border-beam-from)"
  const to = colorTo ?? "var(--border-beam-to)"

  // A negative delay starts the beam that far into its lap, so `initialOffset`
  // is just the slice of the duration it skips. A `delay` of its own adds to
  // it, holding the beam at that starting point for a moment first.
  const offsetDelay = delay - duration * (initialOffset / 100)

  return (
    <div
      data-slot="border-beam"
      aria-hidden
      className={cn(
        // Two mask layers intersect to leave only the border ring: one clipped
        // to the padding box that hides everything inside it, one clipped to
        // the border box that keeps the rest. Their colours are stencil
        // values, not theme colours — only their alpha matters.
        "pointer-events-none absolute inset-0 rounded-[inherit]",
        "[mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]",
        "[mask-clip:padding-box,border-box] [mask-composite:intersect]",
        className
      )}
      style={{
        border: `${borderWidth}px solid transparent`,
        ...style,
      }}
      {...props}
    >
      <div
        data-slot="border-beam-glow"
        className="absolute aspect-square animate-(--border-beam-motion) motion-reduce:animate-none"
        style={
          {
            width: size,
            // The mask keeps the light on the border however the lap is
            // shaped, so the lap is free to round its corners generously —
            // which is the whole reason it can turn them smoothly. A browser
            // clamps the rounding to half the box, so a short box or a pill
            // simply laps a stadium.
            offsetPath: `rect(0 auto auto 0 round ${radius ?? size}px)`,
            backgroundImage: `linear-gradient(to left, ${from}, ${to}, transparent)`,
            "--border-beam-motion": `border-beam ${duration}s linear ${offsetDelay}s infinite ${
              reverse ? "reverse" : "normal"
            }`,
          } as React.CSSProperties
        }
      />
    </div>
  )
}

export { BorderBeam, type BorderBeamProps }

"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type MastheadOrientation = "horizontal" | "vertical"
type MastheadSide = "left" | "right"

// The band's thickness (its short edge) and the fixed length of the decorative
// strip on the trailing edge, both in pixels. The strip is a *constant* size —
// it never scales with the browser — so the coloured blocks stay put on resize.
// Only the leading text region flexes to fill whatever space is left.
const BAR_THICKNESS = 20
const STRIP_LENGTH = 357

// The decorative strip on the trailing edge of the masthead. Each entry is a
// slice of the strip's main axis; together they sum to 100. A `className` of
// `undefined` is a gap that lets the black background show through.
const VISUAL_SEGMENTS: { fraction: number; className?: string }[] = [
  { fraction: 14 },
  { fraction: 7, className: "bg-masthead-1" }, // 26
  { fraction: 28, className: "bg-masthead-2" }, // 100
  { fraction: 7 },
  { fraction: 7, className: "bg-masthead-3" }, // 26
  { fraction: 22, className: "bg-masthead-4" }, // 82
  { fraction: 15 },
]

function Masthead({
  orientation = "horizontal",
  side = "left",
  text = "Placeholder text",
  hideText = false,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  orientation?: MastheadOrientation
  side?: MastheadSide
  text?: React.ReactNode
  /** Hide the placeholder text. Only applies to the narrow vertical orientation. */
  hideText?: boolean
  children?: React.ReactNode
}) {
  const isHorizontal = orientation === "horizontal"
  // The text is always kept in the horizontal band; it can only be hidden in
  // the narrow vertical orientation.
  const showText = isHorizontal || !hideText

  return (
    <div
      data-slot="masthead"
      data-orientation={orientation}
      data-side={side}
      role="banner"
      className={cn(
        "flex shrink-0 items-center overflow-hidden bg-black text-white",
        // Horizontal: a full-width band, at least BAR_THICKNESS tall, that
        // grows if the text wraps to a second line. Vertical: the same band
        // rotated into a full-height column docked left or right. `min-w-0`
        // stops the rotated text's min-content width from widening the column.
        isHorizontal
          ? "min-h-[var(--bar-thickness)] w-full flex-row"
          : "w-[var(--bar-thickness)] h-full min-w-0 flex-col",
        className
      )}
      style={
        {
          "--bar-thickness": `${BAR_THICKNESS}px`,
          "--strip-length": `${STRIP_LENGTH}px`,
        } as React.CSSProperties
      }
      {...props}
    >
      {/* Left-aligned placeholder text fills the space the fixed strip leaves.
          In the vertical orientation it runs top-to-bottom so the whole band
          reads as the horizontal one rotated. */}
      {showText && (
        <div
          data-slot="masthead-text"
          className={cn(
            "flex min-w-0 overflow-hidden font-semibold",
            isHorizontal
              ? // A container so the font can shrink against the *available*
                // width (what's left after the fixed strip), and the text may
                // wrap to a second line before it ever gets clipped.
                "items-center px-4 text-left"
              : // No leading keeps the rotated text inside the narrow column;
                // padding runs along the column (top), not across it, so it
                // can't affect the width.
                "w-full items-start justify-center py-3 text-[0.6875rem] leading-none"
          )}
        >
          <span
            className={cn(
              isHorizontal
                ? // Shrink the font when the region gets tight (floor 0.5rem),
                  // and allow up to two lines before clipping.
                  "text-[clamp(0.5rem,3cqi,0.6875rem)] leading-tight truncate"
                : "truncate [writing-mode:vertical-rl]"
            )}
          >
            {children ?? text}
          </span>
        </div>
      )}

      {/* Trailing strip holds the decorative visuals at a fixed size, laid out
          along the same axis as the masthead. The auto-margin keeps it on the
          trailing edge, and `self-center` keeps it centred across the band even
          when the text has pushed the band taller. */}
      <div
        data-slot="masthead-visual"
        className={cn(
          "flex shrink-0 grow-0 self-center overflow-hidden",
          isHorizontal
            ? "ml-auto h-[var(--bar-thickness)] w-[var(--strip-length)] flex-row"
            : "mt-auto w-[var(--bar-thickness)] h-[var(--strip-length)] flex-col"
        )}
      >
        {VISUAL_SEGMENTS.map((segment, index) => (
          <div
            key={index}
            className="flex shrink-0 grow-0 items-center justify-center"
            style={{ flexBasis: `${segment.fraction}%` }}
          >
            {segment.className ? (
              <div className={cn("size-full", segment.className)} />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export { Masthead }

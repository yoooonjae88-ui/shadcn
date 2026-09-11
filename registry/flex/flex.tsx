import * as React from "react"

import { cn } from "@/lib/utils"

// A flexbox container modeled on Ant Design's Flex. Direction, wrap and the
// gap presets map to Tailwind classes; justify/align/gap/flex accept any raw
// CSS value and are written as inline styles so arbitrary values work without
// Tailwind needing to see the class at build time.

const GAP_PRESETS = {
  small: 8,
  middle: 16,
  large: 24,
} as const

type GapPreset = keyof typeof GAP_PRESETS

const wrapClasses = {
  nowrap: "flex-nowrap",
  wrap: "flex-wrap",
  "wrap-reverse": "flex-wrap-reverse",
} as const

interface FlexProps extends React.ComponentProps<"div"> {
  /** Render as another element, e.g. `component="section"`. */
  component?: React.ElementType
  /** Lay children out in a column instead of a row. */
  vertical?: boolean
  /** Whether children wrap onto new lines; accepts any `flex-wrap` value. */
  wrap?: boolean | keyof typeof wrapClasses
  /** Placement along the main axis; any `justify-content` value. */
  justify?: React.CSSProperties["justifyContent"]
  /** Alignment along the cross axis; any `align-items` value. */
  align?: React.CSSProperties["alignItems"]
  /**
   * Spacing between children: a preset (`"small"` 8px, `"middle"` 16px,
   * `"large"` 24px), a number of pixels, or any CSS gap value.
   */
  gap?: GapPreset | number | string
  /** CSS `flex` shorthand for the container itself. */
  flex?: React.CSSProperties["flex"]
}

function isGapPreset(gap: FlexProps["gap"]): gap is GapPreset {
  return typeof gap === "string" && gap in GAP_PRESETS
}

function Flex({
  component: Component = "div",
  className,
  style,
  vertical = false,
  wrap = false,
  justify,
  align,
  gap,
  flex,
  ...props
}: FlexProps) {
  const wrapClass =
    typeof wrap === "boolean"
      ? wrapClasses[wrap ? "wrap" : "nowrap"]
      : wrapClasses[wrap]

  const flexStyle: React.CSSProperties = { ...style }
  if (justify !== undefined) flexStyle.justifyContent = justify
  if (align !== undefined) flexStyle.alignItems = align
  if (gap !== undefined) flexStyle.gap = isGapPreset(gap) ? GAP_PRESETS[gap] : gap
  if (flex !== undefined) flexStyle.flex = flex

  return (
    <Component
      data-slot="flex"
      className={cn(
        "flex min-w-0",
        vertical ? "flex-col" : "flex-row",
        wrapClass,
        className
      )}
      style={flexStyle}
      {...props}
    />
  )
}

export { Flex }
export type { FlexProps }

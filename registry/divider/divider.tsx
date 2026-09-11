import * as React from "react"

import { cn } from "@/lib/utils"

// A divider modeled on Ant Design's Divider. Horizontal by default, with an
// optional title placed at the start, center or end of the line; a vertical
// mode for separating inline items; solid/dashed/dotted line styles (plus the
// legacy `dashed` boolean); `plain` for body-weight title text; and a `size`
// preset controlling the vertical margin of horizontal dividers.

const lineVariantClasses = {
  solid: "border-solid",
  dashed: "border-dashed",
  dotted: "border-dotted",
} as const

// Vertical margin presets for horizontal dividers, matching Ant Design's
// small (8px), middle (16px) and large/default (24px) spacing.
const sizeClasses = {
  small: "my-2",
  middle: "my-4",
  large: "my-6",
} as const

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Direction of the divider. Vertical dividers ignore `children`. */
  type?: "horizontal" | "vertical"
  /** Line style. Takes precedence over the legacy `dashed` prop. */
  variant?: keyof typeof lineVariantClasses
  /** Legacy shorthand for `variant="dashed"`. */
  dashed?: boolean
  /** Where the title sits on the line. `left`/`right` are aliases. */
  orientation?: "start" | "center" | "end" | "left" | "right"
  /**
   * Gap between the title and the nearest edge when `orientation` is
   * `start`/`end`: a number of pixels or any CSS length. The line on that
   * side collapses so the title hugs the edge at exactly this distance.
   */
  orientationMargin?: number | string
  /** Render the title as plain body text instead of a small heading. */
  plain?: boolean
  /** Vertical margin of a horizontal divider. */
  size?: keyof typeof sizeClasses
}

function Divider({
  type = "horizontal",
  variant,
  dashed = false,
  orientation = "center",
  orientationMargin,
  plain = false,
  size = "large",
  className,
  children,
  ...props
}: DividerProps) {
  const lineVariant = variant ?? (dashed ? "dashed" : "solid")
  const lineClass = cn("border-border", lineVariantClasses[lineVariant])

  if (type === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        data-slot="divider"
        className={cn(
          "relative top-[-0.06em] mx-2 inline-block h-[0.9em] w-0 border-l align-middle",
          lineClass,
          className
        )}
        {...props}
      />
    )
  }

  if (children === undefined || children === null) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        data-slot="divider"
        className={cn("w-full border-t", lineClass, sizeClasses[size], className)}
        {...props}
      />
    )
  }

  const atStart = orientation === "start" || orientation === "left"
  const atEnd = orientation === "end" || orientation === "right"
  const hasCustomMargin = orientationMargin !== undefined
  const marginValue =
    typeof orientationMargin === "number"
      ? `${orientationMargin}px`
      : orientationMargin

  // With a custom orientationMargin the near-side line collapses and the
  // title's own padding on that side is replaced by the margin, so the text
  // sits exactly `orientationMargin` from the edge — mirroring Ant Design.
  const textStyle: React.CSSProperties = {}
  if (hasCustomMargin && atStart) {
    textStyle.paddingLeft = 0
    textStyle.marginLeft = marginValue
  }
  if (hasCustomMargin && atEnd) {
    textStyle.paddingRight = 0
    textStyle.marginRight = marginValue
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      data-slot="divider"
      className={cn(
        "flex w-full items-center whitespace-nowrap text-foreground",
        plain ? "text-sm font-normal" : "text-base font-medium",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "border-t",
          lineClass,
          atStart ? (hasCustomMargin ? "w-0" : "w-[5%]") : "flex-1"
        )}
      />
      <span data-slot="divider-text" className="shrink-0 px-[1em]" style={textStyle}>
        {children}
      </span>
      <span
        aria-hidden
        className={cn(
          "border-t",
          lineClass,
          atEnd ? (hasCustomMargin ? "w-0" : "w-[5%]") : "flex-1"
        )}
      />
    </div>
  )
}

export { Divider }
export type { DividerProps }

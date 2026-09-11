import * as React from "react"

import { cn } from "@/lib/utils"

// An inline spacing container modeled on Ant Design's Space. Each child is
// wrapped in an item element and separated by a flex gap, with an optional
// split node rendered between items. Size presets map to antd's values
// (small 8px, middle 16px, large 24px); numbers and [horizontal, vertical]
// pairs are written as inline gap styles so any value works without Tailwind
// needing to see the class at build time. Space.Compact attaches adjacent
// controls (buttons, inputs, selects) by squaring the radii where they meet.

const SIZE_PRESETS = {
  small: 8,
  middle: 16,
  large: 24,
} as const

type SizePreset = keyof typeof SIZE_PRESETS

/** A preset name or a number of pixels. */
type SpaceSize = SizePreset | number

const alignClasses = {
  start: "items-start",
  end: "items-end",
  center: "items-center",
  baseline: "items-baseline",
} as const

function resolveSize(size: SpaceSize): number {
  return typeof size === "number" ? size : SIZE_PRESETS[size]
}

interface SpaceProps extends React.ComponentProps<"div"> {
  /** Cross-axis alignment of items. Defaults to `"center"` when horizontal. */
  align?: keyof typeof alignClasses
  /** Main axis of the layout. */
  direction?: "horizontal" | "vertical"
  /**
   * Spacing between items: a preset (`"small"` 8px, `"middle"` 16px,
   * `"large"` 24px), a number of pixels, or a `[horizontal, vertical]` pair.
   */
  size?: SpaceSize | [SpaceSize, SpaceSize]
  /** Node rendered between adjacent items, e.g. a divider. */
  split?: React.ReactNode
  /** Whether items wrap onto new lines. Horizontal only. */
  wrap?: boolean
  /** Class applied to every item wrapper. */
  classNames?: { item?: string }
  /** Style applied to every item wrapper. */
  styles?: { item?: React.CSSProperties }
}

function Space({
  className,
  style,
  align,
  direction = "horizontal",
  size = "small",
  split,
  wrap = false,
  classNames,
  styles,
  children,
  ...props
}: SpaceProps) {
  // antd centers items by default in horizontal direction only.
  const mergedAlign =
    align === undefined && direction === "horizontal" ? "center" : align

  const spaceStyle: React.CSSProperties = { ...style }
  if (Array.isArray(size)) {
    spaceStyle.columnGap = resolveSize(size[0])
    spaceStyle.rowGap = resolveSize(size[1])
  } else {
    spaceStyle.gap = resolveSize(size)
  }

  // toArray drops null/undefined/boolean children so empty slots produce
  // neither a gap nor a stray split node.
  const items = React.Children.toArray(children)

  return (
    <div
      data-slot="space"
      className={cn(
        "inline-flex min-w-0",
        direction === "vertical" ? "flex-col" : "flex-row",
        direction === "horizontal" && wrap && "flex-wrap",
        mergedAlign && alignClasses[mergedAlign],
        className
      )}
      style={spaceStyle}
      {...props}
    >
      {items.map((item, index) => (
        <React.Fragment key={(React.isValidElement(item) && item.key) || index}>
          {split !== undefined && split !== null && index > 0 && (
            <span data-slot="space-split" className="flex items-center">
              {split}
            </span>
          )}
          <div
            data-slot="space-item"
            className={cn("empty:hidden", classNames?.item)}
            style={styles?.item}
          >
            {item}
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}

interface SpaceCompactProps extends React.ComponentProps<"div"> {
  /** Fit the width of the parent element. */
  block?: boolean
  /** Main axis of the group. */
  direction?: "horizontal" | "vertical"
}

/**
 * Attaches its direct children into one visual control: the radii where two
 * children meet are squared so only the group's outer corners stay rounded.
 * Unlike antd there is no size context — size children directly.
 */
function SpaceCompact({
  className,
  block = false,
  direction = "horizontal",
  ...props
}: SpaceCompactProps) {
  return (
    <div
      data-slot="space-compact"
      className={cn(
        "isolate min-w-0",
        block ? "flex w-full" : "inline-flex",
        // Raise the focused child so its focus ring isn't clipped by siblings.
        "[&>*:focus-within]:z-10 [&>*:focus-visible]:z-10",
        direction === "vertical"
          ? [
              "flex-col",
              "[&>*:not(:first-child)]:-mt-px",
              "[&>*:first-child:not(:last-child)]:rounded-b-none",
              "[&>*:last-child:not(:first-child)]:rounded-t-none",
              "[&>*:not(:first-child):not(:last-child)]:rounded-none",
            ]
          : [
              "flex-row",
              "[&>*:not(:first-child)]:-ml-px",
              "[&>*:first-child:not(:last-child)]:rounded-r-none",
              "[&>*:last-child:not(:first-child)]:rounded-l-none",
              "[&>*:not(:first-child):not(:last-child)]:rounded-none",
            ],
        className
      )}
      {...props}
    />
  )
}

Space.Compact = SpaceCompact

export { Space, SpaceCompact }
export type { SpaceProps, SpaceCompactProps, SpaceSize }

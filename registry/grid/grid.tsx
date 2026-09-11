"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// A 24-column grid system modeled on Ant Design's Row/Col. Rows establish the
// horizontal track (flex based), cols claim a 1-24 span of it; cols whose
// spans sum past 24 wrap onto the next line. Widths are computed as inline
// percentage styles so every span value works without Tailwind needing to
// see the class at build time.

const GRID_COLUMNS = 24

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const

type Breakpoint = keyof typeof BREAKPOINTS

const BREAKPOINT_ORDER = ["sm", "md", "lg", "xl", "2xl"] as const

function subscribeToBreakpoints(onChange: () => void) {
  const queries = BREAKPOINT_ORDER.map((breakpoint) =>
    window.matchMedia(`(min-width: ${BREAKPOINTS[breakpoint]}px)`)
  )
  for (const query of queries) query.addEventListener("change", onChange)
  return () => {
    for (const query of queries) query.removeEventListener("change", onChange)
  }
}

function getBreakpointSnapshot() {
  return BREAKPOINT_ORDER.filter(
    (breakpoint) =>
      window.matchMedia(`(min-width: ${BREAKPOINTS[breakpoint]}px)`).matches
  ).join(" ")
}

// On the server no breakpoint matches, so SSR renders the mobile-first base
// values; useSyncExternalStore re-renders with the real screens after mount.
function getServerBreakpointSnapshot() {
  return ""
}

function useBreakpoint(): Record<Breakpoint, boolean> {
  const snapshot = React.useSyncExternalStore(
    subscribeToBreakpoints,
    getBreakpointSnapshot,
    getServerBreakpointSnapshot
  )
  return React.useMemo(() => {
    const active = new Set(snapshot.split(" "))
    return Object.fromEntries(
      BREAKPOINT_ORDER.map((breakpoint) => [breakpoint, active.has(breakpoint)])
    ) as Record<Breakpoint, boolean>
  }, [snapshot])
}

type ResponsiveNumber = number | Partial<Record<"base" | Breakpoint, number>>

// Also consumed by other registry items (e.g. Masonry) for their own
// responsive props, so it is exported alongside useBreakpoint.
function resolveResponsiveNumber(
  value: ResponsiveNumber,
  screens: Record<Breakpoint, boolean>
): number {
  if (typeof value === "number") return value
  let resolved = value.base ?? 0
  for (const breakpoint of BREAKPOINT_ORDER) {
    const candidate = value[breakpoint]
    if (screens[breakpoint] && candidate !== undefined) resolved = candidate
  }
  return resolved
}

type Gutter = ResponsiveNumber

interface RowContextValue {
  gutterX: number
}

const RowContext = React.createContext<RowContextValue>({ gutterX: 0 })

const justifyClasses = {
  start: "justify-start",
  end: "justify-end",
  center: "justify-center",
  "space-between": "justify-between",
  "space-around": "justify-around",
  "space-evenly": "justify-evenly",
} as const

const alignClasses = {
  top: "items-start",
  middle: "items-center",
  bottom: "items-end",
  stretch: "items-stretch",
} as const

interface RowProps extends React.ComponentProps<"div"> {
  /**
   * Spacing between columns: a number, a responsive object
   * (`{ base: 8, md: 16 }`), or `[horizontal, vertical]` for both axes.
   */
  gutter?: Gutter | [Gutter, Gutter]
  /** Horizontal arrangement of columns. */
  justify?: keyof typeof justifyClasses
  /** Vertical alignment of columns. */
  align?: keyof typeof alignClasses
  /** Whether columns wrap onto new lines when spans exceed 24. */
  wrap?: boolean
}

function Row({
  className,
  style,
  gutter = 0,
  justify = "start",
  align = "top",
  wrap = true,
  ...props
}: RowProps) {
  const screens = useBreakpoint()

  const [horizontal, vertical] = Array.isArray(gutter) ? gutter : [gutter, 0]
  const gutterX = resolveResponsiveNumber(horizontal, screens)
  const gutterY = resolveResponsiveNumber(vertical, screens)

  const rowStyle: React.CSSProperties = { ...style }
  if (gutterX > 0) {
    rowStyle.marginLeft = gutterX / -2
    rowStyle.marginRight = gutterX / -2
  }
  if (gutterY > 0) rowStyle.rowGap = gutterY

  const contextValue = React.useMemo(() => ({ gutterX }), [gutterX])

  return (
    <RowContext.Provider value={contextValue}>
      <div
        data-slot="row"
        className={cn(
          "flex min-w-0",
          wrap ? "flex-wrap" : "flex-nowrap",
          justifyClasses[justify],
          alignClasses[align],
          className
        )}
        style={rowStyle}
        {...props}
      />
    </RowContext.Provider>
  )
}

interface ColSpec {
  /** Columns to span out of 24. `0` hides the column. */
  span?: number
  /** Columns of leading space before the column. */
  offset?: number
  /** Visual order of the column within the row. */
  order?: number
  /** Shift the column right by N columns without affecting flow. */
  push?: number
  /** Shift the column left by N columns without affecting flow. */
  pull?: number
}

type ColSize = number | ColSpec

interface ColProps extends React.ComponentProps<"div">, ColSpec {
  /** Raw flex sizing: a grow number, a fixed basis like `"200px"`, or a full shorthand. */
  flex?: number | string
  sm?: ColSize
  md?: ColSize
  lg?: ColSize
  xl?: ColSize
  "2xl"?: ColSize
}

function parseFlex(flex: number | string): string {
  if (typeof flex === "number") return `${flex} ${flex} auto`
  if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) return `0 0 ${flex}`
  return flex
}

function columnPercent(count: number): string {
  return `${(count / GRID_COLUMNS) * 100}%`
}

function Col({
  className,
  style,
  span,
  offset,
  order,
  push,
  pull,
  flex,
  sm,
  md,
  lg,
  xl,
  "2xl": xxl,
  ...props
}: ColProps) {
  const screens = useBreakpoint()
  const { gutterX } = React.useContext(RowContext)

  let resolved: ColSpec = { span, offset, order, push, pull }
  const responsive: Partial<Record<Breakpoint, ColSize>> = {
    sm,
    md,
    lg,
    xl,
    "2xl": xxl,
  }
  for (const breakpoint of BREAKPOINT_ORDER) {
    const size = responsive[breakpoint]
    if (size !== undefined && screens[breakpoint]) {
      resolved = {
        ...resolved,
        ...(typeof size === "number" ? { span: size } : size),
      }
    }
  }

  const colStyle: React.CSSProperties = { ...style }
  if (gutterX > 0) {
    colStyle.paddingLeft = gutterX / 2
    colStyle.paddingRight = gutterX / 2
  }
  if (flex !== undefined) colStyle.flex = parseFlex(flex)
  if (resolved.span !== undefined) {
    if (resolved.span === 0) {
      colStyle.display = "none"
    } else {
      const width = columnPercent(resolved.span)
      if (flex === undefined) colStyle.flex = `0 0 ${width}`
      colStyle.maxWidth = width
    }
  }
  if (resolved.offset) colStyle.marginLeft = columnPercent(resolved.offset)
  if (resolved.order !== undefined) colStyle.order = resolved.order
  if (resolved.push || resolved.pull) {
    colStyle.position = "relative"
    if (resolved.push) colStyle.left = columnPercent(resolved.push)
    if (resolved.pull) colStyle.right = columnPercent(resolved.pull)
  }

  return (
    <div
      data-slot="col"
      className={cn("min-w-0 max-w-full", className)}
      style={colStyle}
      {...props}
    />
  )
}

export { Row, Col, useBreakpoint, resolveResponsiveNumber }
export type {
  RowProps,
  ColProps,
  ColSize,
  Gutter,
  ResponsiveNumber,
  Breakpoint,
}

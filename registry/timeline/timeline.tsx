"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type TimelineOrientation = "vertical" | "horizontal"
type TimelineVariant =
  | "primary"
  | "success"
  | "warning"
  | "destructive"
  | "info"
  | "muted"
type TimelineSide = "start" | "end"

const TimelineContext = React.createContext<{
  /** Steps with `step <= value` are marked complete. `undefined` = every item complete. */
  value: number | undefined
  orientation: TimelineOrientation
  /** Zig-zag layout: items sit on alternating sides of a centered rail. */
  alternate: boolean
}>({ value: undefined, orientation: "vertical", alternate: false })

const TimelineItemContext = React.createContext<{
  step: number
  completed: boolean
  side: TimelineSide
}>({ step: 1, completed: true, side: "end" })

// Solid indicator fills, one bg+foreground pair per status so each is
// independently restyleable from the item's cssVars / globals.css tokens.
const indicatorVariants: Record<TimelineVariant, string> = {
  primary: "bg-timeline-primary text-timeline-primary-foreground",
  success: "bg-timeline-success text-timeline-success-foreground",
  warning: "bg-timeline-warning text-timeline-warning-foreground",
  destructive: "bg-timeline-destructive text-timeline-destructive-foreground",
  info: "bg-timeline-info text-timeline-info-foreground",
  muted: "bg-timeline-dot text-timeline-dot-foreground",
}

function Timeline({
  value,
  defaultValue,
  orientation = "vertical",
  alternate = false,
  className,
  ...props
}: React.ComponentProps<"ol"> & {
  value?: number
  defaultValue?: number
  orientation?: TimelineOrientation
  alternate?: boolean
}) {
  const resolved = value ?? defaultValue
  // Alternating only makes sense on the vertical rail; ignore it horizontally.
  const isAlternate = alternate && orientation === "vertical"

  return (
    <TimelineContext.Provider
      value={{ value: resolved, orientation, alternate: isAlternate }}
    >
      <ol
        data-slot="timeline"
        data-orientation={orientation}
        className={cn(
          "flex",
          orientation === "horizontal" ? "w-full flex-row" : "flex-col",
          className
        )}
        {...props}
      />
    </TimelineContext.Provider>
  )
}

function TimelineItem({
  step,
  side,
  className,
  ...props
}: React.ComponentProps<"li"> & {
  step: number
  /** Override the auto (odd→start / even→end) side in alternate layout. */
  side?: TimelineSide
}) {
  const { value, orientation, alternate } = React.useContext(TimelineContext)
  const completed = value === undefined ? true : step <= value
  const resolvedSide: TimelineSide = side ?? (step % 2 === 1 ? "start" : "end")

  return (
    <TimelineItemContext.Provider
      value={{ step, completed, side: resolvedSide }}
    >
      <li
        data-slot="timeline-item"
        data-orientation={orientation}
        data-completed={completed ? "" : undefined}
        className={cn(
          "group/timeline-item relative flex flex-col",
          orientation === "horizontal"
            ? "flex-1 pe-8 pt-10 last:pe-0"
            : alternate
              ? "pb-8 last:pb-0"
              : "ps-10 pb-8 last:pb-0",
          className
        )}
        {...props}
      />
    </TimelineItemContext.Provider>
  )
}

function TimelineHeader({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation, alternate } = React.useContext(TimelineContext)
  const { side } = React.useContext(TimelineItemContext)

  return (
    <div
      data-slot="timeline-header"
      className={cn(
        "flex flex-col gap-0.5",
        // Alternate: pin the header to its side of the centered rail.
        alternate &&
          orientation === "vertical" &&
          (side === "start"
            ? "me-auto w-[calc(50%-1.75rem)] items-end pe-6 text-right"
            : "ms-auto w-[calc(50%-1.75rem)] items-start ps-6 text-left"),
        className
      )}
      {...props}
    />
  )
}

function TimelineSeparator({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation, alternate } = React.useContext(TimelineContext)

  return (
    <div
      data-slot="timeline-separator"
      aria-hidden="true"
      className={cn(
        "absolute bg-timeline-connector transition-colors group-last/timeline-item:hidden group-data-[completed]/timeline-item:bg-timeline-connector-active",
        orientation === "horizontal"
          ? // Runs from the right edge of the indicator to the next item.
            "left-8 right-0 top-4 h-px -translate-y-1/2"
          : // Runs from below the indicator down to the next item.
            cn(
              "top-8 bottom-0 w-px",
              alternate ? "left-1/2 -translate-x-1/2" : "left-4 -translate-x-1/2"
            ),
        className
      )}
      {...props}
    />
  )
}

function TimelineIndicator({
  variant = "primary",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { variant?: TimelineVariant }) {
  const { orientation, alternate } = React.useContext(TimelineContext)
  const { completed } = React.useContext(TimelineItemContext)

  return (
    <div
      data-slot="timeline-indicator"
      className={cn(
        "absolute top-0 z-10 flex size-8 items-center justify-center rounded-full text-xs font-semibold transition-colors [&_svg]:size-4",
        // Completed/active items take the status colour; upcoming ones stay a
        // muted dot so progress reads at a glance.
        completed
          ? indicatorVariants[variant]
          : "bg-timeline-dot text-timeline-dot-foreground",
        orientation === "horizontal"
          ? "left-0"
          : alternate
            ? "left-1/2 -translate-x-1/2"
            : "left-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function TimelineDate({ className, ...props }: React.ComponentProps<"time">) {
  return (
    <time
      data-slot="timeline-date"
      className={cn(
        "text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function TimelineTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-title"
      className={cn(
        "text-sm font-semibold leading-snug text-foreground",
        className
      )}
      {...props}
    />
  )
}

function TimelineContent({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation, alternate } = React.useContext(TimelineContext)
  const { side } = React.useContext(TimelineItemContext)

  return (
    <div
      data-slot="timeline-content"
      className={cn(
        "pt-1 text-sm text-muted-foreground",
        // Alternate: keep the body on the same side as its header.
        alternate &&
          orientation === "vertical" &&
          (side === "start"
            ? "me-auto w-[calc(50%-1.75rem)] pe-6 text-right"
            : "ms-auto w-[calc(50%-1.75rem)] ps-6 text-left"),
        className
      )}
      {...props}
    />
  )
}

export {
  Timeline,
  TimelineItem,
  TimelineHeader,
  TimelineSeparator,
  TimelineIndicator,
  TimelineDate,
  TimelineTitle,
  TimelineContent,
}

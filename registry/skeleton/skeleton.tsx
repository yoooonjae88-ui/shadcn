import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Skeleton — a shimmering placeholder that stands in for content while it
 * loads. The base primitive is just a pulsing block; size and shape it with
 * utility classes (`h-*`, `w-*`, `rounded-*`) to mimic whatever it replaces.
 *
 * The fill colour comes from the `--skeleton` theme token (`bg-skeleton`), so
 * the whole set restyles from one place.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-skeleton", className)}
      {...props}
    />
  )
}

// Self-contained card surface used by the composed loaders below, so the item
// stays dependency-free. No borders (surface reads via `bg-card` + shadow).
function SkeletonSurface({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl bg-card p-5 text-card-foreground shadow-xs",
        className
      )}
      {...props}
    />
  )
}

// A thin divider line drawn from the border token (no border utilities).
function SkeletonLine({ className }: { className?: string }) {
  return <div aria-hidden className={cn("h-px w-full bg-border", className)} />
}

/**
 * Avatar + user info: a circular avatar next to two stacked text lines.
 */
function SkeletonUserInfo({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-4", className)} {...props}>
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[140px]" />
      </div>
    </div>
  )
}

/**
 * Card: two header lines above a media block.
 */
function SkeletonCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <SkeletonSurface className={cn("w-full max-w-xs gap-4", className)} {...props}>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="aspect-video w-full rounded-md" />
    </SkeletonSurface>
  )
}

/**
 * Text & paragraphs: a run of full-width lines with a couple of ragged ends.
 */
function SkeletonText({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto flex w-full max-w-xs flex-col gap-2", className)}
      {...props}
    >
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="mt-4 flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  )
}

/**
 * Form: two labelled fields and a submit button.
 */
function SkeletonForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto flex w-full max-w-xs flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-28" />
    </div>
  )
}

/**
 * Data table: a header row over `rows` (default 4) body rows.
 */
function SkeletonTable({
  rows = 4,
  className,
  ...props
}: React.ComponentProps<"div"> & { rows?: number }) {
  return (
    <div
      className={cn("mx-auto flex w-full max-w-lg flex-col gap-4", className)}
      {...props}
    >
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <SkeletonLine className="opacity-60" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  )
}

/**
 * Dashboard stats: a row of `count` (default 3) stat cards.
 */
function SkeletonStats({
  count = 3,
  className,
  ...props
}: React.ComponentProps<"div"> & { count?: number }) {
  return (
    <div
      className={cn("mx-auto grid w-full max-w-lg grid-cols-3 gap-4", className)}
      {...props}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonSurface key={i} className="gap-3">
          <Skeleton className="h-3 w-16" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        </SkeletonSurface>
      ))}
    </div>
  )
}

/**
 * List with actions: a titled header and `rows` (default 3) avatar rows, each
 * with a trailing action button.
 */
function SkeletonList({
  rows = 3,
  className,
  ...props
}: React.ComponentProps<"div"> & { rows?: number }) {
  return (
    <div className={cn("mx-auto w-full max-w-xs", className)} {...props}>
      <div className="flex flex-col">
        <div className="flex items-center justify-between pb-4">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
        <SkeletonLine className="opacity-60" />
        {Array.from({ length: rows }).map((_, i) => (
          <React.Fragment key={i}>
            <div className="flex items-center gap-3 py-3">
              <Skeleton className="size-9 shrink-0 rounded-full" />
              <div className="flex flex-1 flex-col gap-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-7 w-16 rounded-md" />
            </div>
            {i < rows - 1 && <SkeletonLine className="opacity-60" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

/**
 * Card grid item: a media header, body copy and a footer action row.
 */
function SkeletonCardGrid({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <SkeletonSurface className={cn("w-full max-w-xs gap-4", className)} {...props}>
      <Skeleton className="aspect-video w-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="size-8 rounded-md" />
      </div>
    </SkeletonSurface>
  )
}

/**
 * Full profile page: a header card (avatar, name, stat trio) above a details
 * card (heading and `rows` key/value rows).
 */
function SkeletonProfile({
  rows = 4,
  className,
  ...props
}: React.ComponentProps<"div"> & { rows?: number }) {
  return (
    <div
      className={cn("mx-auto flex w-full max-w-xs flex-col gap-6", className)}
      {...props}
    >
      <SkeletonSurface className="items-center gap-3">
        <Skeleton className="size-20 rounded-full" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-48" />
        <div className="flex justify-center gap-8 pt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <Skeleton className="h-5 w-10" />
              <Skeleton className="h-3 w-14" />
            </div>
          ))}
        </div>
      </SkeletonSurface>

      <SkeletonSurface className="gap-4">
        <Skeleton className="h-4 w-24" />
        <SkeletonLine />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </SkeletonSurface>
    </div>
  )
}

/**
 * Chat messages: alternating incoming/outgoing bubbles above a composer row.
 */
function SkeletonChat({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <SkeletonSurface className={cn("w-full max-w-xs gap-4", className)} {...props}>
      {/* Incoming message */}
      <div className="flex items-start gap-2.5">
        <Skeleton className="size-8 shrink-0 rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-16 w-48 rounded-lg rounded-tl-none" />
          <Skeleton className="h-2.5 w-12" />
        </div>
      </div>

      {/* Outgoing message */}
      <div className="flex items-start justify-end gap-2.5">
        <div className="flex flex-col items-end gap-1">
          <Skeleton className="h-10 w-40 rounded-lg rounded-tr-none" />
          <Skeleton className="h-2.5 w-12" />
        </div>
      </div>

      {/* Incoming message */}
      <div className="flex items-start gap-2.5">
        <Skeleton className="size-8 shrink-0 rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-24 w-56 rounded-lg rounded-tl-none" />
          <Skeleton className="h-2.5 w-12" />
        </div>
      </div>

      {/* Composer */}
      <div className="flex items-center gap-2 pt-2">
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="size-9 rounded-md" />
      </div>
    </SkeletonSurface>
  )
}

/**
 * Dialog feedback: the loading state of a modal/feedback dialog — an optional
 * leading icon, a title and description, a body block, and a footer with a
 * cancel + confirm action pair. Drop this inside a dialog while its contents
 * are still loading.
 */
function SkeletonDialog({
  withIcon = true,
  className,
  ...props
}: React.ComponentProps<"div"> & { withIcon?: boolean }) {
  return (
    <SkeletonSurface
      role="status"
      aria-busy="true"
      aria-label="Loading"
      className={cn("w-full max-w-sm gap-5 p-6", className)}
      {...props}
    >
      <div className="flex items-start gap-3">
        {withIcon && <Skeleton className="size-10 shrink-0 rounded-full" />}
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-4/5" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>
      <SkeletonLine className="opacity-60" />
      <div className="flex items-center justify-end gap-3">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>
    </SkeletonSurface>
  )
}

export {
  Skeleton,
  SkeletonUserInfo,
  SkeletonCard,
  SkeletonText,
  SkeletonForm,
  SkeletonTable,
  SkeletonStats,
  SkeletonList,
  SkeletonCardGrid,
  SkeletonProfile,
  SkeletonChat,
  SkeletonDialog,
}

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader, LoaderCircle, LoaderPinwheel } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Spinner — a minimal loading indicator for async operations and data
 * fetches, modeled on ReUI's Spinner. It ships five animation styles
 * (`variant`), five sizes, and a tokenised colour set, and pairs the visual
 * with an ARIA live region + `role="status"` so screen readers announce the
 * loading state.
 *
 * Every colour resolves from a theme token (`text-*` / `bg-current`) — the
 * three spinner-specific accents live in the `--spinner-*` variables (see
 * app/globals.css and the item's `cssVars` in registry.json), so the whole
 * set restyles from one place. No hard-coded colours live in the component.
 *
 * ```tsx
 * <Spinner />                              // default, medium
 * <Spinner variant="dots" color="primary" size="lg" />
 * <Spinner>Loading…</Spinner>              // with a visible label
 * <Button disabled><Spinner size="sm" /> Saving…</Button>
 * ```
 */

// The wrapper carries the colour so both the visual and any label inherit it.
// `size` is intentionally omitted here — each variant reads it from the shared
// size records below, since dots/bars need different geometry than the icons.
const spinnerVariants = cva("inline-flex shrink-0 items-center", {
  variants: {
    color: {
      default: "text-foreground",
      primary: "text-primary",
      secondary: "text-secondary-foreground",
      muted: "text-muted-foreground",
      destructive: "text-destructive",
      success: "text-spinner-success",
      warning: "text-spinner-warning",
      info: "text-spinner-info",
    },
  },
  defaultVariants: {
    color: "default",
  },
})

type SpinnerVariantName = "default" | "circle" | "pinwheel" | "dots" | "bars"
type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl"

// Icon box (also the dots-row / bars-row height) per size.
const sizeClass: Record<SpinnerSize, string> = {
  xs: "size-3",
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
  xl: "size-12",
}

// Bouncing-dots geometry: dot diameter + gap between the three dots.
const dotClass: Record<SpinnerSize, string> = {
  xs: "size-1",
  sm: "size-1.5",
  md: "size-2",
  lg: "size-2.5",
  xl: "size-3.5",
}
const dotGap: Record<SpinnerSize, string> = {
  xs: "gap-0.5",
  sm: "gap-1",
  md: "gap-1",
  lg: "gap-1.5",
  xl: "gap-2",
}

// Equalizer-bars geometry: row height, bar width + gap between the four bars.
const barRowClass: Record<SpinnerSize, string> = {
  xs: "h-3",
  sm: "h-4",
  md: "h-6",
  lg: "h-8",
  xl: "h-12",
}
const barClass: Record<SpinnerSize, string> = {
  xs: "w-0.5",
  sm: "w-0.5",
  md: "w-1",
  lg: "w-1",
  xl: "w-1.5",
}

// Label text size tracks the spinner size.
const labelClass: Record<SpinnerSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
}

function DotsVisual({ size }: { size: SpinnerSize }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-flex items-center", dotGap[size])}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            "inline-block animate-bounce rounded-full bg-current",
            dotClass[size]
          )}
          // Stagger the three dots so they bounce in a travelling wave.
          style={{ animationDelay: `${i * 0.16 - 0.32}s` }}
        />
      ))}
    </span>
  )
}

function BarsVisual({ size }: { size: SpinnerSize }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-flex items-center gap-0.5", barRowClass[size])}
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={cn(
            "inline-block h-full animate-pulse rounded-full bg-current",
            barClass[size]
          )}
          // Stagger the four bars into a pulsing equalizer wave.
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}

export interface SpinnerProps
  extends Omit<React.ComponentProps<"span">, "color">,
    VariantProps<typeof spinnerVariants> {
  /** Animation style. Defaults to `default` (rotating spokes). */
  variant?: SpinnerVariantName
  /** Preset size. Defaults to `md`. Use `className` for a custom size. */
  size?: SpinnerSize
  /**
   * Optional visible label rendered beside the spinner. When omitted, a
   * screen-reader-only "Loading" label is emitted instead (override the text
   * via `aria-label`).
   */
  children?: React.ReactNode
}

function Spinner({
  variant = "default",
  color,
  size = "md",
  className,
  children,
  "aria-label": ariaLabel,
  ...props
}: SpinnerProps) {
  let visual: React.ReactNode
  switch (variant) {
    case "circle":
      visual = (
        <LoaderCircle
          aria-hidden="true"
          className={cn("animate-spin", sizeClass[size])}
        />
      )
      break
    case "pinwheel":
      visual = (
        <LoaderPinwheel
          aria-hidden="true"
          className={cn("animate-spin", sizeClass[size])}
        />
      )
      break
    case "dots":
      visual = <DotsVisual size={size} />
      break
    case "bars":
      visual = <BarsVisual size={size} />
      break
    default:
      visual = (
        <Loader
          aria-hidden="true"
          className={cn("animate-spin", sizeClass[size])}
        />
      )
  }

  return (
    <span
      data-slot="spinner"
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        spinnerVariants({ color }),
        children ? "gap-2" : undefined,
        className
      )}
      {...props}
    >
      {visual}
      {children ? (
        <span className={cn("font-medium", labelClass[size])}>{children}</span>
      ) : (
        <span className="sr-only">{ariaLabel ?? "Loading"}</span>
      )}
    </span>
  )
}

export { Spinner, spinnerVariants }

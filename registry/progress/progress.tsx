"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Self-contained keyframes so the sliding indeterminate bar and the spinning
 * circular track work in consumer projects without extra Tailwind config.
 * Duplicate <style> tags with identical keyframes are harmless.
 */
const progressKeyframes = `
@keyframes progress-indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}
@keyframes progress-circular-spin {
  to { transform: rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
  [data-slot="progress-indicator"][data-indeterminate] { animation: none; }
  [data-slot="circular-progress-svg"][data-status="indeterminate"] { animation-duration: 2s; }
}
`

function ProgressStyles() {
  return <style suppressHydrationWarning>{progressKeyframes}</style>
}

const progressTrackDefaults = {
  size: "default",
} as const

const progressTrackVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-progress-track",
  {
    variants: {
      size: {
        sm: "h-1.5",
        default: "h-2.5",
        lg: "h-4",
      },
    },
    defaultVariants: progressTrackDefaults,
  }
)

const progressIndicatorDefaults = {
  variant: "primary",
} as const

const progressIndicatorVariants = cva(
  "h-full rounded-full transition-[width,transform] duration-500 ease-out data-indeterminate:w-2/5 data-indeterminate:[animation:progress-indeterminate_1.2s_ease-in-out_infinite]",
  {
    variants: {
      variant: {
        primary: "bg-progress-primary",
        mono: "bg-progress-mono",
        success: "bg-progress-success",
        warning: "bg-progress-warning",
        destructive: "bg-progress-destructive",
        info: "bg-progress-info",
      },
    },
    defaultVariants: progressIndicatorDefaults,
  }
)

type ProgressVariant = NonNullable<
  VariantProps<typeof progressIndicatorVariants>["variant"]
>
type ProgressSize = NonNullable<VariantProps<typeof progressTrackVariants>["size"]>

/* -------------------------------------------------------------------------- */
/*                          Styled composable primitives                       */
/* -------------------------------------------------------------------------- */

const ProgressRoot = ProgressPrimitive.Root

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      data-slot="progress-label"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  )
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      data-slot="progress-value"
      className={cn("text-sm text-muted-foreground tabular-nums", className)}
      {...props}
    />
  )
}

function ProgressTrack({
  className,
  size,
  ...props
}: ProgressPrimitive.Track.Props & VariantProps<typeof progressTrackVariants>) {
  return (
    <ProgressPrimitive.Track
      data-slot="progress-track"
      className={cn(progressTrackVariants({ size }), className)}
      {...props}
    />
  )
}

function ProgressIndicator({
  className,
  variant,
  ...props
}: ProgressPrimitive.Indicator.Props &
  VariantProps<typeof progressIndicatorVariants>) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn(progressIndicatorVariants({ variant }), className)}
      {...props}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*                            Composed linear Progress                         */
/* -------------------------------------------------------------------------- */

interface ProgressProps
  extends Omit<ProgressPrimitive.Root.Props, "value" | "render">,
    VariantProps<typeof progressTrackVariants>,
    VariantProps<typeof progressIndicatorVariants> {
  /** Current value (0–max). Pass `null` for an indeterminate/loading bar. */
  value?: number | null
  /** Optional label shown above the bar. */
  label?: React.ReactNode
  /** Show the formatted percentage next to the label. */
  showValue?: boolean
  /** Custom renderer for the value readout. */
  formatValue?: (
    value: number | null,
    formattedValue: string | null
  ) => React.ReactNode
  /** Extra classes for the track rail. */
  trackClassName?: string
  /** Extra classes for the moving indicator. */
  indicatorClassName?: string
  /** Extra classes for the label. */
  labelClassName?: string
  /** Extra classes for the value readout. */
  valueClassName?: string
}

function Progress({
  className,
  size = progressTrackDefaults.size,
  variant = progressIndicatorDefaults.variant,
  value = 0,
  label,
  showValue = false,
  formatValue,
  trackClassName,
  indicatorClassName,
  labelClassName,
  valueClassName,
  ...props
}: ProgressProps) {
  const hasHeader = label != null || showValue

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value ?? null}
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    >
      <ProgressStyles />
      {hasHeader ? (
        <div className="flex items-center justify-between gap-3">
          {label != null ? (
            <ProgressLabel className={labelClassName}>{label}</ProgressLabel>
          ) : (
            <span />
          )}
          {showValue ? (
            <ProgressValue className={valueClassName}>
              {formatValue
                ? (formattedValue, currentValue) =>
                    formatValue(currentValue, formattedValue)
                : undefined}
            </ProgressValue>
          ) : null}
        </div>
      ) : null}
      <ProgressTrack size={size} className={trackClassName}>
        <ProgressIndicator variant={variant} className={indicatorClassName} />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}

/* -------------------------------------------------------------------------- */
/*                             Circular Progress                               */
/* -------------------------------------------------------------------------- */

const circularStrokeVariants: Record<ProgressVariant, string> = {
  primary: "stroke-progress-primary",
  mono: "stroke-progress-mono",
  success: "stroke-progress-success",
  warning: "stroke-progress-warning",
  destructive: "stroke-progress-destructive",
  info: "stroke-progress-info",
}

const circularSizeMap: Record<ProgressSize, number> = {
  sm: 40,
  default: 56,
  lg: 80,
}

interface CircularProgressProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  /** Current value. Pass `null` for an indeterminate/spinning ring. */
  value?: number | null
  /** Minimum value. @default 0 */
  min?: number
  /** Maximum value. @default 100 */
  max?: number
  /** Preset size (sm/default/lg) or an explicit pixel diameter. */
  size?: ProgressSize | number
  /** Ring color. */
  variant?: ProgressVariant
  /** Ring thickness in pixels. Defaults to ~9% of the diameter. */
  strokeWidth?: number
  /** Show the formatted percentage in the center. */
  showValue?: boolean
  /** Custom renderer for the center readout. */
  formatValue?: (value: number | null, percent: number) => React.ReactNode
  /** Content rendered in the center (overrides `showValue`). */
  children?: React.ReactNode
  /** Extra classes for the background track ring. */
  trackClassName?: string
  /** Extra classes for the progress ring. */
  indicatorClassName?: string
}

function CircularProgress({
  className,
  value = 0,
  min = 0,
  max = 100,
  size = "default",
  variant = "primary",
  strokeWidth,
  showValue = false,
  formatValue,
  children,
  trackClassName,
  indicatorClassName,
  style,
  ...props
}: CircularProgressProps) {
  const diameter = typeof size === "number" ? size : circularSizeMap[size]
  const sw = strokeWidth ?? Math.max(3, Math.round(diameter * 0.09))
  const radius = (diameter - sw) / 2
  const circumference = 2 * Math.PI * radius
  const center = diameter / 2

  const indeterminate = value == null || !Number.isFinite(value)
  const clamped = indeterminate
    ? min
    : Math.min(max, Math.max(min, value as number))
  const percent =
    max === min ? 0 : Math.round(((clamped - min) / (max - min)) * 100)
  const dashOffset = indeterminate
    ? circumference * 0.7
    : circumference * (1 - percent / 100)

  const hasCenter = children != null || showValue

  return (
    <div
      data-slot="circular-progress"
      role="progressbar"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={indeterminate ? undefined : clamped}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        className
      )}
      style={{ width: diameter, height: diameter, ...style }}
      {...props}
    >
      <ProgressStyles />
      <svg
        data-slot="circular-progress-svg"
        data-status={indeterminate ? "indeterminate" : undefined}
        width={diameter}
        height={diameter}
        viewBox={`0 0 ${diameter} ${diameter}`}
        fill="none"
        className={cn(
          "-rotate-90",
          indeterminate &&
            "[animation:progress-circular-spin_1s_linear_infinite]"
        )}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={sw}
          className={cn("stroke-progress-track", trackClassName)}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className={cn(
            circularStrokeVariants[variant],
            "transition-[stroke-dashoffset] duration-500 ease-out",
            indicatorClassName
          )}
        />
      </svg>
      {hasCenter ? (
        <span className="absolute inset-0 flex items-center justify-center text-sm font-medium tabular-nums">
          {children ??
            (indeterminate
              ? null
              : formatValue
                ? formatValue(clamped, percent)
                : `${percent}%`)}
        </span>
      ) : null}
    </div>
  )
}

export {
  Progress,
  ProgressRoot,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
  CircularProgress,
  progressTrackVariants,
  progressIndicatorVariants,
}
export type {
  ProgressProps,
  ProgressVariant,
  ProgressSize,
  CircularProgressProps,
}

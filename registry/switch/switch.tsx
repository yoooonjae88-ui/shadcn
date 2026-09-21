"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cva, type VariantProps } from "class-variance-authority"
import { LoaderCircle } from "lucide-react"

import { cn } from "@/lib/utils"

const switchTrackDefaults = {
  size: "default",
  variant: "primary",
} as const

const switchTrackVariants = cva(
  "peer group/switch relative inline-flex shrink-0 cursor-pointer items-center rounded-full p-0.5 outline-none transition-colors select-none bg-switch focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:ring-2 aria-invalid:ring-destructive/40 disabled:cursor-not-allowed disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-readonly:cursor-default",
  {
    variants: {
      size: {
        sm: "h-4 w-7",
        default: "h-5 w-9",
        lg: "h-6 w-11",
      },
      variant: {
        primary: "data-checked:bg-switch-checked",
        mono: "data-checked:bg-switch-mono",
        success: "data-checked:bg-switch-success",
        warning: "data-checked:bg-switch-warning",
        destructive: "data-checked:bg-switch-destructive",
      },
    },
    defaultVariants: switchTrackDefaults,
  }
)

const switchThumbDefaults = {
  size: "default",
} as const

const switchThumbVariants = cva(
  "pointer-events-none z-10 flex items-center justify-center rounded-full bg-switch-thumb text-switch-thumb-foreground shadow-sm transition-transform",
  {
    variants: {
      size: {
        sm: "size-3 data-checked:translate-x-3",
        default: "size-4 data-checked:translate-x-4",
        lg: "size-5 data-checked:translate-x-5",
      },
    },
    defaultVariants: switchThumbDefaults,
  }
)

type SwitchSize = NonNullable<VariantProps<typeof switchTrackVariants>["size"]>

/** Icon size that sits comfortably inside the thumb / track for each size. */
const iconSizeClasses: Record<SwitchSize, string> = {
  sm: "size-2",
  default: "size-2.5",
  lg: "size-3",
}

/** Horizontal padding for the on/off track indicators so they clear the thumb. */
const indicatorInsetClasses: Record<SwitchSize, string> = {
  sm: "px-1",
  default: "px-1.5",
  lg: "px-2",
}

interface SwitchProps
  extends Omit<SwitchPrimitive.Root.Props, "render">,
    VariantProps<typeof switchTrackVariants> {
  /** Icon shown inside the thumb when the switch is on. */
  thumbIconOn?: React.ReactNode
  /** Icon shown inside the thumb when the switch is off. */
  thumbIconOff?: React.ReactNode
  /** Content pinned to the "on" side of the track, revealed as the thumb slides. */
  indicatorOn?: React.ReactNode
  /** Content pinned to the "off" side of the track, revealed as the thumb slides. */
  indicatorOff?: React.ReactNode
  /** Shows a spinner in the thumb and blocks interaction while an async action runs. */
  loading?: boolean
  /** Extra classes for the moving thumb. */
  thumbClassName?: string
}

function Switch({
  className,
  thumbClassName,
  size = switchTrackDefaults.size,
  variant,
  thumbIconOn,
  thumbIconOff,
  indicatorOn,
  indicatorOff,
  loading = false,
  disabled,
  ...props
}: SwitchProps) {
  const resolvedSize = size ?? "default"
  const hasThumbIcons = thumbIconOn != null || thumbIconOff != null
  const hasIndicators = indicatorOn != null || indicatorOff != null

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-loading={loading || undefined}
      disabled={disabled || loading}
      className={cn(switchTrackVariants({ size: resolvedSize, variant }), className)}
      {...props}
    >
      {hasIndicators ? (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 flex items-center justify-between",
            indicatorInsetClasses[resolvedSize]
          )}
        >
          <span
            className={cn(
              "flex items-center justify-center text-switch-indicator-on-foreground opacity-0 transition-opacity group-data-checked/switch:opacity-100 [&_svg]:shrink-0",
              iconSizeClasses[resolvedSize]
            )}
          >
            {indicatorOn}
          </span>
          <span
            className={cn(
              "flex items-center justify-center text-switch-indicator-off-foreground opacity-100 transition-opacity group-data-checked/switch:opacity-0 [&_svg]:shrink-0",
              iconSizeClasses[resolvedSize]
            )}
          >
            {indicatorOff}
          </span>
        </span>
      ) : null}

      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(switchThumbVariants({ size: resolvedSize }), thumbClassName)}
      >
        {loading ? (
          <LoaderCircle
            aria-hidden="true"
            className={cn("animate-spin", iconSizeClasses[resolvedSize])}
          />
        ) : hasThumbIcons ? (
          <span className="relative flex items-center justify-center">
            <span
              className={cn(
                "flex items-center justify-center opacity-0 transition-opacity group-data-checked/switch:opacity-100 [&_svg]:shrink-0",
                iconSizeClasses[resolvedSize]
              )}
            >
              {thumbIconOn}
            </span>
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center opacity-100 transition-opacity group-data-checked/switch:opacity-0 [&_svg]:shrink-0",
                iconSizeClasses[resolvedSize]
              )}
            >
              {thumbIconOff}
            </span>
          </span>
        ) : null}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

export { Switch, switchTrackVariants, switchThumbVariants }
export type { SwitchProps, SwitchSize }

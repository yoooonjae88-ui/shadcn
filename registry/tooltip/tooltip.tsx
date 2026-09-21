"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- *
 * Tooltip
 *
 * A popup that reveals a short hint when the user hovers or focuses an
 * element, built on Base UI Tooltip. Compose Tooltip / TooltipTrigger /
 * TooltipContent; wrap a tree in TooltipProvider to share open/close delays
 * across many tooltips (so once one is showing, adjacent ones open instantly).
 *
 * Every colour resolves from a --tooltip-* theme token, so the whole set of
 * variants restyles from app/globals.css.
 * -------------------------------------------------------------------------- */

/**
 * Groups tooltips so they share a delay. Once one tooltip is open, moving to
 * another within `timeout` opens it instantly. Optional — a lone Tooltip works
 * without it; set `delay` / `closeDelay` on the trigger instead.
 */
function TooltipProvider({
  delay = 600,
  closeDelay = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      closeDelay={closeDelay}
      {...props}
    />
  )
}

function Tooltip(props: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

/**
 * The element the tooltip is attached to. Renders a `<button>` by default;
 * pass `render={<YourElement />}` to attach it to any element instead.
 * `delay` / `closeDelay` control the open/close timing for this trigger.
 */
function TooltipTrigger(
  props: React.ComponentProps<typeof TooltipPrimitive.Trigger>
) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

const tooltipDefaults = {
  variant: "default",
} as const

const tooltipVariants = cva(
  cn(
    "z-50 w-fit max-w-xs origin-[var(--transform-origin)] text-balance rounded-md px-3 py-1.5 text-xs font-medium shadow-md outline-none",
    "transition-[transform,scale,opacity] data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 data-instant:transition-none"
  ),
  {
    variants: {
      variant: {
        default: "bg-tooltip text-tooltip-foreground",
        primary: "bg-tooltip-primary text-tooltip-primary-foreground",
        secondary: "bg-tooltip-secondary text-tooltip-secondary-foreground",
        destructive:
          "bg-tooltip-destructive text-tooltip-destructive-foreground",
        success: "bg-tooltip-success text-tooltip-success-foreground",
        warning: "bg-tooltip-warning text-tooltip-warning-foreground",
        info: "bg-tooltip-info text-tooltip-info-foreground",
      },
    },
    defaultVariants: tooltipDefaults,
  }
)

type TooltipVariant = NonNullable<VariantProps<typeof tooltipVariants>["variant"]>

// The arrow is a separate positioned element, so it needs the matching fill.
const tooltipArrowFill: Record<TooltipVariant, string> = {
  default: "fill-tooltip",
  primary: "fill-tooltip-primary",
  secondary: "fill-tooltip-secondary",
  destructive: "fill-tooltip-destructive",
  success: "fill-tooltip-success",
  warning: "fill-tooltip-warning",
  info: "fill-tooltip-info",
}

/** The connecting arrow that points from the popup back to the trigger. */
function TooltipArrow({
  className,
  variant = tooltipDefaults.variant,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Arrow> & {
  variant?: TooltipVariant
}) {
  return (
    <TooltipPrimitive.Arrow
      data-slot="tooltip-arrow"
      className={cn(
        "data-[side=bottom]:top-[-9px] data-[side=top]:bottom-[-9px] data-[side=top]:rotate-180 data-[side=left]:right-[-14px] data-[side=left]:rotate-90 data-[side=right]:left-[-14px] data-[side=right]:-rotate-90",
        className
      )}
      {...props}
    >
      <svg width="20" height="10" viewBox="0 0 20 10" className={tooltipArrowFill[variant]}>
        <path d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.25979 10.0447 2.25979 9.66437 2.60207Z" />
      </svg>
    </TooltipPrimitive.Arrow>
  )
}

/**
 * The floating panel. Choose which `side` / `align` it opens on (it auto-flips
 * to stay in the viewport), pick a colour `variant`, and toggle the connecting
 * `showArrow`. Any React node can be the content — a string, or rich markup.
 */
function TooltipContent({
  className,
  children,
  variant = tooltipDefaults.variant,
  side = "top",
  sideOffset,
  align = "center",
  alignOffset = 0,
  showArrow = true,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Popup> &
  VariantProps<typeof tooltipVariants> &
  Pick<
    React.ComponentProps<typeof TooltipPrimitive.Positioner>,
    "side" | "sideOffset" | "align" | "alignOffset"
  > & {
    showArrow?: boolean
  }) {
  const resolvedVariant: TooltipVariant = variant ?? "default"
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        data-slot="tooltip-positioner"
        className="z-50"
        side={side}
        sideOffset={sideOffset ?? (showArrow ? 9 : 6)}
        align={align}
        alignOffset={alignOffset}
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(tooltipVariants({ variant }), className)}
          {...props}
        >
          {showArrow ? <TooltipArrow variant={resolvedVariant} /> : null}
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  tooltipVariants,
}

"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { cva } from "class-variance-authority"
import { ChevronDown, Minus, Plus } from "lucide-react"

import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------------------------------
 * Variant context
 *
 * The visual style is chosen on the root and shared with every item so the
 * matching separators / surfaces / paddings line up without repeating the prop.
 * ------------------------------------------------------------------------------------------------ */

type AccordionVariant = "default" | "solid" | "outline"

const AccordionVariantContext = React.createContext<AccordionVariant>("default")

/* -------------------------------------------------------------------------------------------------
 * Root
 * ------------------------------------------------------------------------------------------------ */

interface AccordionProps extends AccordionPrimitive.Root.Props {
  /**
   * Visual style shared by every item:
   * - `default` — flush rows split by a hairline separator (FAQ style).
   * - `solid` — each item is a filled, rounded surface.
   * - `outline` — each item is an outlined, rounded card.
   * @default "default"
   */
  variant?: AccordionVariant
}

function Accordion({
  className,
  variant = "default",
  ...props
}: AccordionProps) {
  return (
    <AccordionVariantContext.Provider value={variant}>
      <AccordionPrimitive.Root
        data-slot="accordion"
        data-variant={variant}
        className={cn(
          "w-full",
          // Solid / outline items are standalone cards, so space them out.
          variant !== "default" && "flex flex-col gap-2",
          className
        )}
        {...props}
      />
    </AccordionVariantContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Item
 * ------------------------------------------------------------------------------------------------ */

const accordionItemVariants = cva("group/item", {
  variants: {
    variant: {
      default: "border-b border-accordion-border",
      solid: "rounded-lg bg-accordion-solid px-4",
      outline: "rounded-lg border border-accordion-border px-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

type AccordionItemProps = AccordionPrimitive.Item.Props

function AccordionItem({ className, ...props }: AccordionItemProps) {
  const variant = React.useContext(AccordionVariantContext)
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(accordionItemVariants({ variant }), className)}
      {...props}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Trigger
 * ------------------------------------------------------------------------------------------------ */

type AccordionIndicator = "chevron" | "plus" | "none"
type AccordionIndicatorPosition = "start" | "end"

interface AccordionTriggerProps extends AccordionPrimitive.Trigger.Props {
  /**
   * Which expand/collapse affordance to render:
   * - `chevron` — a chevron that rotates 180° when open (default).
   * - `plus` — a plus that becomes a minus when open.
   * - `none` — no indicator (supply your own inside `children`).
   * @default "chevron"
   */
  indicator?: AccordionIndicator
  /**
   * Side of the header the indicator sits on.
   * @default "end"
   */
  indicatorPosition?: AccordionIndicatorPosition
}

function AccordionIndicatorIcon({
  indicator,
}: {
  indicator: AccordionIndicator
}) {
  if (indicator === "none") return null

  if (indicator === "plus") {
    return (
      <span
        aria-hidden="true"
        className="relative flex size-4 shrink-0 items-center justify-center text-accordion-indicator"
      >
        <Plus className="size-4 transition-opacity duration-200 group-data-[panel-open]/trigger:opacity-0" />
        <Minus className="absolute size-4 opacity-0 transition-opacity duration-200 group-data-[panel-open]/trigger:opacity-100" />
      </span>
    )
  }

  return (
    <ChevronDown
      aria-hidden="true"
      className="size-4 shrink-0 text-accordion-indicator transition-transform duration-200 group-data-[panel-open]/trigger:rotate-180"
    />
  )
}

function AccordionTrigger({
  className,
  children,
  indicator = "chevron",
  indicatorPosition = "end",
  ...props
}: AccordionTriggerProps) {
  const icon = <AccordionIndicatorIcon indicator={indicator} />

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/trigger flex flex-1 items-center gap-4 py-4 text-left text-sm font-medium outline-none transition-colors select-none",
          "hover:text-accordion-trigger-hover focus-visible:ring-3 focus-visible:ring-ring/50",
          "disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50",
          indicatorPosition === "start" && "flex-row-reverse justify-end",
          className
        )}
        {...props}
      >
        <span className="flex-1">{children}</span>
        {icon}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Content (Panel)
 *
 * Base UI exposes the natural panel height as `--accordion-panel-height`, so the
 * open/close transition animates `height` between that value and 0 (the
 * `starting`/`ending` style hooks Base UI toggles while mounting/unmounting).
 * ------------------------------------------------------------------------------------------------ */

type AccordionContentProps = AccordionPrimitive.Panel.Props

function AccordionContent({
  className,
  children,
  ...props
}: AccordionContentProps) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className={cn(
        "h-[var(--accordion-panel-height)] overflow-hidden text-sm text-muted-foreground transition-[height] duration-200 ease-out",
        "data-[starting-style]:h-0 data-[ending-style]:h-0"
      )}
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Panel>
  )
}

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  accordionItemVariants,
}
export type {
  AccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
  AccordionVariant,
  AccordionIndicator,
  AccordionIndicatorPosition,
}

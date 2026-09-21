import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const markerDefaults = {
  variant: "default",
} as const

const markerVariants = cva(
  "group/marker relative flex min-h-4 w-full items-center gap-2 text-left text-sm text-muted-foreground [a]:underline [a]:underline-offset-3 [a]:hover:text-foreground [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "",
        // The rules are decorative pseudo-elements, so the label stays the
        // only thing a screen reader announces.
        separator:
          "before:mr-1 before:h-px before:min-w-0 before:flex-1 before:bg-border after:ml-1 after:h-px after:min-w-0 after:flex-1 after:bg-border",
        border: "border-b border-border pb-2",
      },
    },
    defaultVariants: markerDefaults,
  }
)

/**
 * An inline conversation marker: a status line, a system note, a bordered row
 * or a labelled separator.
 *
 * Presentational by default — pick the semantics to match the use: `role
 *="status"` for streaming progress, or `render={<a href="..." />}` /
 * `render={<button />}` to make it a real link or button.
 */
function Marker({
  className,
  variant = markerDefaults.variant,
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof markerVariants>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(markerVariants({ variant, className })),
      },
      props
    ),
    render,
    // Becomes data-slot="marker" and data-variant="…" on the element.
    state: {
      slot: "marker",
      variant,
    },
  })
}

/** A decorative icon slot, hidden from assistive tech. */
function MarkerIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-icon"
      aria-hidden="true"
      className={cn(
        "size-4 shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

/** The marker's text. Centred between the rules in the separator variant. */
function MarkerContent({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-content"
      className={cn(
        "min-w-0 wrap-break-word group-data-[variant=separator]/marker:flex-none group-data-[variant=separator]/marker:text-center *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Marker, MarkerIcon, MarkerContent, markerVariants }

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardDefaults = {
  variant: "default",
} as const

const cardVariants = cva(
  "flex flex-col gap-6 overflow-hidden rounded-xl border border-card-border bg-card py-6 text-card-foreground",
  {
    variants: {
      variant: {
        default: "",
        accent: "bg-card-accent",
        ghost: "border-transparent",
      },
    },
    defaultVariants: cardDefaults,
  }
)

function Card({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return (
    <div
      data-slot="card"
      data-variant={variant ?? "default"}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
}

function CardHeader({
  className,
  separator = false,
  ...props
}: React.ComponentProps<"div"> & { separator?: boolean }) {
  return (
    <div
      data-slot="card-header"
      data-separator={separator ? "" : undefined}
      className={cn(
        "grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-toolbar]:grid-cols-[1fr_auto]",
        separator && "border-b border-card-border pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardHeading({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-heading"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("font-heading leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardToolbar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-toolbar"
      className={cn(
        "col-start-2 row-span-2 row-start-1 flex items-center gap-2 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-media"
      className={cn(
        "relative overflow-hidden first:-mt-6 last:-mb-6 [&_img]:h-full [&_img]:w-full [&_img]:object-cover",
        className
      )}
      {...props}
    />
  )
}

function CardMediaOverlay({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-media-overlay"
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-card to-transparent",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-content" className={cn("px-6", className)} {...props} />
  )
}

function CardTable({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-table"
      className={cn(
        "grid overflow-x-auto [&_table]:w-full [&_table]:caption-bottom [&_table]:text-sm",
        className
      )}
      {...props}
    />
  )
}

function CardFooter({
  className,
  separator = false,
  ...props
}: React.ComponentProps<"div"> & { separator?: boolean }) {
  return (
    <div
      data-slot="card-footer"
      data-separator={separator ? "" : undefined}
      className={cn(
        "flex items-center gap-2 px-6",
        separator && "border-t border-card-border pt-6",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardHeading,
  CardTitle,
  CardDescription,
  CardAction,
  CardToolbar,
  CardMedia,
  CardMediaOverlay,
  CardContent,
  CardTable,
  CardFooter,
  cardVariants,
}

"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

// A feedback banner modeled on ReUI's Alert. It crosses two axes:
//   variant     — the status colour (primary, secondary, destructive,
//                 success, info, warning, mono)
//   appearance  — the visual treatment of that colour (solid fill, light
//                 tint, outline, or subtle stroke)
// plus a size and an optional dismiss button, and it composes from
// AlertIcon / AlertContent / AlertTitle / AlertDescription / AlertToolbar.
//
// Every status colour comes from an `--alert-*` token (see app/globals.css and
// the item's `cssVars` in registry.json) so the whole palette is restyleable
// from one place — no hard-coded hex / named Tailwind colours live here. The
// class strings are written out in full (never interpolated) so Tailwind's
// scanner generates every utility.
const alertDefaults = {
  variant: "secondary",
  appearance: "solid",
  size: "md",
} as const

const alertVariants = cva(
  "relative flex w-full items-start rounded-lg text-start [&_[data-slot=alert-icon]]:shrink-0",
  {
    variants: {
      variant: {
        primary: "",
        secondary: "",
        destructive: "",
        success: "",
        info: "",
        warning: "",
        mono: "",
      },
      appearance: {
        solid: "",
        light: "",
        outline: "",
        stroke: "",
      },
      size: {
        sm: "gap-2 px-3 py-2.5 text-xs [&_[data-slot=alert-icon]>svg]:size-4",
        md: "gap-2.5 px-3.5 py-3 text-sm [&_[data-slot=alert-icon]>svg]:size-5",
        lg: "gap-3 px-4 py-3.5 text-base [&_[data-slot=alert-icon]>svg]:size-6",
      },
    },
    compoundVariants: [
      // ---- primary ----
      {
        variant: "primary",
        appearance: "solid",
        className:
          "bg-alert-primary text-alert-primary-foreground [&_[data-slot=alert-description]]:text-current [&_[data-slot=alert-description]]:opacity-90",
      },
      {
        variant: "primary",
        appearance: "light",
        className:
          "bg-alert-primary/10 text-foreground [&_[data-slot=alert-icon]]:text-alert-primary",
      },
      {
        variant: "primary",
        appearance: "outline",
        className:
          "border border-alert-primary/30 bg-transparent text-foreground [&_[data-slot=alert-icon]]:text-alert-primary",
      },
      {
        variant: "primary",
        appearance: "stroke",
        className:
          "border border-border bg-transparent text-foreground [&_[data-slot=alert-icon]]:text-alert-primary",
      },
      // ---- destructive ----
      {
        variant: "destructive",
        appearance: "solid",
        className:
          "bg-alert-destructive text-alert-destructive-foreground [&_[data-slot=alert-description]]:text-current [&_[data-slot=alert-description]]:opacity-90",
      },
      {
        variant: "destructive",
        appearance: "light",
        className:
          "bg-alert-destructive/10 text-foreground [&_[data-slot=alert-icon]]:text-alert-destructive",
      },
      {
        variant: "destructive",
        appearance: "outline",
        className:
          "border border-alert-destructive/30 bg-transparent text-foreground [&_[data-slot=alert-icon]]:text-alert-destructive",
      },
      {
        variant: "destructive",
        appearance: "stroke",
        className:
          "border border-border bg-transparent text-foreground [&_[data-slot=alert-icon]]:text-alert-destructive",
      },
      // ---- success ----
      {
        variant: "success",
        appearance: "solid",
        className:
          "bg-alert-success text-alert-success-foreground [&_[data-slot=alert-description]]:text-current [&_[data-slot=alert-description]]:opacity-90",
      },
      {
        variant: "success",
        appearance: "light",
        className:
          "bg-alert-success/10 text-foreground [&_[data-slot=alert-icon]]:text-alert-success",
      },
      {
        variant: "success",
        appearance: "outline",
        className:
          "border border-alert-success/30 bg-transparent text-foreground [&_[data-slot=alert-icon]]:text-alert-success",
      },
      {
        variant: "success",
        appearance: "stroke",
        className:
          "border border-border bg-transparent text-foreground [&_[data-slot=alert-icon]]:text-alert-success",
      },
      // ---- info ----
      {
        variant: "info",
        appearance: "solid",
        className:
          "bg-alert-info text-alert-info-foreground [&_[data-slot=alert-description]]:text-current [&_[data-slot=alert-description]]:opacity-90",
      },
      {
        variant: "info",
        appearance: "light",
        className:
          "bg-alert-info/10 text-foreground [&_[data-slot=alert-icon]]:text-alert-info",
      },
      {
        variant: "info",
        appearance: "outline",
        className:
          "border border-alert-info/30 bg-transparent text-foreground [&_[data-slot=alert-icon]]:text-alert-info",
      },
      {
        variant: "info",
        appearance: "stroke",
        className:
          "border border-border bg-transparent text-foreground [&_[data-slot=alert-icon]]:text-alert-info",
      },
      // ---- warning ----
      {
        variant: "warning",
        appearance: "solid",
        className:
          "bg-alert-warning text-alert-warning-foreground [&_[data-slot=alert-description]]:text-current [&_[data-slot=alert-description]]:opacity-90",
      },
      {
        variant: "warning",
        appearance: "light",
        className:
          "bg-alert-warning/10 text-foreground [&_[data-slot=alert-icon]]:text-alert-warning",
      },
      {
        variant: "warning",
        appearance: "outline",
        className:
          "border border-alert-warning/30 bg-transparent text-foreground [&_[data-slot=alert-icon]]:text-alert-warning",
      },
      {
        variant: "warning",
        appearance: "stroke",
        className:
          "border border-border bg-transparent text-foreground [&_[data-slot=alert-icon]]:text-alert-warning",
      },
      // ---- secondary (neutral) ----
      {
        variant: "secondary",
        appearance: "solid",
        className:
          "bg-muted text-foreground [&_[data-slot=alert-icon]]:text-muted-foreground",
      },
      {
        variant: "secondary",
        appearance: "light",
        className:
          "bg-muted/50 text-foreground [&_[data-slot=alert-icon]]:text-muted-foreground",
      },
      {
        variant: "secondary",
        appearance: "outline",
        className:
          "border border-border bg-transparent text-foreground [&_[data-slot=alert-icon]]:text-muted-foreground",
      },
      {
        variant: "secondary",
        appearance: "stroke",
        className:
          "border border-border bg-transparent text-foreground [&_[data-slot=alert-icon]]:text-muted-foreground",
      },
      // ---- mono (high-contrast neutral) ----
      {
        variant: "mono",
        appearance: "solid",
        className:
          "bg-foreground text-background [&_[data-slot=alert-description]]:text-current [&_[data-slot=alert-description]]:opacity-90",
      },
      {
        variant: "mono",
        appearance: "light",
        className:
          "bg-foreground/10 text-foreground [&_[data-slot=alert-icon]]:text-foreground",
      },
      {
        variant: "mono",
        appearance: "outline",
        className:
          "border border-foreground/30 bg-transparent text-foreground [&_[data-slot=alert-icon]]:text-foreground",
      },
      {
        variant: "mono",
        appearance: "stroke",
        className:
          "border border-border bg-transparent text-foreground [&_[data-slot=alert-icon]]:text-foreground",
      },
    ],
    defaultVariants: alertDefaults,
  }
)

interface AlertProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof alertVariants> {
  /** Renders a dismiss (×) button that hides the alert on click. */
  close?: boolean
  /** Fired after the dismiss button hides the alert. */
  onClose?: () => void
}

function Alert({
  variant,
  appearance,
  size,
  close = false,
  onClose,
  className,
  children,
  ...props
}: AlertProps) {
  const [open, setOpen] = React.useState(true)

  if (!open) return null

  return (
    <div
      role="alert"
      data-slot="alert"
      className={cn(alertVariants({ variant, appearance, size }), className)}
      {...props}
    >
      {children}
      {close ? (
        <button
          type="button"
          data-slot="alert-close"
          aria-label="Dismiss"
          onClick={() => {
            setOpen(false)
            onClose?.()
          }}
          className="-me-1 -my-1 ms-1 inline-flex shrink-0 items-center justify-center rounded-md p-1 opacity-70 transition-opacity outline-none hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/50 [&>svg]:size-4"
        >
          <X />
        </button>
      ) : null}
    </div>
  )
}

// Leading icon slot. Give it any node (a lucide icon works out of the box); the
// svg is sized by the Alert's `size` variant.
function AlertIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-icon"
      className={cn("flex items-start", className)}
      {...props}
    />
  )
}

// Wraps a title + description so they stack. Optional — a title-only alert can
// drop AlertTitle straight into the Alert.
function AlertContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-content"
      className={cn("flex min-w-0 grow flex-col gap-1", className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "grow font-medium tracking-tight [&:not(:last-child)]:mb-0.5",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm/relaxed text-muted-foreground [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4",
        className
      )}
      {...props}
    />
  )
}

// Trailing actions (buttons, links). Sits at the end of the row.
function AlertToolbar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-toolbar"
      className={cn("flex shrink-0 items-center gap-2", className)}
      {...props}
    />
  )
}

export {
  Alert,
  AlertIcon,
  AlertContent,
  AlertTitle,
  AlertDescription,
  AlertToolbar,
  alertVariants,
  type AlertProps,
}

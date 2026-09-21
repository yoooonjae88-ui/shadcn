"use client"

import * as React from "react"
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/**
 * AlertDialog — a focused modal that interrupts the user to confirm a
 * critical, usually irreversible action. Built on Base UI AlertDialog, so it
 * traps focus, locks scroll and — unlike a plain Dialog — cannot be dismissed
 * by clicking the backdrop (the user must pick an explicit action). Escape
 * still cancels.
 *
 * Composes the ReUI/shadcn part set: AlertDialog / AlertDialogTrigger /
 * AlertDialogContent / AlertDialogHeader / AlertDialogFooter /
 * AlertDialogTitle / AlertDialogDescription / AlertDialogAction /
 * AlertDialogCancel, plus an AlertDialogIcon status badge.
 */
function AlertDialog(
  props: React.ComponentProps<typeof AlertDialogPrimitive.Root>
) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger(
  props: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>
) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

function AlertDialogPortal(
  props: React.ComponentProps<typeof AlertDialogPrimitive.Portal>
) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Backdrop>) {
  return (
    <AlertDialogPrimitive.Backdrop
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0",
        className
      )}
      {...props}
    />
  )
}

const alertDialogContentDefaults = {
  size: "default",
} as const

const alertDialogContentVariants = cva(
  "fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-6 text-popover-foreground shadow-lg outline-none transition-all duration-200 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        default: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
      },
    },
    defaultVariants: alertDialogContentDefaults,
  }
)

function AlertDialogContent({
  className,
  size = alertDialogContentDefaults.size,
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Popup> &
  VariantProps<typeof alertDialogContentVariants>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Popup
        data-slot="alert-dialog-content"
        className={cn(alertDialogContentVariants({ size }), className)}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Popup>
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

// A circular status badge shown above the title (e.g. a warning triangle for a
// destructive delete). Colours resolve from the item's --alert-dialog-* tokens
// so the whole palette restyles from globals.css.
const alertDialogIconDefaults = {
  variant: "default",
} as const

const alertDialogIconVariants = cva(
  "flex size-11 shrink-0 items-center justify-center rounded-full [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-alert-dialog-default-surface text-alert-dialog-default",
        destructive:
          "bg-alert-dialog-destructive-surface text-alert-dialog-destructive",
        success: "bg-alert-dialog-success-surface text-alert-dialog-success",
        warning: "bg-alert-dialog-warning-surface text-alert-dialog-warning",
        info: "bg-alert-dialog-info-surface text-alert-dialog-info",
      },
    },
    defaultVariants: alertDialogIconDefaults,
  }
)

function AlertDialogIcon({
  className,
  variant = alertDialogIconDefaults.variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertDialogIconVariants>) {
  return (
    <div
      data-slot="alert-dialog-icon"
      className={cn(alertDialogIconVariants({ variant }), className)}
      {...props}
    />
  )
}

// The confirming button. Defaults to the primary Button variant and closes the
// dialog on click (attach your side effect via onClick). Pass `variant` to
// override — e.g. "destructive" for a delete. Rendered as an AlertDialog.Close
// so the dialog dismisses once the action fires; for async work that should
// keep the dialog open, control `open` yourself and use a plain <Button>.
function AlertDialogAction({
  variant = "default",
  size,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-action"
      render={<Button variant={variant} size={size} />}
      {...props}
    />
  )
}

// The safe/dismissing button. Defaults to the outline Button variant.
function AlertDialogCancel({
  variant = "outline",
  size,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-cancel"
      render={<Button variant={variant} size={size} />}
      {...props}
    />
  )
}

// Raw close primitive, for a custom close control (e.g. an X icon button).
function AlertDialogClose(
  props: React.ComponentProps<typeof AlertDialogPrimitive.Close>
) {
  return <AlertDialogPrimitive.Close data-slot="alert-dialog-close" {...props} />
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogIcon,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogClose,
  alertDialogContentVariants,
  alertDialogIconVariants,
}

"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/*
 * A composable input container modeled on ReUI's Input Group. Wrap an
 * InputGroupInput or InputGroupTextarea with any number of InputGroupAddon
 * slots to hang icons, text affixes, buttons, kbd hints, spinners, tooltips
 * or menus off the field. Addons align to either inline edge, or — for a
 * textarea — to a block edge to build a top/bottom toolbar.
 *
 * The frame owns the border, focus ring and invalid/disabled states via
 * `has-*` selectors that read the control's own focus/aria-invalid/disabled,
 * so the inner control stays borderless and transparent. Every colour resolves
 * from existing theme tokens, so the item ships no cssVars.
 */

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="group"
      data-slot="input-group"
      className={cn(
        "group/input-group relative flex w-full min-w-0 items-center rounded-lg border border-input bg-transparent text-sm transition-[color,box-shadow] outline-none dark:bg-input/30",
        "h-9 has-[>textarea]:h-auto",
        // Trim the control's edge padding on whichever side carries an addon.
        "has-[>[data-align=inline-start]]:[&>input]:pl-2 has-[>[data-align=inline-end]]:[&>input]:pr-2",
        // Block addons stack the control above/below a full-width toolbar.
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col",
        // Focus ring driven by the inner control.
        "has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50",
        // Invalid + disabled, also driven by the control.
        "has-[[data-slot=input-group-control][aria-invalid=true]]:border-destructive has-[[data-slot=input-group-control][aria-invalid=true]]:ring-[3px] has-[[data-slot=input-group-control][aria-invalid=true]]:ring-destructive/20",
        "has-[[data-slot=input-group-control]:disabled]:opacity-50",
        className
      )}
      {...props}
    />
  )
}

const inputGroupAddonDefaults = {
      align: "inline-start",
    } as const

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 text-sm font-medium text-muted-foreground select-none [&>svg:not([class*='size-'])]:size-4 [&>kbd]:pointer-events-none group-has-[[data-slot=input-group-control]:disabled]/input-group:opacity-50",
  {
    variants: {
      align: {
        "inline-start": "order-first py-1.5 pl-3 has-[>button]:-ml-1.5",
        "inline-end": "order-last py-1.5 pr-3 has-[>button]:-mr-1.5",
        "block-start":
          "order-first w-full justify-start px-3 pt-2.5 group-has-[>input]/input-group:pt-2",
        "block-end":
          "order-last w-full justify-start px-3 pb-2.5 group-has-[>input]/input-group:pb-2",
      },
    },
    defaultVariants: inputGroupAddonDefaults,
  }
)

function InputGroupAddon({
  className,
  align = inputGroupAddonDefaults.align,
  onClick,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(event) => {
        onClick?.(event)
        // Clicking the padding focuses the control, but let real controls
        // inside the addon (buttons, links) handle their own clicks.
        if (
          event.defaultPrevented ||
          (event.target instanceof HTMLElement &&
            event.target.closest("button, a, input, textarea, [role=menuitem]"))
        ) {
          return
        }
        event.currentTarget.parentElement
          ?.querySelector<HTMLElement>("[data-slot=input-group-control]")
          ?.focus()
      }}
      {...props}
    />
  )
}

/** A button sized to sit inside an addon. Reuses the registry Button. */
function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      data-slot="input-group-button"
      className={cn("shadow-none", className)}
      {...props}
    />
  )
}

/** Static text affix inside an addon (e.g. `https://`, `.com`, `@`). */
function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="input-group-text"
      className={cn(
        "flex items-center gap-1.5 text-sm text-muted-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
        className
      )}
      {...props}
    />
  )
}

const controlClassName =
  "min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"

function InputGroupInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input-group-control"
      className={cn(controlClassName, "h-full px-3", className)}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="input-group-control"
      className={cn(
        controlClassName,
        "w-full resize-none px-3 py-2.5 field-sizing-content",
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
  inputGroupAddonVariants,
}

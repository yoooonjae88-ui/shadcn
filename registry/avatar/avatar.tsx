"use client"

import * as React from "react"
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Root sizing/shape. Image and Fallback fill the root and inherit its radius
// (`rounded-[inherit]`), so a single `shape` here rounds the whole avatar.
// The root is intentionally NOT `overflow-hidden` so indicators/status dots
// can bleed past its edge — the Image/Fallback clip themselves instead.
const avatarVariants = cva(
  "group/avatar relative flex shrink-0 items-center justify-center align-middle",
  {
    variants: {
      size: {
        xs: "size-6 text-[0.625rem]",
        sm: "size-8 text-xs",
        default: "size-10 text-sm",
        lg: "size-12 text-base",
        xl: "size-16 text-xl",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-lg",
      },
    },
    defaultVariants: {
      size: "default",
      shape: "circle",
    },
  }
)

interface AvatarProps
  extends React.ComponentProps<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}

// Displays a user's profile picture, initials, or fallback icon. Built on
// Base UI Avatar so the Fallback shows automatically while/if the Image
// fails to load.
function Avatar({ className, size, shape, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(avatarVariants({ size, shape }), className)}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "size-full rounded-[inherit] object-cover",
        className
      )}
      {...props}
    />
  )
}

// Shown when there is no image or it fails to load. Renders centered initials
// (or any node — e.g. a lucide icon). Defaults to the `muted` surface token.
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-[inherit] bg-muted font-medium text-muted-foreground select-none",
        className
      )}
      {...props}
    />
  )
}

// A positioned overlay slot pinned to one corner of the avatar. Use it to hang
// a status dot, a small badge, a verified check, etc. Sits above the clipped
// image because the root isn't `overflow-hidden`.
const avatarIndicatorVariants = cva("absolute z-10 flex items-center justify-center", {
  variants: {
    position: {
      "top-start": "top-0 left-0",
      "top-end": "top-0 right-0",
      "bottom-start": "bottom-0 left-0",
      "bottom-end": "bottom-0 right-0",
    },
  },
  defaultVariants: {
    position: "top-end",
  },
})

interface AvatarIndicatorProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof avatarIndicatorVariants> {}

function AvatarIndicator({
  className,
  position,
  ...props
}: AvatarIndicatorProps) {
  return (
    <span
      data-slot="avatar-indicator"
      className={cn(avatarIndicatorVariants({ position }), className)}
      {...props}
    />
  )
}

// A presence dot. Colors come from theme tokens (--avatar-online etc.). The
// `ring` cuts the dot out of the avatar/background so it reads as a badge; a
// ring is not a border utility, so this respects the no-borders convention.
const avatarStatusVariants = cva(
  "block rounded-full ring-2 ring-background",
  {
    variants: {
      variant: {
        online: "bg-avatar-online",
        offline: "bg-avatar-offline",
        busy: "bg-avatar-busy",
        away: "bg-avatar-away",
      },
      size: {
        xs: "size-1.5",
        sm: "size-2",
        default: "size-2.5",
        lg: "size-3",
        xl: "size-3.5",
      },
    },
    defaultVariants: {
      variant: "online",
      size: "default",
    },
  }
)

interface AvatarStatusProps
  extends Omit<React.ComponentProps<"span">, "children">,
    VariantProps<typeof avatarStatusVariants> {}

function AvatarStatus({
  className,
  variant,
  size,
  "aria-label": ariaLabel,
  ...props
}: AvatarStatusProps) {
  return (
    <span
      data-slot="avatar-status"
      role="img"
      aria-label={ariaLabel ?? variant ?? undefined}
      className={cn(avatarStatusVariants({ variant, size }), className)}
      {...props}
    />
  )
}

interface AvatarGroupProps extends React.ComponentProps<"div"> {
  /**
   * Max avatars to show before collapsing the rest into a `+N` count.
   * Omit to show every child.
   */
  max?: number
  /** Size applied to the auto-generated `+N` overflow avatar. */
  size?: VariantProps<typeof avatarVariants>["size"]
  /** Shape applied to the auto-generated `+N` overflow avatar. */
  shape?: VariantProps<typeof avatarVariants>["shape"]
}

// Overlapping stack of avatars. Children are pulled leftward and each gets a
// background-colored ring so the overlap reads cleanly. When `max` is set,
// extras collapse into a trailing `+N` avatar.
function AvatarGroup({
  max,
  size = "default",
  shape,
  className,
  children,
  ...props
}: AvatarGroupProps) {
  const items = React.Children.toArray(children)
  const visible = max != null ? items.slice(0, max) : items
  const overflow = max != null ? items.length - max : 0

  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "flex items-center -space-x-2 [&_[data-slot=avatar]]:ring-2 [&_[data-slot=avatar]]:ring-background",
        className
      )}
      {...props}
    >
      {visible}
      {overflow > 0 && (
        <Avatar size={size} shape={shape}>
          <AvatarFallback>+{overflow}</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarIndicator,
  AvatarStatus,
  AvatarGroup,
  avatarVariants,
  type AvatarProps,
  type AvatarIndicatorProps,
  type AvatarStatusProps,
  type AvatarGroupProps,
}

"use client"

import * as React from "react"
import { ArrowUp, FileText, X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Badge, type BadgeProps } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/* -------------------------------------------------------------------------- *
 * Float Button
 *
 * A floating action button modeled on Ant Design's FloatButton: a circular or
 * square button pinned to a corner of the viewport (or of any positioned
 * container) for the one action that should follow the user everywhere.
 *
 * Three pieces:
 *   - FloatButton          a single action, with icon / description / tooltip
 *   - FloatButton.Group    several actions, stacked or behind a menu trigger
 *   - FloatButton.BackTop  scrolls its target back to the top, appearing only
 *                          once the user has scrolled past `visibilityHeight`
 *
 * Every colour resolves from a --float-button-* theme token, so the whole set
 * restyles from app/globals.css.
 * -------------------------------------------------------------------------- */

type FloatButtonType = "default" | "primary"
type FloatButtonShape = "circle" | "square"
type FloatButtonSize = "sm" | "default" | "lg"

/** Which corner the button (or group) pins itself to. */
type FloatButtonCorner =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"

/** Distance from the corner, in px. A number sets both axes. */
type FloatButtonOffset = number | { x?: number; y?: number }

/** Which way a menu group's items fly out from its trigger. */
type FloatButtonPlacement = "top" | "bottom" | "left" | "right"

/** The badge pinned to a button's corner — a count or a dot. */
type FloatButtonBadge = Pick<
  BadgeProps,
  "count" | "dot" | "color" | "overflowCount" | "showZero" | "offset" | "size"
>

/** Where the button sits: over the page, or inside a positioned ancestor. */
type FloatButtonPosition = "fixed" | "absolute"

// ---------------------------------------------------------------------------
// Anchoring
// ---------------------------------------------------------------------------

type AnchorProps = {
  position?: FloatButtonPosition
  corner?: FloatButtonCorner
  offset?: FloatButtonOffset
}

function anchorStyle({
  position = "fixed",
  corner = "bottom-right",
  offset = 24,
}: AnchorProps): React.CSSProperties {
  const x = typeof offset === "number" ? offset : (offset.x ?? 24)
  const y = typeof offset === "number" ? offset : (offset.y ?? 24)

  return {
    position,
    [corner.startsWith("top") ? "top" : "bottom"]: y,
    [corner.endsWith("left") ? "left" : "right"]: x,
  }
}

/**
 * Pins its children to a corner. Standalone buttons and groups render one of
 * these themselves; buttons inside a group are positioned by the group.
 */
function FloatButtonAnchor({
  className,
  style,
  position,
  corner,
  offset,
  ...props
}: React.ComponentProps<"div"> & AnchorProps) {
  return (
    <div
      data-slot="float-button-anchor"
      className={cn("z-50 flex flex-col items-center", className)}
      style={{ ...anchorStyle({ position, corner, offset }), ...style }}
      {...props}
    />
  )
}

// ---------------------------------------------------------------------------
// Group context — items inherit shape/size and give up their own positioning
// ---------------------------------------------------------------------------

type FloatButtonGroupContextValue = {
  shape: FloatButtonShape
  size: FloatButtonSize
  /** A square stack merges its buttons into one slab (no gaps, no radii). */
  merged: boolean
}

const FloatButtonGroupContext =
  React.createContext<FloatButtonGroupContextValue | null>(null)

// ---------------------------------------------------------------------------
// Geometry — the pixel sizes the cva variants below render, needed by the
// pieces that have to be drawn against the button's outline (its corner badge
// and BackTop's progress ring) rather than its bounding box.
// ---------------------------------------------------------------------------

/** Diameter of each size, in px. Mirrors the `size` variants. */
const BUTTON_SIZE: Record<FloatButtonSize, number> = {
  sm: 40,
  default: 48,
  lg: 56,
}

/** Corner radius of a square button, in px (`rounded-2xl`). */
const SQUARE_RADIUS = 16

const cornerRadius = (shape: FloatButtonShape, size: FloatButtonSize) =>
  shape === "circle" ? BUTTON_SIZE[size] / 2 : SQUARE_RADIUS

/**
 * A badge pinned to the button's bounding box hangs off a rounded corner in
 * mid-air, so it is pulled back along the diagonal onto the edge itself: the
 * point on a corner arc at 45° sits `r(1 − √½)` inside the box's corner.
 */
function badgeCornerOffset(
  shape: FloatButtonShape,
  size: FloatButtonSize
): [number, number] {
  const inset = Math.round(cornerRadius(shape, size) * (1 - Math.SQRT1_2))
  return [-inset, inset]
}

// ---------------------------------------------------------------------------
// FloatButton
// ---------------------------------------------------------------------------

const floatButtonDefaults = {
  type: "default",
  shape: "circle",
  size: "default",
  labelled: false,
  merged: false,
} as const

const floatButtonVariants = cva(
  cn(
    "group/float-button relative flex shrink-0 cursor-pointer flex-col items-center justify-center gap-0.5 leading-tight font-medium shadow-lg transition-[background-color,color,box-shadow,transform] outline-none select-none",
    "hover:shadow-xl focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0"
  ),
  {
    variants: {
      type: {
        default:
          "bg-float-button text-float-button-foreground hover:bg-float-button-hover",
        primary:
          "bg-float-button-primary text-float-button-primary-foreground hover:bg-float-button-primary-hover",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-2xl",
      },
      size: {
        sm: "h-10 w-10 text-[10px] [&_svg:not([class*='size-'])]:size-4",
        default: "h-12 w-12 text-[11px] [&_svg:not([class*='size-'])]:size-5",
        lg: "h-14 w-14 text-xs [&_svg:not([class*='size-'])]:size-6",
      },
      // A button carrying a description grows to fit its label instead of
      // staying a fixed square.
      labelled: {
        true: "",
        false: "",
      },
      // Inside a merged square stack the buttons share one slab, so they drop
      // their own radius and shadow.
      merged: {
        true: "rounded-none shadow-none hover:shadow-none",
        false: "",
      },
    },
    compoundVariants: [
      {
        size: "sm",
        labelled: true,
        class: "h-auto w-auto min-h-10 min-w-10 px-2 py-1.5",
      },
      {
        size: "default",
        labelled: true,
        class: "h-auto w-auto min-h-12 min-w-12 px-2.5 py-2",
      },
      {
        size: "lg",
        labelled: true,
        class: "h-auto w-auto min-h-14 min-w-14 px-3 py-2.5",
      },
    ],
    defaultVariants: floatButtonDefaults,
  }
)

interface FloatButtonProps
  extends Omit<React.ComponentProps<"button">, "type">,
    Omit<VariantProps<typeof floatButtonVariants>, "labelled" | "merged">,
    AnchorProps {
  /** Glyph shown in the button. Defaults to a document icon, as Ant's does. */
  icon?: React.ReactNode
  /** Short label under the icon. Only shown on `square` buttons. */
  description?: React.ReactNode
  /** Hint revealed on hover/focus. */
  tooltip?: React.ReactNode
  /** Side the tooltip opens on. */
  tooltipSide?: "top" | "bottom" | "left" | "right"
  /** A count/dot badge pinned to the button's corner. */
  badge?: FloatButtonBadge
  /** Render as a link instead of a button. */
  href?: string
  target?: React.HTMLAttributeAnchorTarget
  /** The native `type` of the rendered `<button>` (`type` picks the colour). */
  htmlType?: "button" | "submit" | "reset"
}

function FloatButton({
  className,
  style,
  type = floatButtonDefaults.type,
  shape,
  size,
  icon,
  description,
  tooltip,
  tooltipSide = "left",
  badge,
  href,
  target,
  htmlType = "button",
  position,
  corner,
  offset,
  children,
  ...props
}: FloatButtonProps) {
  const group = React.useContext(FloatButtonGroupContext)

  const resolvedShape = shape ?? group?.shape ?? floatButtonDefaults.shape
  const resolvedSize = size ?? group?.size ?? floatButtonDefaults.size
  // Ant only shows a description on square buttons — a circle has no room.
  const label = resolvedShape === "square" ? description : undefined

  const content = (
    <>
      {icon ?? (children == null && label == null ? <FileText /> : null)}
      {label != null && (
        <span data-slot="float-button-description" className="max-w-20 truncate">
          {label}
        </span>
      )}
      {children}
    </>
  )

  const buttonProps = {
    "data-slot": "float-button",
    "data-type": type,
    "data-shape": resolvedShape,
    className: cn(
      floatButtonVariants({
        type,
        shape: resolvedShape,
        size: resolvedSize,
        labelled: label != null,
        merged: group?.merged ?? false,
      }),
      className
    ),
    style,
    ...props,
  }

  // The `<a>` branch takes the same props; they're all valid on an anchor
  // except the button-only ones, which the caller doesn't pass with `href`.
  const anchorProps = buttonProps as unknown as React.ComponentProps<"a">
  const rel =
    target === "_blank"
      ? ((props as { rel?: string }).rel ?? "noreferrer")
      : undefined

  let node: React.ReactElement
  if (tooltip != null) {
    node = (
      <Tooltip>
        <TooltipTrigger
          render={
            href ? (
              <a href={href} target={target} rel={rel} />
            ) : (
              <button type={htmlType} />
            )
          }
          {...(buttonProps as React.ComponentProps<typeof TooltipTrigger>)}
        >
          {content}
        </TooltipTrigger>
        <TooltipContent side={tooltipSide}>{tooltip}</TooltipContent>
      </Tooltip>
    )
  } else if (href) {
    node = (
      <a href={href} target={target} rel={rel} {...anchorProps}>
        {content}
      </a>
    )
  } else {
    node = (
      <button type={htmlType} {...buttonProps}>
        {content}
      </button>
    )
  }

  if (badge) {
    node = (
      <Badge
        data-slot="float-button-badge"
        className="flex"
        offset={badgeCornerOffset(resolvedShape, resolvedSize)}
        {...badge}
      >
        {node}
      </Badge>
    )
  }

  // Inside a group the group owns the positioning.
  if (group) return node

  return (
    <FloatButtonAnchor position={position} corner={corner} offset={offset}>
      {node}
    </FloatButtonAnchor>
  )
}

// ---------------------------------------------------------------------------
// FloatButton.Group
// ---------------------------------------------------------------------------

// Where the menu sits relative to the trigger, and the order items stack in
// (nearest the trigger first).
const MENU_PLACEMENT: Record<FloatButtonPlacement, string> = {
  top: "bottom-full left-1/2 mb-3 -translate-x-1/2 flex-col-reverse",
  bottom: "top-full left-1/2 mt-3 -translate-x-1/2 flex-col",
  left: "right-full top-1/2 mr-3 -translate-y-1/2 flex-row-reverse",
  right: "left-full top-1/2 ml-3 -translate-y-1/2 flex-row",
}

interface FloatButtonGroupProps
  extends Omit<React.ComponentProps<"div">, "onChange">,
    AnchorProps {
  /** Shape applied to every button in the group. */
  shape?: FloatButtonShape
  /** Size applied to every button in the group. */
  size?: FloatButtonSize
  /**
   * Hide the buttons behind a trigger that opens them as a menu. Omit to stack
   * the buttons permanently.
   */
  trigger?: "click" | "hover"
  /** Controlled open state of the menu. */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Which way the menu opens. */
  placement?: FloatButtonPlacement
  /** Colour of the trigger button. */
  type?: FloatButtonType
  /** Trigger glyph while the menu is closed. */
  icon?: React.ReactNode
  /** Trigger glyph while the menu is open. */
  closeIcon?: React.ReactNode
  /** Trigger label (square triggers only). */
  description?: React.ReactNode
  /** Trigger tooltip. */
  tooltip?: React.ReactNode
  tooltipSide?: "top" | "bottom" | "left" | "right"
  /** Badge on the trigger. */
  badge?: FloatButtonBadge
  /** Accessible name for the trigger. */
  triggerLabel?: string
}

function FloatButtonGroup({
  className,
  style,
  shape = floatButtonDefaults.shape,
  size = floatButtonDefaults.size,
  trigger,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placement = "top",
  type = floatButtonDefaults.type,
  icon,
  closeIcon,
  description,
  tooltip,
  tooltipSide = "left",
  badge,
  triggerLabel = "Toggle actions",
  position,
  corner,
  offset,
  children,
  ...props
}: FloatButtonGroupProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen
  const rootRef = React.useRef<HTMLDivElement>(null)
  const menuId = React.useId()

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [onOpenChange, openProp]
  )

  // Click triggers close on an outside click or Escape, like a menu should.
  React.useEffect(() => {
    if (trigger !== "click" || !open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open, setOpen, trigger])

  const items = React.Children.toArray(children).filter(React.isValidElement)

  // A plain (triggerless) stack of square buttons reads as one slab.
  const merged = trigger === undefined && shape === "square"
  const context = React.useMemo<FloatButtonGroupContextValue>(
    () => ({ shape, size, merged }),
    [merged, shape, size]
  )

  // Triggerless: the buttons are simply stacked, always visible.
  if (trigger === undefined) {
    return (
      <FloatButtonAnchor
        position={position}
        corner={corner}
        offset={offset}
        className={cn(
          merged
            ? "items-stretch overflow-hidden rounded-2xl shadow-lg"
            : "items-center gap-2",
          className
        )}
        style={style}
        {...props}
      >
        <FloatButtonGroupContext.Provider value={context}>
          {merged
            ? items.flatMap((item, index) =>
                index === 0
                  ? [item]
                  : [
                      <span
                        key={`separator-${index}`}
                        aria-hidden
                        data-slot="float-button-separator"
                        className="h-px w-full bg-float-button-separator"
                      />,
                      item,
                    ]
              )
            : items}
        </FloatButtonGroupContext.Provider>
      </FloatButtonAnchor>
    )
  }

  const hoverProps =
    trigger === "hover"
      ? {
          onPointerEnter: () => setOpen(true),
          onPointerLeave: () => setOpen(false),
          onFocus: () => setOpen(true),
          onBlur: (event: React.FocusEvent<HTMLDivElement>) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setOpen(false)
            }
          },
        }
      : {}

  return (
    <FloatButtonAnchor
      ref={rootRef}
      position={position}
      corner={corner}
      offset={offset}
      className={cn("relative", className)}
      style={style}
      {...hoverProps}
      {...props}
    >
      <FloatButtonGroupContext.Provider value={context}>
        <div
          id={menuId}
          data-slot="float-button-menu"
          data-state={open ? "open" : "closed"}
          inert={!open}
          className={cn(
            "absolute flex items-center gap-2",
            MENU_PLACEMENT[placement],
            !open && "pointer-events-none"
          )}
        >
          {items.map((item, index) => (
            <div
              key={item.key ?? index}
              data-slot="float-button-menu-item"
              className={cn(
                "flex transition-[opacity,transform] duration-200 ease-out",
                open
                  ? "scale-100 opacity-100"
                  : "pointer-events-none scale-50 opacity-0"
              )}
              style={{
                // Items cascade away from the trigger on open and back
                // towards it on close.
                transitionDelay: `${(open ? index : items.length - 1 - index) * 40}ms`,
              }}
            >
              {item}
            </div>
          ))}
        </div>

        <FloatButton
          type={type}
          shape={shape}
          size={size}
          description={description}
          tooltip={tooltip}
          tooltipSide={tooltipSide}
          badge={badge}
          aria-label={triggerLabel}
          aria-expanded={open}
          aria-controls={menuId}
          aria-haspopup="true"
          data-slot="float-button-trigger"
          data-state={open ? "open" : "closed"}
          onClick={trigger === "click" ? () => setOpen(!open) : undefined}
          icon={
            <span className="grid place-items-center [&>*]:col-start-1 [&>*]:row-start-1">
              <span
                className={cn(
                  "flex transition-[opacity,transform] duration-200",
                  open ? "scale-50 opacity-0" : "scale-100 opacity-100"
                )}
              >
                {icon ?? <FileText />}
              </span>
              <span
                className={cn(
                  "flex transition-[opacity,transform] duration-200",
                  open ? "scale-100 opacity-100" : "scale-50 opacity-0"
                )}
              >
                {closeIcon ?? <X />}
              </span>
            </span>
          }
        />
      </FloatButtonGroupContext.Provider>
    </FloatButtonAnchor>
  )
}

// ---------------------------------------------------------------------------
// FloatButton.BackTop
// ---------------------------------------------------------------------------

type ScrollTarget = HTMLElement | Window | Document

function isWindow(target: ScrollTarget): target is Window {
  return "scrollY" in target
}

function getScrollTop(target: ScrollTarget): number {
  if (isWindow(target)) return target.scrollY
  if (target instanceof Document) return target.documentElement.scrollTop
  return target.scrollTop
}

function setScrollTop(target: ScrollTarget, value: number) {
  if (isWindow(target)) {
    target.scrollTo(target.scrollX, value)
  } else if (target instanceof Document) {
    target.documentElement.scrollTop = value
  } else {
    target.scrollTop = value
  }
}

/** How far the target can still be scrolled, in px. */
function getScrollRange(target: ScrollTarget): number {
  if (isWindow(target)) {
    return target.document.documentElement.scrollHeight - target.innerHeight
  }
  const el = target instanceof Document ? target.documentElement : target
  return el.scrollHeight - el.clientHeight
}

/** How far through the target the user has scrolled, from 0 to 1. */
function getScrollProgress(target: ScrollTarget): number {
  const range = getScrollRange(target)
  if (range <= 0) return 0
  return Math.min(1, Math.max(0, getScrollTop(target) / range))
}

/** Thickness of the progress ring, in px. */
const RING_STROKE = 2
/** Gap between the button's edge and the ring's centreline, in px. */
const RING_GAP = 1

/**
 * Traces the button's own outline — a circle or a rounded square — filling it
 * clockwise from twelve o'clock as `progress` runs 0 → 1. There is no track
 * behind it: the untravelled part of the ring is simply not drawn.
 *
 * It is sized from the `size` variant, so it belongs on an icon-only button
 * (one carrying a `description` grows to fit its label and the ring would no
 * longer follow its edge).
 */
function FloatButtonProgressRing({
  progress,
  shape,
  size,
}: {
  progress: number
  shape: FloatButtonShape
  size: FloatButtonSize
}) {
  // The stroke is centred `RING_GAP` outside the button, so the box it is
  // drawn in overhangs the button by that plus half the stroke — which is
  // exactly the room the stroke's outer half needs, since anything outside
  // the viewport is clipped away.
  const overhang = RING_GAP + RING_STROKE / 2
  const box = BUTTON_SIZE[size] + overhang * 2
  const span = box - RING_STROKE
  const radius = cornerRadius(shape, size) + RING_GAP

  // Where the outline starts, and how long it is: an SVG circle starts at
  // three o'clock, a rect just past its top-left corner, and both run
  // clockwise — so each needs its own shift to begin at twelve.
  const [length, start] =
    shape === "circle"
      ? [2 * Math.PI * radius, 2 * Math.PI * radius * 0.75]
      : [4 * (span - 2 * radius) + 2 * Math.PI * radius, span / 2 - radius]

  const drawn = length * Math.min(1, Math.max(0, progress))
  // A zero-length dash with a round cap renders as a dot, so nothing is drawn
  // until there is an arc to draw.
  if (drawn < 0.5) return null

  const stroke = {
    fill: "none",
    strokeWidth: RING_STROKE,
    strokeLinecap: "round" as const,
    strokeDasharray: `${drawn} ${length - drawn}`,
    strokeDashoffset: -start,
  }

  return (
    <svg
      aria-hidden
      data-slot="float-button-progress"
      viewBox={`0 0 ${box} ${box}`}
      className="pointer-events-none absolute overflow-visible stroke-float-button-progress"
      // Sized inline: the button sizes every icon it contains through a
      // `[&_svg]` rule, which a width/height attribute would lose to.
      style={{ inset: -overhang, width: box, height: box }}
    >
      {shape === "circle" ? (
        <circle cx={box / 2} cy={box / 2} r={radius} {...stroke} />
      ) : (
        <rect
          x={RING_STROKE / 2}
          y={RING_STROKE / 2}
          width={span}
          height={span}
          rx={radius}
          {...stroke}
        />
      )}
    </svg>
  )
}

// Ant's scroll easing.
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

function scrollToTop(target: ScrollTarget, duration: number) {
  const start = getScrollTop(target)
  if (start === 0) return

  if (duration <= 0 || prefersReducedMotion()) {
    setScrollTop(target, 0)
    return
  }

  const startedAt = performance.now()
  const step = (now: number) => {
    const progress = Math.min(1, (now - startedAt) / duration)
    setScrollTop(target, start * (1 - easeInOutCubic(progress)))
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

interface FloatButtonBackTopProps
  extends Omit<FloatButtonProps, "href" | "target"> {
  /** Scroll distance, in px, before the button appears. */
  visibilityHeight?: number
  /** The scrolling element. Defaults to the window. */
  target?: () => ScrollTarget
  /** Length of the scroll animation, in ms. */
  duration?: number
  /** Trace the target's scroll progress around the button's outline. */
  showProgress?: boolean
}

function FloatButtonBackTop({
  visibilityHeight = 400,
  target,
  duration = 450,
  showProgress = false,
  shape,
  size,
  icon,
  onClick,
  className,
  children,
  ...props
}: FloatButtonBackTopProps) {
  const group = React.useContext(FloatButtonGroupContext)
  const [visible, setVisible] = React.useState(visibilityHeight === 0)
  const [progress, setProgress] = React.useState(0)
  // `target` is usually an inline arrow, so it is read through a ref: the
  // scroll listener is bound to whichever element it resolves to at mount.
  const targetRef = React.useRef(target)
  React.useEffect(() => {
    targetRef.current = target
  })

  React.useEffect(() => {
    const scroller: ScrollTarget = targetRef.current?.() ?? window
    const emitter: EventTarget = scroller
    const sync = () => {
      setVisible(getScrollTop(scroller) >= visibilityHeight)
      if (showProgress) setProgress(getScrollProgress(scroller))
    }

    sync()
    emitter.addEventListener("scroll", sync, { passive: true })
    window.addEventListener("resize", sync)
    return () => {
      emitter.removeEventListener("scroll", sync)
      window.removeEventListener("resize", sync)
    }
  }, [showProgress, visibilityHeight])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    scrollToTop(targetRef.current?.() ?? window, duration)
    onClick?.(event)
  }

  // In a group the button shares the stack's flow, so it has to leave it
  // entirely rather than fade in place.
  if (group && !visible) return null

  return (
    <FloatButton
      data-slot="float-button-back-top"
      data-visible={visible}
      aria-label="Back to top"
      icon={icon ?? <ArrowUp />}
      onClick={handleClick}
      className={cn(
        !group &&
          cn(
            "transition-[opacity,transform] duration-200",
            visible ? "scale-100 opacity-100" : "pointer-events-none scale-75 opacity-0"
          ),
        className
      )}
      shape={shape}
      size={size}
      {...props}
    >
      {showProgress && (
        <FloatButtonProgressRing
          progress={progress}
          shape={shape ?? group?.shape ?? floatButtonDefaults.shape}
          size={size ?? group?.size ?? floatButtonDefaults.size}
        />
      )}
      {children}
    </FloatButton>
  )
}

// Compound API so both `FloatButton.Group` and the named `FloatButtonGroup`
// work, matching Ant Design's shape.
const FloatButtonNamespace = Object.assign(FloatButton, {
  Group: FloatButtonGroup,
  BackTop: FloatButtonBackTop,
})

export {
  FloatButtonNamespace as FloatButton,
  FloatButtonGroup,
  FloatButtonBackTop,
  floatButtonVariants,
  type FloatButtonProps,
  type FloatButtonGroupProps,
  type FloatButtonBackTopProps,
  type FloatButtonType,
  type FloatButtonShape,
  type FloatButtonSize,
  type FloatButtonCorner,
  type FloatButtonOffset,
  type FloatButtonPlacement,
  type FloatButtonBadge,
  type FloatButtonPosition,
}

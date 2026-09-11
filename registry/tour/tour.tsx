"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

// A guided tour modeled on Ant Design's Tour. It masks the page, punches a
// rounded hole around a target element, and floats a step card next to it with
// a cover, title, description, dot indicators and prev/next/finish controls.
// Every colour is tokenised via --tour-* CSS variables.

type TourType = "default" | "primary"

type TourPlacement =
  | "center"
  | "top"
  | "topLeft"
  | "topRight"
  | "bottom"
  | "bottomLeft"
  | "bottomRight"
  | "left"
  | "leftTop"
  | "leftBottom"
  | "right"
  | "rightTop"
  | "rightBottom"

type TourMask = boolean | { color?: string; style?: React.CSSProperties }

type TourArrow = boolean | { pointAtCenter?: boolean }

type TourGap = { offset?: number | [number, number]; radius?: number }

type TourButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode
}

type TourStepConfig = {
  /** Element the card points at. Omit to center the card on screen. */
  target?: (() => HTMLElement | null) | HTMLElement | null
  title?: React.ReactNode
  description?: React.ReactNode
  /** Image or video rendered above the title. */
  cover?: React.ReactNode
  placement?: TourPlacement
  /** Override the tour mask for this step (e.g. `false` to reveal the page). */
  mask?: TourMask
  type?: TourType
  arrow?: TourArrow
  nextButtonProps?: TourButtonProps
  prevButtonProps?: TourButtonProps
  closeIcon?: boolean | React.ReactNode
  scrollIntoViewOptions?: boolean | ScrollIntoViewOptions
  className?: string
  style?: React.CSSProperties
}

type TourProps = {
  /** Controlled open state. */
  open?: boolean
  steps?: TourStepConfig[]
  /** Controlled active step index. */
  current?: number
  defaultCurrent?: number
  onChange?: (current: number) => void
  /** Fired when the tour closes (via the × or finishing). */
  onClose?: (current: number) => void
  /** Fired when the last step's Finish button is clicked. */
  onFinish?: () => void
  mask?: TourMask
  type?: TourType
  arrow?: TourArrow
  placement?: TourPlacement
  /** Highlight padding around the target and its corner radius. */
  gap?: TourGap
  /** Block clicks on the highlighted target. */
  disabledInteraction?: boolean
  scrollIntoViewOptions?: boolean | ScrollIntoViewOptions
  zIndex?: number
  /** Replace the dot indicators. */
  indicatorsRender?: (current: number, total: number) => React.ReactNode
  /** Replace the footer actions. */
  actionsRender?: (
    originNode: React.ReactNode,
    info: { current: number; total: number }
  ) => React.ReactNode
  closeIcon?: boolean | React.ReactNode
}

type Rect = { x: number; y: number; width: number; height: number }

const ARROW_SIZE = 8
// Distance from the highlight edge to the card (leaves room for the arrow).
const CARD_GAP = 12
// Keep the card this far inside the viewport edges.
const VIEWPORT_MARGIN = 8
const DEFAULT_GAP_OFFSET = 6
const DEFAULT_GAP_RADIUS = 4

function resolveTarget(
  target: TourStepConfig["target"]
): HTMLElement | null {
  if (!target) return null
  const el = typeof target === "function" ? target() : target
  return el ?? null
}

function normalizeMask(mask: TourMask | undefined): {
  enabled: boolean
  color?: string
  style?: React.CSSProperties
} {
  if (mask === false) return { enabled: false }
  if (mask === true || mask === undefined) return { enabled: true }
  return { enabled: true, color: mask.color, style: mask.style }
}

function normalizeArrow(arrow: TourArrow | undefined): {
  show: boolean
  pointAtCenter: boolean
} {
  if (arrow === false) return { show: false, pointAtCenter: true }
  if (arrow === true || arrow === undefined)
    return { show: true, pointAtCenter: true }
  return { show: true, pointAtCenter: arrow.pointAtCenter !== false }
}

/** A rounded-rectangle subpath used to punch the mask hole. */
function roundedRectPath(rect: Rect, radius: number) {
  const r = Math.max(
    0,
    Math.min(radius, rect.width / 2, rect.height / 2)
  )
  const { x, y, width: w, height: h } = rect
  return [
    `M${x + r},${y}`,
    `h${w - 2 * r}`,
    `a${r},${r} 0 0 1 ${r},${r}`,
    `v${h - 2 * r}`,
    `a${r},${r} 0 0 1 ${-r},${r}`,
    `h${-(w - 2 * r)}`,
    `a${r},${r} 0 0 1 ${-r},${-r}`,
    `v${-(h - 2 * r)}`,
    `a${r},${r} 0 0 1 ${r},${-r}`,
    "z",
  ].join(" ")
}

function clamp(value: number, min: number, max: number) {
  if (max < min) return min
  return Math.min(Math.max(value, min), max)
}

type Positioned = {
  top: number
  left: number
  arrow: React.CSSProperties | null
}

/** Place the card relative to the highlight rect for a given placement. */
function computePosition(
  placement: TourPlacement,
  hole: Rect | null,
  card: { width: number; height: number },
  viewport: { width: number; height: number },
  arrow: { show: boolean; pointAtCenter: boolean }
): Positioned {
  // No target (or explicit center): float in the middle of the viewport.
  if (!hole || placement === "center") {
    return {
      top: (viewport.height - card.height) / 2,
      left: (viewport.width - card.width) / 2,
      arrow: null,
    }
  }

  const side = placement.startsWith("top")
    ? "top"
    : placement.startsWith("bottom")
      ? "bottom"
      : placement.startsWith("left")
        ? "left"
        : "right"

  const targetCenterX = hole.x + hole.width / 2
  const targetCenterY = hole.y + hole.height / 2

  let top = 0
  let left = 0

  if (side === "top" || side === "bottom") {
    top =
      side === "top"
        ? hole.y - CARD_GAP - card.height
        : hole.y + hole.height + CARD_GAP
    // Cross axis alignment: center / start / end.
    if (placement.endsWith("Left")) left = hole.x
    else if (placement.endsWith("Right")) left = hole.x + hole.width - card.width
    else left = targetCenterX - card.width / 2
  } else {
    left =
      side === "left"
        ? hole.x - CARD_GAP - card.width
        : hole.x + hole.width + CARD_GAP
    if (placement.endsWith("Top")) top = hole.y
    else if (placement.endsWith("Bottom"))
      top = hole.y + hole.height - card.height
    else top = targetCenterY - card.height / 2
  }

  const maxLeft = viewport.width - card.width - VIEWPORT_MARGIN
  const maxTop = viewport.height - card.height - VIEWPORT_MARGIN
  left = clamp(left, VIEWPORT_MARGIN, maxLeft)
  top = clamp(top, VIEWPORT_MARGIN, maxTop)

  let arrowStyle: React.CSSProperties | null = null
  if (arrow.show) {
    const half = ARROW_SIZE / 2
    if (side === "top" || side === "bottom") {
      const aim = arrow.pointAtCenter
        ? targetCenterX
        : placement.endsWith("Left")
          ? hole.x + Math.min(hole.width / 2, 24)
          : placement.endsWith("Right")
            ? hole.x + hole.width - Math.min(hole.width / 2, 24)
            : targetCenterX
      const arrowLeft = clamp(
        aim - left,
        ARROW_SIZE,
        card.width - ARROW_SIZE * 2
      )
      arrowStyle = {
        left: arrowLeft,
        [side === "top" ? "bottom" : "top"]: -half,
      }
    } else {
      const aim = arrow.pointAtCenter
        ? targetCenterY
        : placement.endsWith("Top")
          ? hole.y + Math.min(hole.height / 2, 24)
          : placement.endsWith("Bottom")
            ? hole.y + hole.height - Math.min(hole.height / 2, 24)
            : targetCenterY
      const arrowTop = clamp(
        aim - top,
        ARROW_SIZE,
        card.height - ARROW_SIZE * 2
      )
      arrowStyle = {
        top: arrowTop,
        [side === "left" ? "right" : "left"]: -half,
      }
    }
  }

  return { top, left, arrow: arrowStyle }
}

function TourButton({
  variant,
  tourType,
  className,
  ...props
}: TourButtonProps & { variant: "prev" | "next"; tourType: TourType }) {
  const base =
    "inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium transition-[background-color,opacity] outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"

  const styles =
    tourType === "primary"
      ? variant === "next"
        ? "bg-tour-primary-foreground text-tour-primary hover:opacity-90"
        : "text-tour-primary-foreground hover:bg-tour-primary-foreground/15"
      : variant === "next"
        ? "bg-tour-primary text-tour-primary-foreground hover:opacity-90"
        : "text-tour-card-foreground hover:bg-muted"

  return <button type="button" className={cn(base, styles, className)} {...props} />
}

function Tour({
  open,
  steps = [],
  current: currentProp,
  defaultCurrent = 0,
  onChange,
  onClose,
  onFinish,
  mask = true,
  type = "default",
  arrow = true,
  placement = "bottom",
  gap,
  disabledInteraction = false,
  scrollIntoViewOptions = true,
  zIndex = 1001,
  indicatorsRender,
  actionsRender,
  closeIcon = true,
}: TourProps) {
  const [mounted, setMounted] = React.useState(false)
  const [uncontrolledCurrent, setUncontrolledCurrent] =
    React.useState(defaultCurrent)
  const currentControlled = currentProp !== undefined
  const currentIndex = currentControlled ? currentProp! : uncontrolledCurrent

  const [targetRect, setTargetRect] = React.useState<Rect | null>(null)
  const [cardSize, setCardSize] = React.useState<{
    width: number
    height: number
  } | null>(null)
  const [viewport, setViewport] = React.useState({ width: 0, height: 0 })

  const cardRef = React.useRef<HTMLDivElement | null>(null)

  // Portal targets document.body, which only exists after mount — render
  // nothing on the server / first paint to avoid a hydration mismatch.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setMounted(true), [])

  const total = steps.length
  const step = steps[currentIndex] as TourStepConfig | undefined

  const isOpen = !!open && mounted && total > 0 && !!step

  // Resolve per-step / tour-level config.
  const stepType = step?.type ?? type
  const stepPlacement = step?.placement ?? placement
  const stepArrow = normalizeArrow(step?.arrow ?? arrow)
  const stepMask = normalizeMask(step?.mask ?? mask)
  const stepClose = step?.closeIcon ?? closeIcon
  const stepScroll = step?.scrollIntoViewOptions ?? scrollIntoViewOptions

  const offset = gap?.offset ?? DEFAULT_GAP_OFFSET
  const [offsetX, offsetY] = Array.isArray(offset)
    ? offset
    : [offset, offset]
  const holeRadius = gap?.radius ?? DEFAULT_GAP_RADIUS

  // Measure the target rect (and follow scroll / resize / layout changes).
  React.useEffect(() => {
    if (!isOpen) return

    const measure = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight })
      const el = resolveTarget(step?.target)
      if (!el) {
        setTargetRect(null)
        return
      }
      const r = el.getBoundingClientRect()
      setTargetRect({ x: r.left, y: r.top, width: r.width, height: r.height })
    }

    const el = resolveTarget(step?.target)
    if (el && stepScroll !== false) {
      el.scrollIntoView(
        typeof stepScroll === "object"
          ? stepScroll
          : { block: "center", inline: "center", behavior: "smooth" }
      )
    }

    measure()

    const ro =
      el && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measure)
        : null
    if (el && ro) ro.observe(el)

    window.addEventListener("scroll", measure, true)
    window.addEventListener("resize", measure)
    // A short rAF pass to track smooth-scroll settling.
    let raf = 0
    let frames = 0
    const tick = () => {
      measure()
      if (frames++ < 40) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener("scroll", measure, true)
      window.removeEventListener("resize", measure)
      cancelAnimationFrame(raf)
      ro?.disconnect()
    }
  }, [isOpen, currentIndex, step?.target, stepScroll])

  // Measure the card so it can be positioned.
  React.useLayoutEffect(() => {
    if (!isOpen || !cardRef.current) return
    const node = cardRef.current
    const measureCard = () =>
      setCardSize({ width: node.offsetWidth, height: node.offsetHeight })
    measureCard()
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measureCard)
        : null
    ro?.observe(node)
    return () => ro?.disconnect()
  }, [isOpen, currentIndex])

  if (!isOpen || !step) return null

  // The highlight rect: the target expanded by the gap offset.
  const hole: Rect | null = targetRect
    ? {
        x: targetRect.x - offsetX,
        y: targetRect.y - offsetY,
        width: targetRect.width + offsetX * 2,
        height: targetRect.height + offsetY * 2,
      }
    : null

  const position = cardSize
    ? computePosition(
        stepPlacement,
        hole,
        cardSize,
        viewport.width
          ? viewport
          : { width: window.innerWidth, height: window.innerHeight },
        stepArrow
      )
    : null

  const goTo = (next: number) => {
    if (!currentControlled) setUncontrolledCurrent(next)
    onChange?.(next)
  }

  const handleClose = () => {
    onClose?.(currentIndex)
    // Reset the internal step so reopening the tour starts from the first step.
    if (!currentControlled) setUncontrolledCurrent(defaultCurrent)
  }

  const handleNext = () => {
    if (currentIndex >= total - 1) {
      onFinish?.()
      handleClose()
    } else {
      goTo(currentIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) goTo(currentIndex - 1)
  }

  const isLast = currentIndex >= total - 1
  const showClose = stepClose !== false

  // Footer indicators (dots) — overridable via indicatorsRender.
  const indicators = indicatorsRender ? (
    indicatorsRender(currentIndex, total)
  ) : (
    <div data-slot="tour-indicators" className="flex items-center gap-1.5">
      {steps.map((_, i) => (
        <span
          key={i}
          data-active={i === currentIndex}
          className={cn(
            "size-1.5 rounded-full transition-colors",
            stepType === "primary"
              ? i === currentIndex
                ? "bg-tour-primary-foreground"
                : "bg-tour-primary-foreground/40"
              : i === currentIndex
                ? "bg-tour-indicator-active"
                : "bg-tour-indicator"
          )}
        />
      ))}
    </div>
  )

  const { children: nextChildren, ...nextRest } = step.nextButtonProps ?? {}
  const { children: prevChildren, ...prevRest } = step.prevButtonProps ?? {}

  const buttons = (
    <div data-slot="tour-buttons" className="flex items-center gap-2">
      {currentIndex > 0 && (
        <TourButton
          variant="prev"
          tourType={stepType}
          {...prevRest}
          onClick={(e) => {
            prevRest.onClick?.(e)
            if (!e.defaultPrevented) handlePrev()
          }}
        >
          {prevChildren ?? "Previous"}
        </TourButton>
      )}
      <TourButton
        variant="next"
        tourType={stepType}
        {...nextRest}
        onClick={(e) => {
          nextRest.onClick?.(e)
          if (!e.defaultPrevented) handleNext()
        }}
      >
        {nextChildren ?? (isLast ? "Finish" : "Next")}
      </TourButton>
    </div>
  )

  const originActions = (
    <div
      data-slot="tour-footer"
      className="flex items-center justify-between gap-4"
    >
      {total > 1 ? indicators : <span />}
      {buttons}
    </div>
  )

  const maskColor = stepMask.color ?? "var(--tour-mask)"

  return createPortal(
    <div data-slot="tour" data-type={stepType}>
      {/* Mask: an SVG that fills the viewport minus a rounded hole. Its painted
          area captures clicks (blocking the page); the hole lets them through
          to the target unless disabledInteraction is set. */}
      {stepMask.enabled && (
        <svg
          data-slot="tour-mask"
          width="100%"
          height="100%"
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            zIndex,
            pointerEvents: "auto",
            ...stepMask.style,
          }}
        >
          <path
            fillRule="evenodd"
            fill={maskColor}
            d={
              `M0 0 H${viewport.width || 9999} V${viewport.height || 9999} H0 Z` +
              (hole ? " " + roundedRectPath(hole, holeRadius) : "")
            }
          />
        </svg>
      )}

      {/* Optional blocker over the hole to disable target interaction. */}
      {disabledInteraction && hole && (
        <div
          data-slot="tour-interaction-blocker"
          aria-hidden
          style={{
            position: "fixed",
            top: hole.y,
            left: hole.x,
            width: hole.width,
            height: hole.height,
            zIndex,
          }}
        />
      )}

      {/* The step card. */}
      <div
        ref={cardRef}
        data-slot="tour-card"
        data-type={stepType}
        role="dialog"
        aria-modal={stepMask.enabled ? true : undefined}
        className={cn(
          "fixed w-72 max-w-[calc(100vw-16px)] rounded-lg p-4 shadow-lg outline-none transition-opacity",
          stepType === "primary"
            ? "bg-tour-primary text-tour-primary-foreground"
            : "bg-tour-card text-tour-card-foreground",
          step.className
        )}
        style={{
          top: position?.top ?? 0,
          left: position?.left ?? 0,
          zIndex: zIndex + 1,
          opacity: position ? 1 : 0,
          ...step.style,
        }}
      >
        {/* Arrow */}
        {position?.arrow && (
          <span
            data-slot="tour-arrow"
            aria-hidden
            className={cn(
              "absolute size-2 rotate-45 rounded-[1px]",
              stepType === "primary" ? "bg-tour-primary" : "bg-tour-card"
            )}
            style={position.arrow}
          />
        )}

        {/* Close */}
        {showClose && (
          <button
            type="button"
            data-slot="tour-close"
            aria-label="Close"
            onClick={handleClose}
            className={cn(
              "absolute top-3 right-3 inline-flex size-6 items-center justify-center rounded-md opacity-70 transition-opacity outline-none hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/50 [&_svg]:size-4",
              stepType === "primary"
                ? "text-tour-primary-foreground"
                : "text-tour-close"
            )}
          >
            {stepClose === true ? <X aria-hidden /> : stepClose}
          </button>
        )}

        {step.cover && (
          <div
            data-slot="tour-cover"
            className="mb-3 overflow-hidden rounded-md [&_img]:w-full [&_video]:w-full"
          >
            {step.cover}
          </div>
        )}

        {step.title && (
          <div
            data-slot="tour-title"
            className="pr-6 text-base font-semibold"
          >
            {step.title}
          </div>
        )}

        {step.description && (
          <div
            data-slot="tour-description"
            className={cn(
              "mt-1 text-sm",
              stepType === "primary"
                ? "text-tour-primary-foreground/85"
                : "text-tour-description"
            )}
          >
            {step.description}
          </div>
        )}

        <div className="mt-4">
          {actionsRender
            ? actionsRender(originActions, {
                current: currentIndex,
                total,
              })
            : originActions}
        </div>
      </div>
    </div>,
    document.body
  )
}

export { Tour }
export type {
  TourProps,
  TourStepConfig,
  TourPlacement,
  TourType,
  TourMask,
  TourArrow,
  TourGap,
}

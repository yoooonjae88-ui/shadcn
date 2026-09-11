"use client"

import * as React from "react"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

// A resizable split-pane layout modeled on Ant Design's Splitter: sibling
// panels separated by draggable bars, in horizontal or vertical layout.
// Panels take defaultSize/size (px number, "120px" or "30%"), min/max
// clamps, a resizable flag and a collapsible flag (arrow buttons on the bar
// collapse the panel to zero and restore it). The container supports a lazy
// mode that previews the drag and only commits sizes on release, plus
// onResizeStart/onResize/onResizeEnd callbacks reporting pixel sizes.
// Sizes are stored as ratios internally, so panels scale proportionally
// when the container resizes.

const BAR_SIZE = 2 // px the split bar occupies in the flex layout
const COLLAPSED_EPSILON = 1 // px under which a panel counts as collapsed
const KEYBOARD_STEP = 10 // px moved per arrow-key press on a focused bar

/** A pixel number, a `"120px"` string, or a `"30%"` string. */
type PanelSizeValue = number | string

interface SplitterPanelProps extends React.ComponentProps<"div"> {
  /** Initial size. Pixels (`240`, `"240px"`) or a percentage (`"30%"`). */
  defaultSize?: PanelSizeValue
  /** Controlled size — update it from `onResize` to stay in sync. */
  size?: PanelSizeValue
  /** Smallest size the panel can be dragged to. */
  min?: PanelSizeValue
  /** Largest size the panel can be dragged to. */
  max?: PanelSizeValue
  /** Whether the panel's bars can be dragged. Defaults to `true`. */
  resizable?: boolean
  /**
   * Quick-fold arrows on the panel's bars: `true` allows collapsing in both
   * directions, `{ start: true }` only toward the start (left/top),
   * `{ end: true }` only toward the end. A collapsed panel shows a restore
   * arrow in the opposite direction.
   */
  collapsible?: boolean | { start?: boolean; end?: boolean }
}

const PANEL_ONLY_PROPS = [
  "defaultSize",
  "size",
  "min",
  "max",
  "resizable",
  "collapsible",
] as const

// Strips the sizing props so only real DOM props are spread onto the div.
function panelDomProps(props: SplitterPanelProps) {
  const rest: SplitterPanelProps = { ...props }
  for (const key of PANEL_ONLY_PROPS) delete rest[key]
  return rest as React.ComponentProps<"div">
}

/**
 * Declares one pane of a Splitter. The parent Splitter reads the sizing
 * props off this element and renders the sized flex item itself; rendered
 * standalone it is just a scrollable div.
 */
function SplitterPanel(props: SplitterPanelProps) {
  const { className, ...rest } = panelDomProps(props)
  return (
    <div
      data-slot="splitter-panel"
      className={cn("min-h-0 min-w-0 overflow-auto", className)}
      {...rest}
    />
  )
}

function resolvePx(
  value: PanelSizeValue | undefined,
  available: number
): number | undefined {
  if (value === undefined) return undefined
  if (typeof value === "number") return value
  const trimmed = value.trim()
  const numeric = Number.parseFloat(trimmed)
  if (Number.isNaN(numeric)) return undefined
  return trimmed.endsWith("%") ? (numeric / 100) * available : numeric
}

function normalizeCollapsible(
  collapsible: SplitterPanelProps["collapsible"]
): { start: boolean; end: boolean } {
  if (typeof collapsible === "object" && collapsible !== null) {
    return { start: !!collapsible.start, end: !!collapsible.end }
  }
  return { start: !!collapsible, end: !!collapsible }
}

// Initial pixel sizes: explicitly sized panels get their size, the rest
// share the leftover space equally. If the panels over-commit the container
// (or all are sized and don't add up) they are scaled proportionally so the
// container is always exactly filled.
function computeInitialRatios(
  panels: SplitterPanelProps[],
  available: number
): number[] {
  const preferred = panels.map((panel) =>
    resolvePx(panel.size ?? panel.defaultSize, available)
  )
  const fixedTotal = preferred.reduce<number>((sum, v) => sum + (v ?? 0), 0)
  const autoCount = preferred.filter((v) => v === undefined).length
  const autoSize =
    autoCount > 0 ? Math.max(0, available - fixedTotal) / autoCount : 0
  let px = preferred.map((v) => v ?? autoSize)
  const total = px.reduce((sum, v) => sum + v, 0)
  if (total <= 0) return panels.map(() => 1 / panels.length)
  if (total > available || autoCount === 0) {
    px = px.map((v) => (v / total) * available)
  }
  return px.map((v) => v / available)
}

interface SplitterProps
  extends Omit<React.ComponentProps<"div">, "onResize"> {
  /** Direction the panels are laid out in. */
  layout?: "horizontal" | "vertical"
  /** Preview the drag as a ghost bar and only apply sizes on release. */
  lazy?: boolean
  /** Fired once when a bar drag begins, with the current pixel sizes. */
  onResizeStart?: (sizes: number[]) => void
  /** Fired as sizes change (drag, collapse, keyboard), with pixel sizes. */
  onResize?: (sizes: number[]) => void
  /** Fired when a resize gesture finishes, with the final pixel sizes. */
  onResizeEnd?: (sizes: number[]) => void
}

function Splitter({
  className,
  layout = "horizontal",
  lazy = false,
  onResizeStart,
  onResize,
  onResizeEnd,
  children,
  ...props
}: SplitterProps) {
  const horizontal = layout === "horizontal"
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = React.useState(0)
  const [ratios, setRatios] = React.useState<number[] | null>(null)
  const [dragging, setDragging] = React.useState<number | null>(null)
  const [previewDelta, setPreviewDelta] = React.useState<number | null>(null)
  const dragRef = React.useRef<{
    index: number
    origin: number
    startPrev: number
    startNext: number
    minDelta: number
    maxDelta: number
  } | null>(null)
  // Panel index -> ratio it had just before being collapsed, for restore.
  const collapseCache = React.useRef(new Map<number, number>())

  const panelElements = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<SplitterPanelProps> =>
      React.isValidElement(child) && child.type === SplitterPanel
  )
  const panels = panelElements.map((element) => element.props)
  const panelCount = panels.length
  const barCount = Math.max(0, panelCount - 1)
  const available = Math.max(0, containerSize - barCount * BAR_SIZE)

  // Kept in a ref (declared before the init effect below, so it is synced
  // first) to avoid re-running the init effect on every render.
  const panelsRef = React.useRef<SplitterPanelProps[]>([])
  React.useLayoutEffect(() => {
    panelsRef.current = panels
  })

  React.useLayoutEffect(() => {
    const node = containerRef.current
    if (!node) return
    const measure = () =>
      setContainerSize(horizontal ? node.offsetWidth : node.offsetHeight)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [horizontal])

  React.useLayoutEffect(() => {
    if (available <= 0 || panelCount === 0) return
    setRatios((current) =>
      current && current.length === panelCount
        ? current
        : computeInitialRatios(panelsRef.current, available)
    )
  }, [available, panelCount])

  // Controlled `size` props override the internal ratio on every render.
  const effectiveRatios =
    ratios && available > 0
      ? panels.map((panel, index) => {
          if (panel.size === undefined) return ratios[index] ?? 0
          const px = resolvePx(panel.size, available) ?? 0
          return Math.min(Math.max(px / available, 0), 1)
        })
      : null
  const pxSizes = effectiveRatios?.map((ratio) => ratio * available) ?? null

  const isBarResizable = (index: number) =>
    pxSizes !== null &&
    panels[index]?.resizable !== false &&
    panels[index + 1]?.resizable !== false

  // How far the bar between `index` and `index + 1` may move, honouring both
  // panels' min/max. Zero is always allowed so a panel collapsed below its
  // min never snaps open on an opposite-direction drag.
  const deltaRange = (index: number, sizes: number[]) => {
    const startPrev = sizes[index]
    const startNext = sizes[index + 1]
    const pairTotal = startPrev + startNext
    const prevMin = resolvePx(panels[index].min, available) ?? 0
    const nextMin = resolvePx(panels[index + 1].min, available) ?? 0
    const prevMax = Math.min(
      resolvePx(panels[index].max, available) ?? pairTotal,
      pairTotal
    )
    const nextMax = Math.min(
      resolvePx(panels[index + 1].max, available) ?? pairTotal,
      pairTotal
    )
    const minDelta = Math.min(
      Math.max(prevMin - startPrev, startNext - nextMax),
      0
    )
    const maxDelta = Math.max(
      Math.min(prevMax - startPrev, startNext - nextMin),
      0
    )
    return { startPrev, startNext, minDelta, maxDelta }
  }

  // Writes a new size for the pair around a bar and returns all pixel sizes.
  const commitPair = (index: number, newPrev: number, newNext: number) => {
    const base = effectiveRatios ?? []
    const nextRatios = [...base]
    nextRatios[index] = available > 0 ? newPrev / available : 0
    nextRatios[index + 1] = available > 0 ? newNext / available : 0
    setRatios(nextRatios)
    return nextRatios.map((ratio) => ratio * available)
  }

  const handlePointerDown = (index: number) => (e: React.PointerEvent) => {
    if (!pxSizes || !isBarResizable(index)) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    const { startPrev, startNext, minDelta, maxDelta } = deltaRange(
      index,
      pxSizes
    )
    dragRef.current = {
      index,
      origin: horizontal ? e.clientX : e.clientY,
      startPrev,
      startNext,
      minDelta,
      maxDelta,
    }
    setDragging(index)
    onResizeStart?.(pxSizes)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current
    if (!drag) return
    const raw = (horizontal ? e.clientX : e.clientY) - drag.origin
    const delta = Math.min(Math.max(raw, drag.minDelta), drag.maxDelta)
    if (lazy) {
      setPreviewDelta(delta)
      return
    }
    const sizes = commitPair(
      drag.index,
      drag.startPrev + delta,
      drag.startNext - delta
    )
    onResize?.(sizes)
  }

  const handlePointerEnd = () => {
    const drag = dragRef.current
    if (!drag) return
    let sizes = pxSizes ?? []
    if (lazy && previewDelta !== null) {
      sizes = commitPair(
        drag.index,
        drag.startPrev + previewDelta,
        drag.startNext - previewDelta
      )
      onResize?.(sizes)
    }
    dragRef.current = null
    setDragging(null)
    setPreviewDelta(null)
    onResizeEnd?.(sizes)
  }

  const handleKeyDown = (index: number) => (e: React.KeyboardEvent) => {
    if (!pxSizes || !isBarResizable(index)) return
    const towardEnd = horizontal ? "ArrowRight" : "ArrowDown"
    const towardStart = horizontal ? "ArrowLeft" : "ArrowUp"
    if (e.key !== towardEnd && e.key !== towardStart) return
    e.preventDefault()
    const step = e.key === towardEnd ? KEYBOARD_STEP : -KEYBOARD_STEP
    const { startPrev, startNext, minDelta, maxDelta } = deltaRange(
      index,
      pxSizes
    )
    const delta = Math.min(Math.max(step, minDelta), maxDelta)
    if (delta === 0) return
    const sizes = commitPair(index, startPrev + delta, startNext - delta)
    onResize?.(sizes)
    onResizeEnd?.(sizes)
  }

  // `arrow` is the direction the divider moves: "start" collapses the
  // previous panel (or restores a collapsed next panel), "end" mirrors it.
  const handleCollapse = (index: number, arrow: "start" | "end") => {
    if (!pxSizes || available <= 0) return
    const p = pxSizes[index]
    const n = pxSizes[index + 1]
    const pairTotal = p + n
    let newPrev = p
    let newNext = n
    const restoreSize = (panelIndex: number) => {
      const cached = (collapseCache.current.get(panelIndex) ?? 0) * available
      return cached > COLLAPSED_EPSILON
        ? Math.min(cached, pairTotal)
        : pairTotal / 2
    }
    if (arrow === "start") {
      if (n <= COLLAPSED_EPSILON) {
        newNext = restoreSize(index + 1)
        newPrev = pairTotal - newNext
      } else {
        collapseCache.current.set(index, p / available)
        newPrev = 0
        newNext = pairTotal
      }
    } else {
      if (p <= COLLAPSED_EPSILON) {
        newPrev = restoreSize(index)
        newNext = pairTotal - newPrev
      } else {
        collapseCache.current.set(index + 1, n / available)
        newPrev = pairTotal
        newNext = 0
      }
    }
    const sizes = commitPair(index, newPrev, newNext)
    onResize?.(sizes)
    onResizeEnd?.(sizes)
  }

  // Before the container is measured, fall back to CSS flex sizing so SSR
  // and the first paint already approximate the final layout.
  const fallbackStyle = (panel: SplitterPanelProps): React.CSSProperties => {
    const preferred = panel.size ?? panel.defaultSize
    if (preferred === undefined) return { flex: "1 1 0%" }
    const basis =
      typeof preferred === "number" ? `${preferred}px` : preferred
    return { flex: `0 0 ${basis}` }
  }

  const StartChevron = horizontal ? ChevronLeft : ChevronUp
  const EndChevron = horizontal ? ChevronRight : ChevronDown

  const collapseButtonClass = cn(
    "absolute z-20 flex items-center justify-center rounded-sm",
    "bg-splitter-collapse-trigger text-splitter-collapse-trigger-foreground",
    "hover:bg-splitter-collapse-trigger-hover hover:text-splitter-collapse-trigger-hover-foreground",
    "transition-colors",
    horizontal ? "h-6 w-3.5" : "h-3.5 w-6"
  )

  return (
    <div
      ref={containerRef}
      data-slot="splitter"
      className={cn(
        "flex h-full w-full",
        horizontal ? "flex-row" : "flex-col",
        dragging !== null && "select-none",
        className
      )}
      {...props}
    >
      {panels.map((panel, index) => {
        const {
          className: panelClassName,
          style: panelStyle,
          children: panelChildren,
          ...panelRest
        } = panelDomProps(panel)
        const px = pxSizes?.[index]
        const sizeStyle: React.CSSProperties =
          px !== undefined
            ? { flex: "0 0 auto", [horizontal ? "width" : "height"]: px }
            : fallbackStyle(panel)

        const prevCollapsible = normalizeCollapsible(panel.collapsible)
        const nextPanel = panels[index + 1]
        const nextCollapsible = normalizeCollapsible(nextPanel?.collapsible)
        const p = pxSizes?.[index] ?? 0
        const n = pxSizes?.[index + 1] ?? 0
        const showStartArrow =
          pxSizes !== null &&
          ((prevCollapsible.start && p > COLLAPSED_EPSILON) ||
            (nextCollapsible.end && n <= COLLAPSED_EPSILON))
        const showEndArrow =
          pxSizes !== null &&
          ((nextCollapsible.end && n > COLLAPSED_EPSILON) ||
            (prevCollapsible.start && p <= COLLAPSED_EPSILON))
        const barResizable = isBarResizable(index)
        const pairTotal = p + n

        return (
          <React.Fragment key={panelElements[index].key ?? index}>
            <div
              data-slot="splitter-panel"
              className={cn("min-h-0 min-w-0 overflow-auto", panelClassName)}
              style={{ ...panelStyle, ...sizeStyle }}
              {...panelRest}
            >
              {panelChildren}
            </div>
            {index < panelCount - 1 && (
              <div
                data-slot="splitter-bar"
                role="separator"
                aria-orientation={horizontal ? "vertical" : "horizontal"}
                aria-valuenow={
                  pairTotal > 0 ? Math.round((p / pairTotal) * 100) : 0
                }
                aria-valuemin={0}
                aria-valuemax={100}
                tabIndex={barResizable ? 0 : undefined}
                onKeyDown={handleKeyDown(index)}
                className={cn(
                  "group relative flex-none outline-none",
                  "focus-visible:ring-2 focus-visible:ring-ring/50"
                )}
                style={
                  horizontal ? { width: BAR_SIZE } : { height: BAR_SIZE }
                }
              >
                <div
                  className={cn(
                    "absolute inset-0 transition-colors",
                    dragging === index
                      ? "bg-splitter-bar-active"
                      : "bg-splitter-bar",
                    barResizable &&
                      dragging !== index &&
                      "group-hover:bg-splitter-bar-hover"
                  )}
                />
                <div
                  className={cn(
                    "absolute z-10",
                    horizontal
                      ? "inset-y-0 -inset-x-[3px]"
                      : "inset-x-0 -inset-y-[3px]",
                    barResizable &&
                      (horizontal ? "cursor-col-resize" : "cursor-row-resize")
                  )}
                  style={{ touchAction: "none" }}
                  onPointerDown={handlePointerDown(index)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerEnd}
                  onPointerCancel={handlePointerEnd}
                />
                {lazy && dragging === index && previewDelta !== null && (
                  <div
                    className="pointer-events-none absolute inset-0 z-20 bg-splitter-bar-preview"
                    style={{
                      transform: horizontal
                        ? `translateX(${previewDelta}px)`
                        : `translateY(${previewDelta}px)`,
                    }}
                  />
                )}
                {showStartArrow && (
                  <button
                    type="button"
                    aria-label="Collapse toward start"
                    className={cn(
                      collapseButtonClass,
                      horizontal
                        ? "top-1/2 right-full mr-0.5 -translate-y-1/2"
                        : "bottom-full left-1/2 mb-0.5 -translate-x-1/2"
                    )}
                    onClick={() => handleCollapse(index, "start")}
                  >
                    <StartChevron className="size-3" />
                  </button>
                )}
                {showEndArrow && (
                  <button
                    type="button"
                    aria-label="Collapse toward end"
                    className={cn(
                      collapseButtonClass,
                      horizontal
                        ? "top-1/2 left-full ml-0.5 -translate-y-1/2"
                        : "top-full left-1/2 mt-0.5 -translate-x-1/2"
                    )}
                    onClick={() => handleCollapse(index, "end")}
                  >
                    <EndChevron className="size-3" />
                  </button>
                )}
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

Splitter.Panel = SplitterPanel

export { Splitter, SplitterPanel }
export type { SplitterProps, SplitterPanelProps, PanelSizeValue }

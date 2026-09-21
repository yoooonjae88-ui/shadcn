"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------------------------------
 * Responsive helpers
 *
 * Masonry positions its items in JavaScript, so the current breakpoint has to
 * be readable as a value rather than expressed as Tailwind variants.
 * ------------------------------------------------------------------------------------------------*/

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const

type Breakpoint = keyof typeof BREAKPOINTS

const BREAKPOINT_ORDER = ["sm", "md", "lg", "xl", "2xl"] as const

function subscribeToBreakpoints(onChange: () => void) {
  const queries = BREAKPOINT_ORDER.map((breakpoint) =>
    window.matchMedia(`(min-width: ${BREAKPOINTS[breakpoint]}px)`)
  )
  for (const query of queries) query.addEventListener("change", onChange)
  return () => {
    for (const query of queries) query.removeEventListener("change", onChange)
  }
}

function getBreakpointSnapshot() {
  return BREAKPOINT_ORDER.filter(
    (breakpoint) =>
      window.matchMedia(`(min-width: ${BREAKPOINTS[breakpoint]}px)`).matches
  ).join(" ")
}

// On the server no breakpoint matches, so SSR renders the mobile-first base
// values; useSyncExternalStore re-renders with the real screens after mount.
function getServerBreakpointSnapshot() {
  return ""
}

/** Which Tailwind breakpoints are currently active. */
function useBreakpoint(): Record<Breakpoint, boolean> {
  const snapshot = React.useSyncExternalStore(
    subscribeToBreakpoints,
    getBreakpointSnapshot,
    getServerBreakpointSnapshot
  )
  return React.useMemo(() => {
    const active = new Set(snapshot.split(" "))
    return Object.fromEntries(
      BREAKPOINT_ORDER.map((breakpoint) => [breakpoint, active.has(breakpoint)])
    ) as Record<Breakpoint, boolean>
  }, [snapshot])
}

type ResponsiveNumber = number | Partial<Record<"base" | Breakpoint, number>>

/** Pick the value for the largest active breakpoint, falling back to `base`. */
function resolveResponsiveNumber(
  value: ResponsiveNumber,
  screens: Record<Breakpoint, boolean>
): number {
  if (typeof value === "number") return value
  let resolved = value.base ?? 0
  for (const breakpoint of BREAKPOINT_ORDER) {
    const candidate = value[breakpoint]
    if (screens[breakpoint] && candidate !== undefined) resolved = candidate
  }
  return resolved
}

type Gutter = ResponsiveNumber

// A masonry grid modeled on Ant Design's Masonry. Items keep their DOM order
// but are absolutely positioned into columns: each item goes to the currently
// shortest column (or round-robin when `sequential`), so content of varying
// heights packs tightly without vertical gaps. Column widths and horizontal
// offsets are pure CSS calc() of the container width, so only item heights
// need measuring — a ResizeObserver tracks them, and the layout follows window
// resizes, responsive column counts and content changes automatically.
//
// Items can be closable (a × removes them, with the rest animating into the
// gap) and draggable in the style of iOS's home screen / draggable masonry
// grids: press and hold an item to lift it, it follows the pointer freely
// while the other items glide out of the way live, and on release it settles
// into its slot. An optional `wobble` makes the resting items jiggle while a
// drag is in progress. Pointer events cover mouse and touch alike.

type MasonryKey = string | number

interface MasonryItemType<T = unknown> {
  key: MasonryKey
  /** Arbitrary data forwarded to `itemRender`. */
  data?: T
  /** Pin the item to a specific column (0-based) instead of auto-placing it. */
  column?: number
  /** Per-item override of the masonry-level `closable` flag. */
  closable?: boolean
  /** Rendered content when no `itemRender` is provided. */
  children?: React.ReactNode
}

interface MasonryItemPosition {
  key: MasonryKey
  /** Column index (0-based) the item was placed in. */
  column: number
  /** Pixel offset from the top of the masonry container. */
  top: number
  /** Measured pixel height of the item. */
  height: number
}

interface MasonryProps<T = unknown>
  extends Omit<
    React.ComponentProps<"div">,
    "children" | "onLayoutChange" | "draggable"
  > {
  /**
   * Number of columns: a number or a responsive object
   * (`{ base: 2, md: 3, xl: 4 }`).
   */
  columns?: ResponsiveNumber
  /**
   * Spacing between items in px: a number, a responsive object
   * (`{ base: 8, md: 16 }`), or `[horizontal, vertical]` for each axis.
   */
  gutter?: Gutter | [Gutter, Gutter]
  /**
   * Place items strictly in order across columns (round-robin) instead of
   * into the currently shortest column.
   */
  sequential?: boolean
  /**
   * Show a × button on each item (on hover/focus, and on every item while a
   * drag is in progress) that removes it from the layout with the remaining
   * items animating into the gap. Overridable per item via
   * `MasonryItemType.closable`.
   */
  closable?: boolean
  /** Called with the item's key after its × button removes it. */
  onClose?: (key: MasonryKey) => void
  /**
   * Press-and-hold an item to lift and drag it; it follows the pointer while
   * the other items glide into their new slots live, and settles on release.
   */
  draggable?: boolean
  /**
   * How long (ms) an item must be held before a drag starts. A mouse also
   * starts the drag immediately on movement; the hold matters on touch,
   * where it keeps quick swipes scrolling instead of dragging.
   */
  longPressDelay?: number
  /** Make the resting items jiggle while a drag is in progress. */
  wobble?: boolean
  /** Called with the keys in their new order after a drag completes. */
  onReorder?: (keys: MasonryKey[]) => void
  /** Data-driven API: items to lay out, rendered via `itemRender`. */
  items?: MasonryItemType<T>[]
  /** Renders an item from `items`; falls back to the item's `children`. */
  itemRender?: (item: MasonryItemType<T>, index: number) => React.ReactNode
  /** Element-driven API: children are laid out in order. */
  children?: React.ReactNode
  /** Called whenever the computed layout changes. */
  onLayoutChange?: (positions: MasonryItemPosition[]) => void
}

// How far (px) the pointer may wander during the hold before the press is
// treated as a scroll/selection instead of a drag.
const DRAG_TOLERANCE = 8

interface DragGesture {
  key: string
  pointerId: number
  element: HTMLDivElement
  startX: number
  startY: number
  timer: number | null
  // Pointer offset inside the item when it was lifted, so it doesn't jump.
  grabDX: number
  grabDY: number
  active: boolean
}

function preventTouchScroll(event: TouchEvent) {
  event.preventDefault()
}

function Masonry<T = unknown>({
  className,
  style,
  columns = 3,
  gutter = 0,
  sequential = false,
  closable = false,
  onClose,
  draggable = false,
  longPressDelay = 200,
  wobble = false,
  onReorder,
  items,
  itemRender,
  children,
  onLayoutChange,
  ...props
}: MasonryProps<T>) {
  const screens = useBreakpoint()

  // Items removed via their × button; keys removed by the consumer instead
  // simply stop appearing in `items`/`children`.
  const [closedKeys, setClosedKeys] = React.useState<ReadonlySet<string>>(
    () => new Set()
  )
  // Key order established by drag-and-drop; keys not seen here (new items,
  // or before any drag) keep their source order.
  const [orderKeys, setOrderKeys] = React.useState<readonly string[]>([])
  // The lifted item, its current free position, and the post-drop/close
  // window during which position changes stay animated.
  const [dragKey, setDragKey] = React.useState<string | null>(null)
  const [dragPos, setDragPos] = React.useState<{ x: number; y: number } | null>(
    null
  )
  const [dropKey, setDropKey] = React.useState<string | null>(null)
  const [settling, setSettling] = React.useState(false)

  const sourceEntries = items
    ? items
        .filter((item) => !closedKeys.has(String(item.key)))
        .map((item, index) => ({
          key: item.key,
          column: item.column,
          closable: item.closable,
          node: itemRender ? itemRender(item, index) : item.children,
        }))
    : React.Children.toArray(children)
        .map((child, index) => {
          // toArray prefixes element keys (`.$key`); strip that so the
          // author's own keys come back out of onClose/onReorder.
          const rawKey =
            React.isValidElement(child) && child.key != null ? child.key : null
          const key: MasonryKey =
            rawKey === null
              ? index
              : rawKey.startsWith(".$")
                ? rawKey.slice(2)
                : rawKey
          return {
            key,
            column: undefined as number | undefined,
            closable: undefined as boolean | undefined,
            node: child,
          }
        })
        .filter((entry) => !closedKeys.has(String(entry.key)))

  const keyStrings = sourceEntries.map((entry) => String(entry.key))
  const liveKeys = new Set(keyStrings)
  const knownOrder = orderKeys.filter((key) => liveKeys.has(key))
  const knownSet = new Set(knownOrder)
  const effectiveOrder = [
    ...knownOrder,
    ...keyStrings.filter((key) => !knownSet.has(key)),
  ]
  const rank = new Map(effectiveOrder.map((key, index) => [key, index]))
  const entries = [...sourceEntries].sort(
    (a, b) => (rank.get(String(a.key)) ?? 0) - (rank.get(String(b.key)) ?? 0)
  )

  // Measured item heights, keyed by the stringified item key. Heights are the
  // only thing the layout needs to measure — widths are pure CSS below.
  // offsetHeight is used (not bounding rects) so the lift scale and wobble
  // rotation never feed back into the layout.
  const [heights, setHeights] = React.useState<ReadonlyMap<string, number>>(
    () => new Map()
  )

  const observerRef = React.useRef<ResizeObserver | null>(null)

  // One stable observer callback for every item: the item key travels on a
  // data attribute so this never needs per-item closures, and re-renders
  // don't re-observe elements.
  const observeItem = React.useCallback((node: HTMLDivElement | null) => {
    if (!node) return
    observerRef.current ??= new ResizeObserver((observed) => {
      setHeights((previous) => {
        let next: Map<string, number> | null = null
        for (const entry of observed) {
          const element = entry.target as HTMLElement
          const key = element.dataset.masonryKey
          if (key === undefined) continue
          const height = element.offsetHeight
          const current = next?.get(key) ?? previous.get(key)
          if (current === undefined || Math.abs(current - height) > 0.5) {
            next ??= new Map(previous)
            next.set(key, height)
          }
        }
        return next ?? previous
      })
    })
    const observer = observerRef.current
    observer.observe(node)
    return () => observer.unobserve(node)
  }, [])

  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const gestureRef = React.useRef<DragGesture | null>(null)
  const suppressClickRef = React.useRef(false)
  const settleTimerRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    return () => {
      observerRef.current?.disconnect()
      const gesture = gestureRef.current
      if (gesture?.timer != null) window.clearTimeout(gesture.timer)
      if (settleTimerRef.current != null)
        window.clearTimeout(settleTimerRef.current)
      document.removeEventListener("touchmove", preventTouchScroll)
    }
  }, [])

  // Keep position changes animated for a moment after a drop or close, then
  // go back to instant re-layouts (resizes etc. shouldn't animate).
  const beginSettling = () => {
    setSettling(true)
    if (settleTimerRef.current != null)
      window.clearTimeout(settleTimerRef.current)
    settleTimerRef.current = window.setTimeout(() => {
      setSettling(false)
      setDropKey(null)
      settleTimerRef.current = null
    }, 350)
  }

  const closeItem = (key: MasonryKey) => {
    beginSettling()
    setClosedKeys((previous) => new Set(previous).add(String(key)))
    onClose?.(key)
  }

  // Reordering happens live while dragging: carrying the lifted item over
  // another moves it into that slot and the packing re-flows around it.
  const moveDraggedTo = (draggedKey: string, overKey: string) => {
    if (draggedKey === overKey) return
    const from = effectiveOrder.indexOf(draggedKey)
    const to = effectiveOrder.indexOf(overKey)
    if (from === -1 || to === -1 || from === to) return
    const next = [...effectiveOrder]
    next.splice(from, 1)
    next.splice(to, 0, draggedKey)
    setOrderKeys(next)
  }

  const [horizontal, vertical] = Array.isArray(gutter)
    ? gutter
    : [gutter, gutter]
  const gutterX = resolveResponsiveNumber(horizontal, screens)
  const gutterY = resolveResponsiveNumber(vertical, screens)
  const columnCount = Math.max(
    1,
    Math.floor(resolveResponsiveNumber(columns, screens))
  )

  // Width and horizontal offset only depend on the container width, so they
  // stay in CSS; only vertical placement needs the measured heights.
  const columnWidth = `calc((100% - ${gutterX * (columnCount - 1)}px) / ${columnCount})`
  const columnLeft = (column: number) =>
    column === 0
      ? 0
      : `calc(${columnWidth} * ${column} + ${gutterX * column}px)`

  const columnHeights = new Array<number>(columnCount).fill(0)
  const placements = entries.map((entry, index) => {
    const measured = heights.get(String(entry.key))
    let column: number
    if (entry.column !== undefined) {
      column = Math.min(Math.max(entry.column, 0), columnCount - 1)
    } else if (sequential) {
      column = index % columnCount
    } else {
      column = 0
      for (let candidate = 1; candidate < columnCount; candidate++) {
        if (columnHeights[candidate] < columnHeights[column]) column = candidate
      }
    }
    const top = columnHeights[column]
    columnHeights[column] = top + (measured ?? 0) + gutterY
    return {
      ...entry,
      column,
      top,
      height: measured ?? 0,
      measured: measured !== undefined,
    }
  })
  const containerHeight =
    placements.length > 0
      ? Math.max(0, Math.max(...columnHeights) - gutterY)
      : 0

  // --- pointer-based drag ---------------------------------------------------

  const liftItem = (gesture: DragGesture) => {
    const container = containerRef.current
    if (!container) return
    if (gesture.timer != null) window.clearTimeout(gesture.timer)
    const containerRect = container.getBoundingClientRect()
    const itemRect = gesture.element.getBoundingClientRect()
    gesture.grabDX = gesture.startX - itemRect.left
    gesture.grabDY = gesture.startY - itemRect.top
    gesture.active = true
    gesture.timer = null
    // Stop touch scrolling from hijacking the gesture mid-drag.
    document.addEventListener("touchmove", preventTouchScroll, {
      passive: false,
    })
    setDragKey(gesture.key)
    setDropKey(null)
    setDragPos({
      x: itemRect.left - containerRect.left,
      y: itemRect.top - containerRect.top,
    })
  }

  const releaseGesture = (completed: boolean) => {
    const gesture = gestureRef.current
    if (!gesture) return
    if (gesture.timer != null) window.clearTimeout(gesture.timer)
    gestureRef.current = null
    if (gesture.element.hasPointerCapture(gesture.pointerId)) {
      gesture.element.releasePointerCapture(gesture.pointerId)
    }
    if (!gesture.active) return
    document.removeEventListener("touchmove", preventTouchScroll)
    // Swallow the click the browser may synthesize right after the drop —
    // and only that one, so the flag can't leak into later interactions.
    suppressClickRef.current = true
    window.setTimeout(() => {
      suppressClickRef.current = false
    }, 0)
    setDragKey(null)
    setDragPos(null)
    setDropKey(gesture.key)
    beginSettling()
    if (completed) onReorder?.(entries.map((entry) => entry.key))
  }

  const handlePointerDown =
    (keyString: string) => (event: React.PointerEvent<HTMLDivElement>) => {
      if (!draggable || !event.isPrimary || gestureRef.current) return
      // Leave interactive content (the × button, links, form controls) alone.
      const target = event.target as Element
      if (target.closest("button, a, input, select, textarea")) return
      const gesture: DragGesture = {
        key: keyString,
        pointerId: event.pointerId,
        element: event.currentTarget,
        startX: event.clientX,
        startY: event.clientY,
        timer: null,
        grabDX: 0,
        grabDY: 0,
        active: false,
      }
      // Capture right away so the release is always seen, even if the
      // pointer leaves the item before the drag activates.
      try {
        event.currentTarget.setPointerCapture(event.pointerId)
      } catch {
        // Capture can fail if the pointer is already gone; harmless.
      }
      gesture.timer = window.setTimeout(() => liftItem(gesture), longPressDelay)
      gestureRef.current = gesture
    }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current
    if (!gesture || event.pointerId !== gesture.pointerId) return
    if (!gesture.active) {
      const wandered =
        Math.hypot(
          event.clientX - gesture.startX,
          event.clientY - gesture.startY
        ) > DRAG_TOLERANCE
      if (!wandered) return
      if (event.pointerType === "mouse") {
        // A mouse can't scroll by panning, so movement IS the drag: lift
        // immediately instead of requiring a hold.
        liftItem(gesture)
      } else {
        // On touch, wandering during the hold means scrolling — bail out.
        if (gesture.timer != null) window.clearTimeout(gesture.timer)
        gestureRef.current = null
        return
      }
    }
    const container = containerRef.current
    if (!container) return
    event.preventDefault()
    const rect = container.getBoundingClientRect()
    setDragPos({
      x: event.clientX - rect.left - gesture.grabDX,
      y: event.clientY - rect.top - gesture.grabDY,
    })
    // Hit-test the pointer against the other items' slots to reorder live.
    const pointerX = event.clientX - rect.left
    const pointerY = event.clientY - rect.top
    const columnWidthPx =
      (rect.width - gutterX * (columnCount - 1)) / columnCount
    for (const placement of placements) {
      const placementKey = String(placement.key)
      if (placementKey === gesture.key || !placement.measured) continue
      const left = placement.column * (columnWidthPx + gutterX)
      if (
        pointerX >= left &&
        pointerX <= left + columnWidthPx &&
        pointerY >= placement.top &&
        pointerY <= placement.top + placement.height
      ) {
        moveDraggedTo(gesture.key, placementKey)
        break
      }
    }
  }

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current
    if (!gesture || event.pointerId !== gesture.pointerId) return
    releaseGesture(event.type !== "pointercancel")
  }

  // ---------------------------------------------------------------------------

  // Report the layout once every item has been measured. Serializing the
  // positions both detects real changes and hands the effect a stable value,
  // so consumers aren't called on unrelated re-renders.
  const positionsJson = placements.every((placement) => placement.measured)
    ? JSON.stringify(
        placements.map(
          ({ key, column, top, height }): MasonryItemPosition => ({
            key,
            column,
            top,
            height,
          })
        )
      )
    : null
  const onLayoutChangeRef = React.useRef(onLayoutChange)
  React.useEffect(() => {
    onLayoutChangeRef.current = onLayoutChange
  })
  React.useEffect(() => {
    if (positionsJson === null) return
    onLayoutChangeRef.current?.(
      JSON.parse(positionsJson) as MasonryItemPosition[]
    )
  }, [positionsJson])

  const dragging = dragKey !== null
  const animating = dragging || settling

  return (
    <div
      ref={containerRef}
      data-slot="masonry"
      className={cn("relative w-full", className)}
      style={{ height: containerHeight, ...style }}
      {...props}
    >
      {draggable && (
        <style>{`
@keyframes masonry-wobble{0%,100%{transform:rotate(-0.8deg)}50%{transform:rotate(0.8deg)}}
@media (prefers-reduced-motion:reduce){[data-slot="masonry-item"]{animation:none!important;transition-property:none!important}}
`}</style>
      )}
      {placements.map((placement, index) => {
        const keyString = String(placement.key)
        const isClosable = placement.closable ?? closable
        const isDragged = dragging && dragKey === keyString
        const wobbling = wobble && dragging && !isDragged
        return (
          <div
            key={placement.key}
            data-slot="masonry-item"
            data-masonry-key={keyString}
            onPointerDown={
              draggable ? handlePointerDown(keyString) : undefined
            }
            onPointerMove={draggable ? handlePointerMove : undefined}
            onPointerUp={draggable ? handlePointerEnd : undefined}
            onPointerCancel={draggable ? handlePointerEnd : undefined}
            onContextMenu={
              draggable
                ? (event) => {
                    // No context menu out of the long-press once it lifts.
                    if (gestureRef.current?.active) event.preventDefault()
                  }
                : undefined
            }
            onClickCapture={
              draggable
                ? (event) => {
                    // Swallow the click that follows a completed drag.
                    if (suppressClickRef.current) {
                      suppressClickRef.current = false
                      event.preventDefault()
                      event.stopPropagation()
                    }
                  }
                : undefined
            }
            className={cn(
              "group/masonry-item absolute",
              draggable && "cursor-grab select-none",
              isDragged && "z-10 scale-[1.03] cursor-grabbing shadow-lg",
              !isDragged && dropKey === keyString && "z-10",
              !isDragged &&
                animating &&
                "transition-[top,left] duration-300 ease-out"
            )}
            style={{
              width: columnWidth,
              left:
                isDragged && dragPos
                  ? dragPos.x
                  : columnLeft(placement.column),
              top: isDragged && dragPos ? dragPos.y : placement.top,
              animation: wobbling
                ? `masonry-wobble 0.35s ease-in-out ${(index % 4) * 0.08}s infinite`
                : undefined,
              // Hide items for the single frame before their first
              // measurement so they never flash stacked on top of each other.
              visibility: placement.measured ? undefined : "hidden",
            }}
            ref={observeItem}
          >
            {placement.node}
            {isClosable && (
              <button
                type="button"
                aria-label="Close"
                onClick={() => closeItem(placement.key)}
                className={cn(
                  "absolute top-1.5 right-1.5 z-10 flex size-6 items-center justify-center rounded-full bg-background/80 text-muted-foreground opacity-0 transition-opacity group-hover/masonry-item:opacity-100 hover:text-foreground focus-visible:opacity-100",
                  dragging && "opacity-100"
                )}
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

export { Masonry, useBreakpoint }
export type {
  MasonryProps,
  MasonryItemType,
  MasonryItemPosition,
  MasonryKey,
  Gutter,
  Breakpoint,
}

"use client"

import * as React from "react"
import { Move } from "lucide-react"

import { FloatButton } from "@/registry/float-button/float-button"

// The button is a plain element, so dragging is just `offset` in state: the
// pointer moves it, the container's bounds clamp it, and on release it glides
// to the nearest side — the way a mobile FAB behaves.

/** Gap kept between the button and the container's edges, in px. */
const EDGE = 16
/** Size of a default-size float button, in px. */
const BUTTON = 48
/** Length of the snap-back glide, in ms. */
const SNAP_MS = 220

type Offset = { x: number; y: number }

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export function FloatButtonDraggableExample() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [offset, setOffset] = React.useState<Offset>({ x: EDGE, y: EDGE })
  const [dragging, setDragging] = React.useState(false)

  // The pointer handlers and the glide need the live offset, so it is mirrored
  // into a ref on every write (never read or written during render).
  const offsetRef = React.useRef(offset)
  const moveOffset = React.useCallback((next: Offset) => {
    offsetRef.current = next
    setOffset(next)
  }, [])

  const dragRef = React.useRef<{ x: number; y: number; from: Offset } | null>(null)
  const draggedRef = React.useRef(false)
  const frameRef = React.useRef<number | null>(null)

  React.useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    },
    []
  )

  const glideTo = (target: Offset) => {
    const from = offsetRef.current
    const startedAt = performance.now()

    const step = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / SNAP_MS)
      const eased = 1 - Math.pow(1 - progress, 3)
      moveOffset({
        x: from.x + (target.x - from.x) * eased,
        y: from.y + (target.y - from.y) * eased,
      })
      if (progress < 1) frameRef.current = requestAnimationFrame(step)
    }

    frameRef.current = requestAnimationFrame(step)
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { x: event.clientX, y: event.clientY, from: offsetRef.current }
    draggedRef.current = false
    setDragging(true)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    const bounds = containerRef.current?.getBoundingClientRect()
    if (!drag || !bounds) return

    const dx = event.clientX - drag.x
    const dy = event.clientY - drag.y
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) draggedRef.current = true

    // The offset is measured from the bottom-right corner, so moving the
    // pointer right or down shrinks it.
    moveOffset({
      x: clamp(drag.from.x - dx, EDGE, bounds.width - BUTTON - EDGE),
      y: clamp(drag.from.y - dy, EDGE, bounds.height - BUTTON - EDGE),
    })
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current) return
    event.currentTarget.releasePointerCapture(event.pointerId)
    dragRef.current = null
    setDragging(false)

    const bounds = containerRef.current?.getBoundingClientRect()
    if (!bounds || !draggedRef.current) return

    // Snap to whichever side the button's centre ended up closest to.
    const { x, y } = offsetRef.current
    glideTo({
      x: x + BUTTON / 2 < bounds.width / 2 ? EDGE : bounds.width - BUTTON - EDGE,
      y,
    })
  }

  return (
    <div
      ref={containerRef}
      className="relative h-56 w-full overflow-hidden rounded-xl bg-muted/40 p-5"
    >
      <p className="text-sm text-muted-foreground">
        Drag the button anywhere — it snaps to the nearest side on release.
      </p>

      <FloatButton
        position="absolute"
        offset={offset}
        type="primary"
        icon={<Move />}
        aria-label="Drag me"
        className={`touch-none cursor-grab active:cursor-grabbing ${
          dragging ? "scale-110 shadow-xl" : ""
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={() => {
          // A drag ends with a click on the button — ignore that one.
          if (draggedRef.current) {
            draggedRef.current = false
            return
          }
          console.log("float button clicked")
        }}
      />
    </div>
  )
}

"use client"

import * as React from "react"
import { GripVertical, Trash2, X } from "lucide-react"

import { cn } from "@/lib/utils"

// A widget instance is identified only by a stable id and a `type` string.
// Rendering is derived from `type` by the consumer's catalog, so the board can
// be serialized to (and rehydrated from) localStorage with just these two
// fields — see `useWidgetBoard`.
export type Widget = { id: string; type: string }

// What is currently being dragged: a brand-new widget coming from a source
// (e.g. a sidebar button) or an existing widget being moved/removed.
type DragItem =
  | { kind: "new"; type: string }
  | { kind: "move"; id: string }
  | null

export interface WidgetBoardControls {
  widgets: Widget[]
  // False until the first localStorage read completes, so the canvas can avoid
  // flashing the empty state during hydration.
  hydrated: boolean
  addWidget: (type: string, atIndex?: number) => void
  removeWidget: (id: string) => void
  moveWidget: (id: string, toIndex: number) => void
  // Empties the board.
  clear: () => void
  // Restores the `initial` layout the hook was created with.
  reset: () => void
}

let counter = 0
function genId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `w-${Date.now()}-${counter++}`
}

// Owns the widget list and mirrors it to localStorage on every change. The
// drag/drop wiring lives in the context provider below; this hook is the
// persistence + mutation layer.
export function useWidgetBoard(options: {
  storageKey: string
  initial?: Widget[]
}): WidgetBoardControls {
  const { storageKey, initial } = options
  const [widgets, setWidgets] = React.useState<Widget[]>(initial ?? [])
  const [hydrated, setHydrated] = React.useState(false)
  // Capture the seed layout once so `reset` always restores the same default,
  // independent of later renders passing a fresh `initial` array.
  const initialRef = React.useRef(initial)

  React.useEffect(() => {
    // localStorage can't be read during render (SSR + hydration mismatch), so
    // the one-time rehydration has to happen in an effect.
    try {
      const raw = localStorage.getItem(storageKey)
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time rehydration from an external store
      if (raw) setWidgets(JSON.parse(raw) as Widget[])
    } catch {
      // Ignore unreadable/corrupt storage and fall back to `initial`.
    }
    setHydrated(true)
  }, [storageKey])

  React.useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(storageKey, JSON.stringify(widgets))
    } catch {
      // Storage may be full or disabled; the board still works in-memory.
    }
  }, [widgets, hydrated, storageKey])

  const addWidget = React.useCallback((type: string, atIndex?: number) => {
    setWidgets((prev) => {
      const idx =
        atIndex == null ? prev.length : Math.max(0, Math.min(atIndex, prev.length))
      const next = prev.slice()
      next.splice(idx, 0, { id: genId(), type })
      return next
    })
  }, [])

  const removeWidget = React.useCallback((id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id))
  }, [])

  const moveWidget = React.useCallback((id: string, toIndex: number) => {
    setWidgets((prev) => {
      const from = prev.findIndex((w) => w.id === id)
      if (from === -1) return prev
      const next = prev.slice()
      const [item] = next.splice(from, 1)
      // Removing the item shifts everything after it left by one, so the target
      // index has to be adjusted when moving an item further down the list.
      let target = from < toIndex ? toIndex - 1 : toIndex
      target = Math.max(0, Math.min(target, next.length))
      next.splice(target, 0, item)
      return next
    })
  }, [])

  const clear = React.useCallback(() => setWidgets([]), [])

  const reset = React.useCallback(
    () => setWidgets(initialRef.current ?? []),
    []
  )

  return { widgets, hydrated, addWidget, removeWidget, moveWidget, clear, reset }
}

interface WidgetBoardContextValue extends WidgetBoardControls {
  dragItem: DragItem
  setDragItem: (item: DragItem) => void
  dropIndex: number | null
  setDropIndex: (index: number | null) => void
  resetDrag: () => void
}

const WidgetBoardContext = React.createContext<WidgetBoardContextValue | null>(
  null
)

function useBoardContext() {
  const ctx = React.useContext(WidgetBoardContext)
  if (!ctx) {
    throw new Error("WidgetBoard components must be used within <WidgetBoard>")
  }
  return ctx
}

// Top-level provider. Pass it the controls from `useWidgetBoard`; it layers the
// transient drag state on top and exposes everything to the sub-components.
function WidgetBoard({
  board,
  children,
}: {
  board: WidgetBoardControls
  children: React.ReactNode
}) {
  const [dragItem, setDragItem] = React.useState<DragItem>(null)
  const [dropIndex, setDropIndex] = React.useState<number | null>(null)

  const resetDrag = React.useCallback(() => {
    setDragItem(null)
    setDropIndex(null)
  }, [])

  const value: WidgetBoardContextValue = {
    ...board,
    dragItem,
    setDragItem,
    dropIndex,
    setDropIndex,
    resetDrag,
  }

  return (
    <WidgetBoardContext.Provider value={value}>
      {children}
    </WidgetBoardContext.Provider>
  )
}

// A draggable entry that spawns a new widget of `type` when dropped on the
// canvas. Designed to sit inside a sidebar but works anywhere.
function WidgetSource({
  type,
  icon,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { type: string; icon?: React.ReactNode }) {
  const ctx = useBoardContext()

  return (
    <div
      data-slot="widget-source"
      role="button"
      tabIndex={0}
      draggable
      onDragStart={(e) => {
        // dataTransfer must be populated for the drag to initiate in Firefox;
        // the React state below is what the drop handlers actually read.
        e.dataTransfer.setData("text/plain", type)
        e.dataTransfer.effectAllowed = "copy"
        ctx.setDragItem({ kind: "new", type })
      }}
      onDragEnd={ctx.resetDrag}
      className={cn(
        "flex cursor-grab items-center gap-3 rounded-lg px-2.5 py-2 text-foreground/80 transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 active:cursor-grabbing [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
        className
      )}
      {...props}
    >
      {icon}
      <span className="truncate">{children}</span>
      <GripVertical className="ml-auto size-4 text-muted-foreground" />
    </div>
  )
}

// The drop area that holds the widgets. Consumers render the mapped
// <WidgetCard> children inside it.
function WidgetCanvas({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const ctx = useBoardContext()
  const isEmpty = ctx.widgets.length === 0
  const showEndIndicator =
    ctx.dragItem != null && ctx.dropIndex === ctx.widgets.length && !isEmpty

  return (
    <div
      data-slot="widget-canvas"
      data-active={ctx.dragItem ? "" : undefined}
      onDragOver={(e) => {
        if (!ctx.dragItem) return
        // Reached only when the pointer is over empty canvas space — cards stop
        // propagation in their own dragover — so default to appending.
        e.preventDefault()
        ctx.setDropIndex(ctx.widgets.length)
      }}
      onDrop={(e) => {
        e.preventDefault()
        const { dragItem, dropIndex } = ctx
        if (!dragItem) return
        const idx = dropIndex ?? ctx.widgets.length
        if (dragItem.kind === "new") ctx.addWidget(dragItem.type, idx)
        else ctx.moveWidget(dragItem.id, idx)
        ctx.resetDrag()
      }}
      className={cn(
        "relative flex-1 overflow-auto rounded-xl bg-muted/30 p-4 transition-colors data-active:bg-primary/5",
        className
      )}
      {...props}
    >
      {isEmpty ? (
        <div className="flex h-full min-h-32 flex-col items-center justify-center gap-1 text-center text-sm text-muted-foreground">
          <span className="font-medium">Your dashboard is empty</span>
          <span>Drag a widget from the sidebar to get started</span>
        </div>
      ) : (
        <div className="flex flex-wrap content-start gap-3">
          {children}
          {showEndIndicator && (
            <div className="w-1 self-stretch rounded bg-primary" />
          )}
        </div>
      )}
    </div>
  )
}

// One widget: draggable for reordering/removal, with an X to close it. The
// `title`/`icon` render the header; `children` is the widget body.
function WidgetCard({
  widget,
  index,
  title,
  icon,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  widget: Widget
  index: number
  title?: React.ReactNode
  icon?: React.ReactNode
}) {
  const ctx = useBoardContext()
  const cardRef = React.useRef<HTMLDivElement>(null)
  const isDragging = ctx.dragItem?.kind === "move" && ctx.dragItem.id === widget.id
  const showIndicator = ctx.dragItem != null && ctx.dropIndex === index

  return (
    <div className="relative flex">
      {/* Insertion marker shown on the leading edge when a drop would land here. */}
      {showIndicator && (
        <div className="absolute -left-2 top-0 h-full w-1 rounded bg-primary" />
      )}
      <div
        ref={cardRef}
        data-slot="widget-card"
        data-dragging={isDragging ? "" : undefined}
        // Only `dragover` lives on the card so it can act as a reorder target;
        // it no-ops unless a drag is in progress, leaving the body interactive.
        onDragOver={(e) => {
          if (!ctx.dragItem) return
          e.preventDefault()
          // Stop the canvas handler from overriding this finer-grained index.
          e.stopPropagation()
          const rect = e.currentTarget.getBoundingClientRect()
          const before = e.clientX < rect.left + rect.width / 2
          ctx.setDropIndex(before ? index : index + 1)
        }}
        className={cn(
          "group/widget flex w-56 flex-col gap-2 rounded-xl bg-card p-3 text-card-foreground shadow-sm transition-opacity data-dragging:opacity-40",
          className
        )}
        {...props}
      >
        <header className="flex items-center gap-2">
          {/* The drag handle: the *only* draggable region, so inputs and other
              interactive content in the body are never hijacked by a drag. */}
          <div
            data-slot="widget-drag-handle"
            draggable
            title="Drag to move"
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", widget.id)
              e.dataTransfer.effectAllowed = "move"
              // Drag the whole card as the preview, not just the handle.
              if (cardRef.current) {
                e.dataTransfer.setDragImage(cardRef.current, 16, 16)
              }
              ctx.setDragItem({ kind: "move", id: widget.id })
            }}
            onDragEnd={ctx.resetDrag}
            className="flex min-w-0 flex-1 cursor-grab items-center gap-2 select-none active:cursor-grabbing"
          >
            <GripVertical className="size-4 shrink-0 text-muted-foreground" />
            {icon && (
              <span className="flex size-5 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4">
                {icon}
              </span>
            )}
            <span className="flex-1 truncate text-sm font-medium">{title}</span>
          </div>
          <button
            type="button"
            aria-label="Remove widget"
            draggable={false}
            onClick={() => ctx.removeWidget(widget.id)}
            className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-[opacity,color,background-color] outline-none hover:bg-muted hover:text-foreground focus-visible:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/50 group-hover/widget:opacity-100"
          >
            <X className="size-4" />
          </button>
        </header>
        <div className="text-sm text-muted-foreground">{children}</div>
      </div>
    </div>
  )
}

// A drop target that deletes whatever existing widget is dropped onto it.
// Dropping a brand-new (not-yet-added) widget here is simply ignored.
function WidgetTrash({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const ctx = useBoardContext()
  const [over, setOver] = React.useState(false)
  // dragenter/dragleave fire for every child the pointer crosses; a depth
  // counter keeps `over` stable until the pointer truly leaves the trash,
  // instead of flickering off each time it moves onto the icon or label.
  const dragDepth = React.useRef(0)
  const active = over && ctx.dragItem?.kind === "move"

  const endDrag = () => {
    dragDepth.current = 0
    setOver(false)
  }

  return (
    <div
      data-slot="widget-trash"
      data-active={active ? "" : undefined}
      onDragOver={(e) => {
        if (!ctx.dragItem) return
        e.preventDefault()
        e.stopPropagation()
      }}
      onDragEnter={() => {
        dragDepth.current += 1
        setOver(true)
      }}
      onDragLeave={() => {
        dragDepth.current = Math.max(0, dragDepth.current - 1)
        if (dragDepth.current === 0) setOver(false)
      }}
      onDrop={(e) => {
        e.preventDefault()
        if (ctx.dragItem?.kind === "move") ctx.removeWidget(ctx.dragItem.id)
        endDrag()
        ctx.resetDrag()
      }}
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl bg-muted/60 px-3 py-3 text-sm text-muted-foreground transition-colors data-active:bg-destructive/10 data-active:text-destructive",
        className
      )}
      {...props}
    >
      <Trash2 className="size-5 shrink-0" />
      <span className="truncate">
        {children ?? (active ? "Release to delete" : "Drop to remove")}
      </span>
    </div>
  )
}

export { WidgetBoard, WidgetSource, WidgetCanvas, WidgetCard, WidgetTrash }

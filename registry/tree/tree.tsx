"use client"

import * as React from "react"
import { ChevronRight, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------------------------------
 * Tree — a hierarchical data display
 *
 * A self-contained, offline-friendly tree modeled on ReUI's Tree. One data-driven
 * <Tree> renders nested nodes and covers every feature:
 *   - expand / collapse (controlled or uncontrolled), with async child loading
 *   - selection modes: none / single / multiple (ctrl + shift) / checkbox
 *   - checkbox nodes with parent indeterminate state that propagates through the subtree
 *   - full keyboard navigation (arrows, Home/End, Enter/Space, typeahead) with a roving tabindex
 *   - optional vertical indentation guide lines and a configurable indent width
 *   - per-node icons, custom label content (avatar / badge) and trailing action slots
 *   - drag-and-drop reordering with before / after / inside drop indicators
 *   - WAI-ARIA tree / treeitem / group roles, aria-expanded / aria-selected / aria-level
 *   - disabled nodes
 *
 * Every colour resolves from a --tree-* CSS variable so the whole tree restyles
 * from one place (see the item's cssVars in registry.json).
 * ------------------------------------------------------------------------------------------------ */

/* ------------------------------------------------------------------ Types */

interface TreeNode {
  /** Stable unique id across the whole tree. */
  id: string
  /** Display label (also used for typeahead). */
  name: string
  /** Nested children. Omit for leaves. */
  children?: TreeNode[]
  /** Marks a node as a branch even when it has no loaded children yet (async). */
  isBranch?: boolean
  /** Non-interactive: cannot be focused, selected, expanded or dragged. */
  disabled?: boolean
  /** Anything else — read it back in getItemIcon / renderLabel / renderActions. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

type TreeSelectionMode = "none" | "single" | "multiple" | "checkbox"

/** Where a dragged node lands relative to the row it was dropped on. */
type TreeDropPosition = "before" | "after" | "inside"

interface TreeItemState {
  level: number
  expanded: boolean
  selected: boolean
  /** checkbox mode only — fully checked. */
  checked: boolean
  /** checkbox mode only — some but not all descendants checked. */
  indeterminate: boolean
  hasChildren: boolean
  loading: boolean
  disabled: boolean
}

interface TreeProps extends Omit<React.ComponentPropsWithoutRef<"div">, "onSelect"> {
  /** The node forest to render. */
  data: TreeNode[]

  /** Selection behaviour. @default "single" */
  selectionMode?: TreeSelectionMode

  /** Controlled expanded ids. */
  expandedIds?: string[]
  /** Uncontrolled initial expanded ids. @default [] */
  defaultExpandedIds?: string[]
  onExpandedChange?: (ids: string[]) => void

  /** Controlled selected ids (single/multiple/checkbox). */
  selectedIds?: string[]
  /** Uncontrolled initial selected ids. @default [] */
  defaultSelectedIds?: string[]
  onSelectedChange?: (ids: string[]) => void

  /** Draw vertical indentation guide lines. @default false */
  indentGuides?: boolean
  /** Indentation added per depth level, in px. @default 20 */
  indent?: number

  /** Clicking a branch row toggles its expansion. @default true */
  expandOnClick?: boolean

  /** Enable HTML5 drag-and-drop reordering. @default false */
  draggable?: boolean
  /** Fired after a successful drop. Use `moveTreeNode` to compute the next data. */
  onMove?: (move: {
    dragId: string
    targetId: string
    position: TreeDropPosition
  }) => void

  /** Lazily load a branch's children the first time it is expanded. */
  onLoadChildren?: (node: TreeNode) => Promise<TreeNode[]>

  /** Leading icon per node (e.g. folder / file glyphs). */
  getItemIcon?: (node: TreeNode, state: TreeItemState) => React.ReactNode
  /** Custom label content (avatar, badge…). Defaults to `node.name`. */
  renderLabel?: (node: TreeNode, state: TreeItemState) => React.ReactNode
  /** Trailing content, right-aligned (action buttons, counts…). */
  renderActions?: (node: TreeNode, state: TreeItemState) => React.ReactNode
}

/* ------------------------------------------------------------------ Tree utilities */

/** Depth-first walk yielding each node with its parent chain. */
function forEachNode(
  nodes: TreeNode[],
  fn: (node: TreeNode, parents: TreeNode[]) => void,
  parents: TreeNode[] = []
) {
  for (const node of nodes) {
    fn(node, parents)
    if (node.children?.length) forEachNode(node.children, fn, [...parents, node])
  }
}

/** Collect a node's own id plus every descendant id. */
function collectSubtreeIds(node: TreeNode, out: string[] = []): string[] {
  out.push(node.id)
  node.children?.forEach((c) => collectSubtreeIds(c, out))
  return out
}

function findNode(nodes: TreeNode[], id: string): TreeNode | null {
  let found: TreeNode | null = null
  forEachNode(nodes, (n) => {
    if (n.id === id) found = n
  })
  return found
}

/**
 * Reorder a tree immutably by moving `dragId` relative to `targetId`.
 * Exposed so consumers can update their data in an `onMove` handler.
 */
function moveTreeNode(
  data: TreeNode[],
  dragId: string,
  targetId: string,
  position: TreeDropPosition
): TreeNode[] {
  if (dragId === targetId) return data

  // Refuse to drop a node into its own subtree.
  const dragged = findNode(data, dragId)
  if (!dragged) return data
  if (collectSubtreeIds(dragged).includes(targetId)) return data

  // 1. Remove the dragged node.
  const remove = (nodes: TreeNode[]): TreeNode[] =>
    nodes
      .filter((n) => n.id !== dragId)
      .map((n) => (n.children ? { ...n, children: remove(n.children) } : n))

  const pruned = remove(data)
  const node = dragged

  // 2. Insert it at the target.
  if (position === "inside") {
    const insert = (nodes: TreeNode[]): TreeNode[] =>
      nodes.map((n) =>
        n.id === targetId
          ? { ...n, children: [...(n.children ?? []), node] }
          : n.children
            ? { ...n, children: insert(n.children) }
            : n
      )
    return insert(pruned)
  }

  const insert = (nodes: TreeNode[]): TreeNode[] => {
    const idx = nodes.findIndex((n) => n.id === targetId)
    if (idx !== -1) {
      const next = [...nodes]
      next.splice(position === "before" ? idx : idx + 1, 0, node)
      return next
    }
    return nodes.map((n) =>
      n.children ? { ...n, children: insert(n.children) } : n
    )
  }
  return insert(pruned)
}

/* ------------------------------------------------------------------ Flatten (visible rows) */

interface FlatRow {
  node: TreeNode
  level: number
  /** For each ancestor depth, whether that ancestor has a following sibling
   *  (so a guide line should continue down through this row). */
  ancestorLines: boolean[]
  isLast: boolean
  hasChildren: boolean
  expanded: boolean
}

function flattenVisible(
  nodes: TreeNode[],
  expanded: Set<string>,
  loadedChildren: Map<string, TreeNode[]>
): FlatRow[] {
  const rows: FlatRow[] = []

  const walk = (list: TreeNode[], level: number, ancestorLines: boolean[]) => {
    list.forEach((node, i) => {
      const isLast = i === list.length - 1
      const children = node.children ?? loadedChildren.get(node.id)
      const hasChildren = !!node.isBranch || !!children?.length
      const isExpanded = expanded.has(node.id)
      rows.push({
        node,
        level,
        ancestorLines,
        isLast,
        hasChildren,
        expanded: isExpanded,
      })
      if (isExpanded && children?.length) {
        walk(children, level + 1, [...ancestorLines, !isLast])
      }
    })
  }

  walk(nodes, 0, [])
  return rows
}

/* ------------------------------------------------------------------ Controllable state hook */

function useControllableSet(
  controlled: string[] | undefined,
  defaultValue: string[],
  onChange?: (ids: string[]) => void
): [Set<string>, (next: Set<string>) => void] {
  const [uncontrolled, setUncontrolled] = React.useState<Set<string>>(
    () => new Set(defaultValue)
  )
  const isControlled = controlled !== undefined
  const value = React.useMemo(
    () => (isControlled ? new Set(controlled) : uncontrolled),
    [isControlled, controlled, uncontrolled]
  )
  const setValue = React.useCallback(
    (next: Set<string>) => {
      if (!isControlled) setUncontrolled(next)
      onChange?.([...next])
    },
    [isControlled, onChange]
  )
  return [value, setValue]
}

/* ------------------------------------------------------------------ Checkbox helpers */

/** Recompute the fully-checked set after toggling `nodeId` on/off. */
function toggleChecked(
  data: TreeNode[],
  checked: Set<string>,
  nodeId: string
): Set<string> {
  const target = findNode(data, nodeId)
  if (!target) return checked

  const next = new Set(checked)
  const turningOn = !next.has(nodeId)
  const subtree = collectSubtreeIds(target)
  for (const id of subtree) {
    if (turningOn) next.add(id)
    else next.delete(id)
  }

  // Re-derive every ancestor: checked iff all its children are checked.
  const reconcile = (nodes: TreeNode[]): boolean => {
    let allChecked = true
    for (const n of nodes) {
      if (n.children?.length) {
        const childrenAllChecked = reconcile(n.children)
        if (childrenAllChecked) next.add(n.id)
        else next.delete(n.id)
        if (!childrenAllChecked) allChecked = false
      } else if (!next.has(n.id)) {
        allChecked = false
      }
    }
    return allChecked
  }
  reconcile(data)
  return next
}

/** A node is indeterminate when some (but not all) descendants are checked. */
function computeIndeterminate(
  node: TreeNode,
  checked: Set<string>
): boolean {
  if (!node.children?.length) return false
  if (checked.has(node.id)) return false
  const ids = collectSubtreeIds(node).slice(1)
  return ids.some((id) => checked.has(id))
}

/* ------------------------------------------------------------------ Checkbox control */

function TreeCheckbox({
  checked,
  indeterminate,
  disabled,
  onToggle,
}: {
  checked: boolean
  indeterminate: boolean
  disabled: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      disabled={disabled}
      tabIndex={-1}
      data-state={indeterminate ? "indeterminate" : checked ? "checked" : "unchecked"}
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-[4px] bg-tree-checkbox transition-colors",
        "data-[state=checked]:bg-tree-checkbox-checked data-[state=indeterminate]:bg-tree-checkbox-checked",
        "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
        "disabled:opacity-50"
      )}
    >
      {checked && !indeterminate && (
        <svg viewBox="0 0 16 16" className="size-3 text-tree-checkbox-indicator" aria-hidden="true">
          <path
            d="M13 4.5 6.5 11 3 7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {indeterminate && (
        <span className="h-0.5 w-2.5 rounded-full bg-tree-checkbox-indicator" />
      )}
    </button>
  )
}

/* ------------------------------------------------------------------ Row */

interface TreeRowProps {
  row: FlatRow
  indent: number
  indentGuides: boolean
  selectionMode: TreeSelectionMode
  focused: boolean
  selected: boolean
  checked: boolean
  indeterminate: boolean
  loading: boolean
  dropIndicator: TreeDropPosition | null
  draggable: boolean
  getItemIcon?: TreeProps["getItemIcon"]
  renderLabel?: TreeProps["renderLabel"]
  renderActions?: TreeProps["renderActions"]
  onToggleExpand: (node: TreeNode) => void
  onSelect: (node: TreeNode, e: React.MouseEvent) => void
  onToggleCheck: (node: TreeNode) => void
  onFocusRow: (node: TreeNode) => void
  registerRef: (id: string, el: HTMLDivElement | null) => void
  onDragStart: (node: TreeNode) => void
  onDragOverRow: (row: FlatRow, e: React.DragEvent) => void
  onDropRow: (row: FlatRow, e: React.DragEvent) => void
  onDragEnd: () => void
}

function TreeRow(props: TreeRowProps) {
  const {
    row,
    indent,
    indentGuides,
    selectionMode,
    focused,
    selected,
    checked,
    indeterminate,
    loading,
    dropIndicator,
    draggable,
    getItemIcon,
    renderLabel,
    renderActions,
    onToggleExpand,
    onSelect,
    onToggleCheck,
    onFocusRow,
    registerRef,
    onDragStart,
    onDragOverRow,
    onDropRow,
    onDragEnd,
  } = props

  const { node, level, hasChildren, expanded, ancestorLines } = row
  const disabled = !!node.disabled

  const state: TreeItemState = {
    level,
    expanded,
    selected,
    checked,
    indeterminate,
    hasChildren,
    loading,
    disabled,
  }

  const icon = getItemIcon?.(node, state)
  const paddingLeft = level * indent

  return (
    <div
      ref={(el) => registerRef(node.id, el)}
      role="treeitem"
      aria-level={level + 1}
      aria-expanded={hasChildren ? expanded : undefined}
      aria-selected={selectionMode === "none" ? undefined : selected}
      aria-disabled={disabled || undefined}
      tabIndex={focused ? 0 : -1}
      data-selected={selected || undefined}
      data-focused={focused || undefined}
      draggable={draggable && !disabled}
      onClick={(e) => !disabled && onSelect(node, e)}
      onFocus={() => !disabled && onFocusRow(node)}
      onDragStart={(e) => {
        if (disabled) return
        e.dataTransfer.effectAllowed = "move"
        e.dataTransfer.setData("text/plain", node.id)
        onDragStart(node)
      }}
      onDragOver={(e) => draggable && onDragOverRow(row, e)}
      onDrop={(e) => draggable && onDropRow(row, e)}
      onDragEnd={onDragEnd}
      className={cn(
        "group/row relative flex items-center gap-1.5 rounded-md py-1.5 pr-2 text-sm outline-none select-none",
        "transition-colors",
        !disabled && "cursor-pointer hover:bg-tree-item-hover",
        selected && "bg-tree-item-selected text-tree-item-selected-foreground",
        "focus-visible:ring-2 focus-visible:ring-ring/50",
        disabled && "cursor-not-allowed opacity-50"
      )}
      style={{ paddingLeft: paddingLeft + 8 }}
    >
      {/* Indentation guide lines — one per ancestor depth that still has siblings below. */}
      {indentGuides &&
        ancestorLines.map((draw, depth) =>
          draw ? (
            <span
              key={depth}
              aria-hidden="true"
              className="pointer-events-none absolute top-0 bottom-0 w-px bg-tree-guide"
              style={{ left: depth * indent + 8 + 11 }}
            />
          ) : null
        )}

      {/* Expand / collapse toggle (or spacer to keep labels aligned). */}
      {hasChildren ? (
        <button
          type="button"
          tabIndex={-1}
          aria-label={expanded ? "Collapse" : "Expand"}
          onClick={(e) => {
            e.stopPropagation()
            if (!disabled) onToggleExpand(node)
          }}
          className="flex size-5 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground"
        >
          {loading ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <ChevronRight
              aria-hidden="true"
              className={cn(
                "size-4 transition-transform duration-150",
                expanded && "rotate-90"
              )}
            />
          )}
        </button>
      ) : (
        <span className="size-5 shrink-0" aria-hidden="true" />
      )}

      {/* Checkbox (checkbox selection mode). */}
      {selectionMode === "checkbox" && (
        <TreeCheckbox
          checked={checked}
          indeterminate={indeterminate}
          disabled={disabled}
          onToggle={() => onToggleCheck(node)}
        />
      )}

      {/* Leading icon. */}
      {icon != null && (
        <span className="flex shrink-0 items-center text-muted-foreground group-data-[selected]/row:text-current">
          {icon}
        </span>
      )}

      {/* Label. */}
      <span className="min-w-0 flex-1 truncate">
        {renderLabel ? renderLabel(node, state) : node.name}
      </span>

      {/* Trailing actions. */}
      {renderActions && (
        <span className="ml-auto flex shrink-0 items-center gap-1">
          {renderActions(node, state)}
        </span>
      )}

      {/* Drop indicators. */}
      {dropIndicator === "before" && (
        <span className="pointer-events-none absolute inset-x-1 top-0 h-0.5 rounded-full bg-tree-drop-indicator" />
      )}
      {dropIndicator === "after" && (
        <span className="pointer-events-none absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-tree-drop-indicator" />
      )}
      {dropIndicator === "inside" && (
        <span className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-tree-drop-indicator ring-inset" />
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ Tree root */

function Tree({
  data,
  selectionMode = "single",
  expandedIds,
  defaultExpandedIds = [],
  onExpandedChange,
  selectedIds,
  defaultSelectedIds = [],
  onSelectedChange,
  indentGuides = false,
  indent = 20,
  expandOnClick = true,
  draggable = false,
  onMove,
  onLoadChildren,
  getItemIcon,
  renderLabel,
  renderActions,
  className,
  ...props
}: TreeProps) {
  const [expanded, setExpanded] = useControllableSet(
    expandedIds,
    defaultExpandedIds,
    onExpandedChange
  )
  const [selected, setSelected] = useControllableSet(
    selectedIds,
    defaultSelectedIds,
    onSelectedChange
  )

  const [focusedId, setFocusedId] = React.useState<string | null>(null)
  const [loadedChildren, setLoadedChildren] = React.useState<
    Map<string, TreeNode[]>
  >(new Map())
  const [loadingIds, setLoadingIds] = React.useState<Set<string>>(new Set())
  const loadedOnce = React.useRef<Set<string>>(new Set())

  // Drag state.
  const [dragId, setDragId] = React.useState<string | null>(null)
  const [dropTarget, setDropTarget] = React.useState<{
    id: string
    position: TreeDropPosition
  } | null>(null)

  const rowRefs = React.useRef<Map<string, HTMLDivElement>>(new Map())
  const registerRef = React.useCallback(
    (id: string, el: HTMLDivElement | null) => {
      if (el) rowRefs.current.set(id, el)
      else rowRefs.current.delete(id)
    },
    []
  )

  const rows = React.useMemo(
    () => flattenVisible(data, expanded, loadedChildren),
    [data, expanded, loadedChildren]
  )

  // Keep a stable initial focus target (first non-disabled visible row).
  const currentFocusId = React.useMemo(() => {
    if (focusedId && rows.some((r) => r.node.id === focusedId)) return focusedId
    return rows.find((r) => !r.node.disabled)?.node.id ?? null
  }, [focusedId, rows])

  const focusRow = React.useCallback((id: string) => {
    setFocusedId(id)
    // Focus after paint so a freshly-expanded row exists in the DOM.
    requestAnimationFrame(() => rowRefs.current.get(id)?.focus())
  }, [])

  /* ---------------------------------------------------------------- expand */

  const expandNode = React.useCallback(
    async (node: TreeNode) => {
      const next = new Set(expanded)
      const willExpand = !next.has(node.id)

      if (
        willExpand &&
        onLoadChildren &&
        !node.children?.length &&
        !loadedOnce.current.has(node.id)
      ) {
        loadedOnce.current.add(node.id)
        setLoadingIds((s) => new Set(s).add(node.id))
        try {
          const kids = await onLoadChildren(node)
          setLoadedChildren((m) => new Map(m).set(node.id, kids))
        } finally {
          setLoadingIds((s) => {
            const n = new Set(s)
            n.delete(node.id)
            return n
          })
        }
      }

      if (willExpand) next.add(node.id)
      else next.delete(node.id)
      setExpanded(next)
    },
    [expanded, onLoadChildren, setExpanded]
  )

  /* ---------------------------------------------------------------- select */

  const selectNode = React.useCallback(
    (node: TreeNode, e: React.MouseEvent | null) => {
      // "none" only expands; in "checkbox" mode the checkbox drives selection.
      if (selectionMode === "single") {
        setSelected(new Set([node.id]))
      } else if (selectionMode === "multiple") {
        const next = new Set(selected)
        if (e?.metaKey || e?.ctrlKey) {
          if (next.has(node.id)) next.delete(node.id)
          else next.add(node.id)
        } else if (e?.shiftKey && currentFocusId) {
          const order = rows.map((r) => r.node.id)
          const a = order.indexOf(currentFocusId)
          const b = order.indexOf(node.id)
          if (a !== -1 && b !== -1) {
            const [lo, hi] = a < b ? [a, b] : [b, a]
            for (let i = lo; i <= hi; i++) {
              const r = rows[i]
              if (!r.node.disabled) next.add(r.node.id)
            }
          }
        } else {
          next.clear()
          next.add(node.id)
        }
        setSelected(next)
      }

      if (expandOnClick && (node.children?.length || node.isBranch))
        void expandNode(node)
    },
    [
      selectionMode,
      expandOnClick,
      expandNode,
      selected,
      setSelected,
      currentFocusId,
      rows,
    ]
  )

  const toggleCheck = React.useCallback(
    (node: TreeNode) => {
      setSelected(toggleChecked(data, selected, node.id))
    },
    [data, selected, setSelected]
  )

  /* ---------------------------------------------------------------- keyboard */

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!currentFocusId) return
      const idx = rows.findIndex((r) => r.node.id === currentFocusId)
      if (idx === -1) return
      const row = rows[idx]

      const focusIndex = (i: number) => {
        // Skip disabled rows in the given direction.
        let j = i
        while (j >= 0 && j < rows.length && rows[j].node.disabled) {
          j += i > idx ? 1 : -1
        }
        if (j >= 0 && j < rows.length) focusRow(rows[j].node.id)
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          focusIndex(idx + 1)
          break
        case "ArrowUp":
          e.preventDefault()
          focusIndex(idx - 1)
          break
        case "ArrowRight":
          e.preventDefault()
          if (row.hasChildren && !row.expanded) void expandNode(row.node)
          else if (row.hasChildren && row.expanded) focusIndex(idx + 1)
          break
        case "ArrowLeft":
          e.preventDefault()
          if (row.hasChildren && row.expanded) void expandNode(row.node)
          else {
            // Move to parent.
            for (let j = idx - 1; j >= 0; j--) {
              if (rows[j].level < row.level) {
                focusRow(rows[j].node.id)
                break
              }
            }
          }
          break
        case "Home":
          e.preventDefault()
          focusIndex(0)
          break
        case "End":
          e.preventDefault()
          focusIndex(rows.length - 1)
          break
        case "Enter":
        case " ":
          e.preventDefault()
          if (selectionMode === "checkbox") toggleCheck(row.node)
          else selectNode(row.node, null)
          break
        default:
          // Typeahead: jump to the next row whose name starts with the key.
          if (e.key.length === 1 && /\S/.test(e.key) && !e.metaKey && !e.ctrlKey) {
            const ch = e.key.toLowerCase()
            for (let k = 1; k <= rows.length; k++) {
              const r = rows[(idx + k) % rows.length]
              if (!r.node.disabled && r.node.name.toLowerCase().startsWith(ch)) {
                focusRow(r.node.id)
                break
              }
            }
          }
      }
    },
    [
      currentFocusId,
      rows,
      focusRow,
      expandNode,
      selectionMode,
      toggleCheck,
      selectNode,
    ]
  )

  /* ---------------------------------------------------------------- drag & drop */

  const onDragOverRow = React.useCallback(
    (row: FlatRow, e: React.DragEvent) => {
      if (!dragId || dragId === row.node.id) return
      e.preventDefault()
      e.dataTransfer.dropEffect = "move"
      const rect = e.currentTarget.getBoundingClientRect()
      const y = e.clientY - rect.top
      const h = rect.height
      let position: TreeDropPosition
      if (row.hasChildren && y > h * 0.25 && y < h * 0.75) position = "inside"
      else position = y < h / 2 ? "before" : "after"
      setDropTarget({ id: row.node.id, position })
    },
    [dragId]
  )

  const onDropRow = React.useCallback(
    (row: FlatRow, e: React.DragEvent) => {
      e.preventDefault()
      if (dragId && dropTarget && dragId !== row.node.id) {
        onMove?.({
          dragId,
          targetId: dropTarget.id,
          position: dropTarget.position,
        })
      }
      setDragId(null)
      setDropTarget(null)
    },
    [dragId, dropTarget, onMove]
  )

  /* ---------------------------------------------------------------- render */

  return (
    <div
      role="tree"
      aria-multiselectable={
        selectionMode === "multiple" || selectionMode === "checkbox"
          ? true
          : undefined
      }
      onKeyDown={onKeyDown}
      className={cn("w-full text-foreground", className)}
      {...props}
    >
      {rows.map((row) => (
        <TreeRow
          key={row.node.id}
          row={row}
          indent={indent}
          indentGuides={indentGuides}
          selectionMode={selectionMode}
          focused={row.node.id === currentFocusId}
          selected={selectionMode !== "none" && selected.has(row.node.id)}
          checked={selectionMode === "checkbox" && selected.has(row.node.id)}
          indeterminate={
            selectionMode === "checkbox" &&
            computeIndeterminate(row.node, selected)
          }
          loading={loadingIds.has(row.node.id)}
          dropIndicator={
            dropTarget?.id === row.node.id ? dropTarget.position : null
          }
          draggable={draggable}
          getItemIcon={getItemIcon}
          renderLabel={renderLabel}
          renderActions={renderActions}
          onToggleExpand={(n) => void expandNode(n)}
          onSelect={(n, e) => selectNode(n, e)}
          onToggleCheck={toggleCheck}
          onFocusRow={(n) => setFocusedId(n.id)}
          registerRef={registerRef}
          onDragStart={(n) => setDragId(n.id)}
          onDragOverRow={onDragOverRow}
          onDropRow={onDropRow}
          onDragEnd={() => {
            setDragId(null)
            setDropTarget(null)
          }}
        />
      ))}
    </div>
  )
}

export { Tree, moveTreeNode, collectSubtreeIds }
export type {
  TreeProps,
  TreeNode,
  TreeSelectionMode,
  TreeDropPosition,
  TreeItemState,
}

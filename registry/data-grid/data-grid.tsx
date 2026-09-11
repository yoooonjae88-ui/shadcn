"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDownIcon,
  Columns2Icon,
  Loader2Icon,
  SearchIcon,
  XIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

export type SortDirection = "asc" | "desc"

export type SortState = {
  key: string
  direction: SortDirection
}

export type FilterState = Record<string, string>

export type CellCoord = {
  rowIndex: number
  columnKey: string
}

export type ColumnDef<TData = Record<string, unknown>> = {
  key: string
  header: string
  /** Fixed pixel width hint */
  width?: number
  minWidth?: number
  /** Whether this column is sortable. Defaults true when features.sorting is on. */
  sortable?: boolean
  /** Whether this column shows a filter input. Defaults true when features.filtering is on. */
  filterable?: boolean
  /** Whether this column allows double-click editing. Defaults true when features.inlineEdit is on. */
  editable?: boolean
  /**
   * When true the column starts hidden. The user can still reveal it via the
   * column-visibility panel (unless `hideable` is false).
   */
  defaultHidden?: boolean
  /**
   * When false the column is omitted from the column-visibility panel and
   * cannot be toggled by the user. Defaults true.
   */
  hideable?: boolean
  /** Static or dynamic className applied to every <td> in this column. */
  className?: string | ((value: unknown, row: TData, rowIndex: number) => string)
  /** className applied to the <th> element. */
  headerClassName?: string
  /** Custom read-only cell renderer. */
  cell?: (value: unknown, row: TData, rowIndex: number) => React.ReactNode
  /**
   * Custom edit-mode cell renderer.
   * When omitted a plain <input type="text"> is shown.
   */
  editCell?: (props: {
    value: unknown
    row: TData
    onChange: (value: unknown) => void
    onCommit: () => void
    onCancel: () => void
  }) => React.ReactNode
}

export type PaginationConfig = {
  /** Total record count (across all pages). */
  total: number
  skip: number
  take: number
  onPageChange: (skip: number, take: number) => void
}

export type DataGridFeatures = {
  /** Show a global search bar. */
  search?: boolean
  /** Show a column visibility chooser. */
  columnVisibility?: boolean
  /** Show per-column filter inputs below the header. */
  filtering?: boolean
  /** Make column headers clickable for sorting. */
  sorting?: boolean
  /** Show pagination controls. */
  pagination?: boolean
  /** Allow double-click inline cell editing. */
  inlineEdit?: boolean
  /** Row selection mode: "single", "multi", or false. */
  rowSelection?: "single" | "multi" | false
  /** Cell selection mode: "single", "multi", or false. */
  cellSelection?: "single" | "multi" | false
}

export type DataGridProps<TData = Record<string, unknown>> = {
  columns: ColumnDef<TData>[]
  data: TData[]
  /** Field used as a unique row identifier. Falls back to row index when omitted. */
  keyField?: string
  /** Toggle individual features. */
  features?: DataGridFeatures
  /**
   * When true the grid does NOT run client-side filter/sort — it treats `data`
   * as already processed and only fires the on* callbacks so the parent can
   * trigger a refetch.
   */
  serverSide?: boolean
  /** Provide when `features.pagination` is true for server-driven paging. */
  pagination?: PaginationConfig
  /** Fired when an inline edit is committed; receives the full updated dataset. */
  onDataChange?: (data: TData[]) => void
  /** Fired when the row selection changes. */
  onRowSelectionChange?: (rows: TData[], keys: string[]) => void
  /** Fired when the cell selection changes. */
  onCellSelectionChange?: (cells: CellCoord[]) => void
  /** Fired when sort state changes (useful for server-side sorting). */
  onSortChange?: (sort: SortState | null) => void
  /** Fired when a column filter changes (useful for server-side filtering). */
  onFilterChange?: (filters: FilterState) => void
  /** Fired when the global search text changes. */
  onSearchChange?: (search: string) => void
  /** className or function returning className applied to each <tr>. */
  rowClassName?: string | ((row: TData, index: number) => string)
  /** className or function returning className applied to each <td>. */
  cellClassName?: string | ((value: unknown, row: TData, index: number, key: string) => string)
  /** Render a loading spinner overlay. */
  loading?: boolean
  /** Shown when data is empty. */
  emptyMessage?: React.ReactNode
  /** Title displayed above the grid. */
  title?: React.ReactNode
  /** Element rendered to the right of the title (e.g. an action button). */
  headerAction?: React.ReactNode
  className?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRowKey<T>(row: T, keyField: string | undefined, index: number): string {
  if (keyField) {
    const v = (row as Record<string, unknown>)[keyField]
    if (v != null) return String(v)
  }
  return String(index)
}

function getCellValue<T>(row: T, key: string): unknown {
  return (row as Record<string, unknown>)[key]
}

function patchRow<T>(row: T, key: string, value: unknown): T {
  return { ...row, [key]: value } as T
}

function applyFilters<T>(
  rows: T[],
  columns: ColumnDef<T>[],
  filters: FilterState,
  search: string
): T[] {
  const s = search.trim().toLowerCase()
  return rows.filter((row) => {
    for (const col of columns) {
      const f = (filters[col.key] ?? "").trim()
      if (f) {
        const v = String(getCellValue(row, col.key) ?? "").toLowerCase()
        if (!v.includes(f.toLowerCase())) return false
      }
    }
    if (s) {
      const hit = columns.some((col) =>
        String(getCellValue(row, col.key) ?? "").toLowerCase().includes(s)
      )
      if (!hit) return false
    }
    return true
  })
}

function defaultColVis<T>(columns: ColumnDef<T>[]): Record<string, boolean> {
  return Object.fromEntries(columns.map((c) => [c.key, c.defaultHidden !== true]))
}

function applySort<T>(rows: T[], sort: SortState | null): T[] {
  if (!sort) return rows
  return [...rows].sort((a, b) => {
    const av = String(getCellValue(a, sort.key) ?? "")
    const bv = String(getCellValue(b, sort.key) ?? "")
    const cmp = av.localeCompare(bv, undefined, { numeric: true, sensitivity: "base" })
    return sort.direction === "asc" ? cmp : -cmp
  })
}

// ─── DataGrid ─────────────────────────────────────────────────────────────────

export function DataGrid<TData = Record<string, unknown>>({
  columns,
  data,
  keyField,
  features = {},
  serverSide = false,
  pagination,
  onDataChange,
  onRowSelectionChange,
  onCellSelectionChange,
  onSortChange,
  onFilterChange,
  onSearchChange,
  rowClassName,
  cellClassName,
  loading = false,
  emptyMessage = "No data",
  title,
  headerAction,
  className,
}: DataGridProps<TData>) {
  const {
    search: enableSearch = false,
    columnVisibility: enableColumnVisibility = false,
    filtering: enableFiltering = false,
    sorting: enableSorting = false,
    pagination: enablePagination = false,
    inlineEdit: enableInlineEdit = false,
    rowSelection = false,
    cellSelection = false,
  } = features

  // ── State ────────────────────────────────────────────────────────────────

  const [colVis, setColVis] = React.useState<Record<string, boolean>>(() =>
    defaultColVis(columns)
  )
  const [colPanelOpen, setColPanelOpen] = React.useState(false)
  const colPanelRef = React.useRef<HTMLDivElement>(null)

  const [sort, setSort] = React.useState<SortState | null>(null)
  const [filters, setFilters] = React.useState<FilterState>({})
  const [search, setSearch] = React.useState("")

  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())
  const [selectedCells, setSelectedCells] = React.useState<Set<string>>(new Set())

  const [activeEdit, setActiveEdit] = React.useState<{
    rowKey: string
    colKey: string
    value: unknown
  } | null>(null)

  const [localData, setLocalData] = React.useState<TData[]>(data)
  // Adopt a new `data` prop during render (the React-sanctioned alternative to
  // syncing props to state in an effect).
  const [prevData, setPrevData] = React.useState(data)
  if (prevData !== data) {
    setPrevData(data)
    setLocalData(data)
  }

  // Client-side pagination fallback
  const [clientSkip, setClientSkip] = React.useState(0)
  const [clientTake, setClientTake] = React.useState(25)

  // ── Derived ───────────────────────────────────────────────────────────────

  const visibleCols = React.useMemo(
    () => columns.filter((c) => colVis[c.key] !== false),
    [columns, colVis]
  )

  const processedData = React.useMemo(() => {
    if (serverSide) return localData
    return applySort(applyFilters(localData, columns, filters, search), sort)
  }, [serverSide, localData, columns, filters, search, sort])

  const paginationCfg = React.useMemo<PaginationConfig | null>(
    () =>
      enablePagination
        ? pagination ?? {
            total: processedData.length,
            skip: clientSkip,
            take: clientTake,
            onPageChange(skip, take) {
              setClientSkip(skip)
              setClientTake(take)
            },
          }
        : null,
    [enablePagination, pagination, processedData.length, clientSkip, clientTake]
  )

  const displayData = React.useMemo(() => {
    if (!paginationCfg) return processedData
    if (serverSide) return processedData
    return processedData.slice(paginationCfg.skip, paginationCfg.skip + paginationCfg.take)
  }, [processedData, paginationCfg, serverSide])

  // ── Column panel close on outside click ──────────────────────────────────

  React.useEffect(() => {
    if (!colPanelOpen) return
    const handler = (e: MouseEvent) => {
      if (!colPanelRef.current?.contains(e.target as Node)) setColPanelOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [colPanelOpen])

  // ── Event helpers ─────────────────────────────────────────────────────────

  function updateRowSelection(next: Set<string>) {
    setSelectedRows(next)
    if (!onRowSelectionChange) return
    const arr = Array.from(next)
    const rows = arr.flatMap((k) => {
      const found = localData.find((r, i) => getRowKey(r, keyField, i) === k)
      return found ? [found] : []
    })
    onRowSelectionChange(rows, arr)
  }

  function updateCellSelection(next: Set<string>) {
    setSelectedCells(next)
    if (!onCellSelectionChange) return
    const coords: CellCoord[] = Array.from(next).map((k) => {
      const sep = k.indexOf(":")
      return { rowIndex: parseInt(k.slice(0, sep)), columnKey: k.slice(sep + 1) }
    })
    onCellSelectionChange(coords)
  }

  // ── Sort ──────────────────────────────────────────────────────────────────

  function handleSort(key: string) {
    const next: SortState | null =
      sort?.key !== key
        ? { key, direction: "asc" }
        : sort.direction === "asc"
        ? { key, direction: "desc" }
        : null
    setSort(next)
    onSortChange?.(next)
  }

  // ── Filter ────────────────────────────────────────────────────────────────

  function handleFilter(key: string, value: string) {
    setFilters((prev) => {
      const next = { ...prev, [key]: value }
      onFilterChange?.(next)
      return next
    })
  }

  // ── Search ────────────────────────────────────────────────────────────────

  function handleSearch(value: string) {
    setSearch(value)
    onSearchChange?.(value)
  }

  // ── Row selection ─────────────────────────────────────────────────────────

  function handleRowClick(rk: string, e: React.MouseEvent) {
    if (!rowSelection) return
    // Ignore 2nd click in a double-click so inline edit can start cleanly
    if (e.detail > 1) return
    const was = selectedRows.has(rk)
    if (rowSelection === "single") {
      updateRowSelection(was ? new Set<string>() : new Set([rk]))
    } else if (e.ctrlKey || e.metaKey) {
      const next = new Set(selectedRows)
      if (was) next.delete(rk)
      else next.add(rk)
      updateRowSelection(next)
    } else if (e.shiftKey) {
      const keys = displayData.map((r, i) => getRowKey(r, keyField, i))
      const lastIdx = keys.reduce((acc, k, i) => (selectedRows.has(k) ? i : acc), -1)
      const curIdx = keys.indexOf(rk)
      if (lastIdx !== -1 && curIdx !== -1) {
        const [lo, hi] = [Math.min(lastIdx, curIdx), Math.max(lastIdx, curIdx)]
        const next = new Set(selectedRows)
        for (let j = lo; j <= hi; j++) next.add(keys[j])
        updateRowSelection(next)
      }
    } else {
      updateRowSelection(
        was && selectedRows.size === 1 ? new Set<string>() : new Set([rk])
      )
    }
  }

  function handleRowCheckbox(rk: string, checked: boolean) {
    const next = rowSelection === "multi" ? new Set(selectedRows) : new Set<string>()
    if (checked) next.add(rk)
    else next.delete(rk)
    updateRowSelection(next)
  }

  function handleSelectAll(checked: boolean) {
    if (rowSelection !== "multi") return
    updateRowSelection(
      checked
        ? new Set(displayData.map((r, i) => getRowKey(r, keyField, i)))
        : new Set<string>()
    )
  }

  // ── Cell selection ────────────────────────────────────────────────────────

  function handleCellClick(ri: number, ck: string, e: React.MouseEvent) {
    if (!cellSelection) return
    const key = `${ri}:${ck}`
    if (cellSelection === "single") {
      updateCellSelection(new Set([key]))
    } else {
      const base = e.ctrlKey || e.metaKey ? new Set(selectedCells) : new Set<string>()
      if (base.has(key) && (e.ctrlKey || e.metaKey)) base.delete(key)
      else base.add(key)
      updateCellSelection(base)
    }
  }

  // ── Inline edit ───────────────────────────────────────────────────────────

  function handleCellDblClick(rk: string, ck: string, value: unknown) {
    if (!enableInlineEdit) return
    const col = columns.find((c) => c.key === ck)
    if (col?.editable === false) return
    setActiveEdit({ rowKey: rk, colKey: ck, value })
  }

  function handleCommit() {
    if (!activeEdit) return
    const { rowKey: rk, colKey: ck, value } = activeEdit
    setLocalData((prev) => {
      const next = prev.map((r, i) =>
        getRowKey(r, keyField, i) === rk ? patchRow(r, ck, value) : r
      )
      onDataChange?.(next)
      return next
    })
    setActiveEdit(null)
  }

  function handleCancelEdit() {
    setActiveEdit(null)
  }

  // ── Computed flags ────────────────────────────────────────────────────────

  const hasCheckboxCol = rowSelection === "single" || rowSelection === "multi"
  const hasFilterRow = enableFiltering && columns.some((c) => c.filterable !== false)
  const totalCols = visibleCols.length + (hasCheckboxCol ? 1 : 0)
  const hasToolbar = enableSearch || enableColumnVisibility

  const allSelected =
    rowSelection === "multi" &&
    displayData.length > 0 &&
    displayData.every((r, i) => selectedRows.has(getRowKey(r, keyField, i)))

  const someSelected =
    rowSelection === "multi" &&
    !allSelected &&
    displayData.some((r, i) => selectedRows.has(getRowKey(r, keyField, i)))

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Header */}
      {(title || headerAction) && (
        <div className="flex items-center justify-between gap-2">
          {title && (
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
          )}
          {headerAction && <div className="ml-auto">{headerAction}</div>}
        </div>
      )}

      {/* Toolbar */}
      {hasToolbar && (
        <div className="flex items-center gap-2">
          {enableSearch && (
            <div className="relative max-w-xs flex-1">
              <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search…"
                className="flex h-8 w-full rounded-lg bg-input-background py-1 pl-8 pr-8 text-sm outline-none placeholder:text-muted-foreground transition-colors focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              {search && (
                <button
                  onClick={() => handleSearch("")}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <XIcon className="size-3.5" />
                </button>
              )}
            </div>
          )}

          {enableColumnVisibility && (
            <div className="relative ml-auto" ref={colPanelRef}>
              <button
                onClick={() => setColPanelOpen((o) => !o)}
                aria-haspopup="true"
                aria-expanded={colPanelOpen}
                className={cn(
                  "flex h-8 items-center gap-1.5 rounded-lg bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted",
                  colPanelOpen && "bg-muted"
                )}
              >
                <Columns2Icon className="size-4" />
                Columns
              </button>

              {colPanelOpen && (
                <div className="absolute right-0 top-9 z-50 min-w-44 rounded-lg bg-popover p-1.5 shadow-md">
                  <div className="mb-0.5 flex items-center justify-between px-2 py-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Columns
                    </span>
                    <button
                      onClick={() => setColVis(defaultColVis(columns))}
                      className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Reset
                    </button>
                  </div>
                  {columns.filter((col) => col.hideable !== false).map((col) => (
                    <label
                      key={col.key}
                      className="flex cursor-pointer select-none items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                    >
                      <input
                        type="checkbox"
                        checked={colVis[col.key] !== false}
                        onChange={(e) =>
                          setColVis((prev) => ({ ...prev, [col.key]: e.target.checked }))
                        }
                        className="size-4 rounded accent-primary"
                      />
                      {col.header}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="relative overflow-hidden rounded-lg">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur-[1px]">
            <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}

        <div className="overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-[1] bg-muted/60 backdrop-blur-sm">
              {/* Column headers */}
              <tr>
                {hasCheckboxCol && (
                  <th className="w-10 px-3 py-2.5 text-left font-medium">
                    {rowSelection === "multi" && (
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = someSelected
                        }}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        aria-label="Select all rows"
                        className="size-4 cursor-pointer rounded accent-primary"
                      />
                    )}
                  </th>
                )}
                {visibleCols.map((col) => (
                  <th
                    key={col.key}
                    style={{ width: col.width, minWidth: col.minWidth }}
                    className={cn(
                      "px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap",
                      col.headerClassName
                    )}
                  >
                    {enableSorting && col.sortable !== false ? (
                      <button
                        onClick={() => handleSort(col.key)}
                        className="group/sort inline-flex items-center gap-1 outline-none transition-colors hover:text-foreground focus-visible:underline"
                      >
                        <span>{col.header}</span>
                        {sort?.key === col.key ? (
                          sort.direction === "asc" ? (
                            <ChevronUpIcon className="size-3.5" />
                          ) : (
                            <ChevronDownIcon className="size-3.5" />
                          )
                        ) : (
                          <ChevronsUpDownIcon className="size-3.5 opacity-0 transition-opacity group-hover/sort:opacity-60" />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                ))}
              </tr>

              {/* Filter row */}
              {hasFilterRow && (
                <tr className="bg-background/60">
                  {hasCheckboxCol && <th className="px-2 py-1.5" />}
                  {visibleCols.map((col) => (
                    <th key={col.key} className="px-2 py-1.5 font-normal">
                      {col.filterable !== false && (
                        <div className="relative">
                          <input
                            type="text"
                            value={filters[col.key] ?? ""}
                            onChange={(e) => handleFilter(col.key, e.target.value)}
                            placeholder="Filter…"
                            className="h-6 w-full rounded-md bg-input-background px-2 pr-6 text-xs placeholder:text-muted-foreground outline-none transition-colors focus:ring-2 focus:ring-ring/50"
                          />
                          {filters[col.key] && (
                            <button
                              onClick={() => handleFilter(col.key, "")}
                              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              <XIcon className="size-2.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              )}
            </thead>

            <tbody>
              {displayData.length === 0 && !loading ? (
                <tr>
                  <td
                    colSpan={totalCols}
                    className="px-3 py-16 text-center text-sm text-muted-foreground"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                displayData.map((row, ri) => {
                  const rk = getRowKey(row, keyField, ri)
                  const isRowSel = selectedRows.has(rk)
                  const resolvedRowCls =
                    typeof rowClassName === "function" ? rowClassName(row, ri) : rowClassName

                  return (
                    <tr
                      key={rk}
                      onClick={(e) => handleRowClick(rk, e)}
                      data-selected={isRowSel || undefined}
                      className={cn(
                        "transition-colors",
                        rowSelection !== false && "cursor-pointer select-none",
                        isRowSel ? "bg-primary/10 hover:bg-primary/15" : "hover:bg-muted/40",
                        resolvedRowCls
                      )}
                    >
                      {/* Checkbox cell */}
                      {hasCheckboxCol && (
                        <td
                          className="w-10 px-3 py-2.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isRowSel}
                            onChange={(e) => handleRowCheckbox(rk, e.target.checked)}
                            className="size-4 cursor-pointer rounded accent-primary"
                          />
                        </td>
                      )}

                      {/* Data cells */}
                      {visibleCols.map((col) => {
                        const val = getCellValue(row, col.key)
                        const cellId = `${ri}:${col.key}`
                        const isCellSel = selectedCells.has(cellId)
                        const isEditing =
                          activeEdit?.rowKey === rk && activeEdit?.colKey === col.key

                        const resolvedColCls =
                          typeof col.className === "function"
                            ? col.className(val, row, ri)
                            : col.className
                        const resolvedCellCls =
                          typeof cellClassName === "function"
                            ? cellClassName(val, row, ri, col.key)
                            : cellClassName

                        return (
                          <td
                            key={col.key}
                            onClick={(e) => handleCellClick(ri, col.key, e)}
                            onDoubleClick={() => handleCellDblClick(rk, col.key, val)}
                            data-cell-selected={isCellSel || undefined}
                            className={cn(
                              "max-w-xs whitespace-nowrap px-3 py-2",
                              cellSelection !== false && "cursor-pointer",
                              isEditing && "p-1",
                              isCellSel &&
                                "bg-primary/5 ring-2 ring-inset ring-primary/50",
                              resolvedColCls,
                              resolvedCellCls
                            )}
                          >
                            {isEditing ? (
                              col.editCell ? (
                                col.editCell({
                                  value: activeEdit.value,
                                  row,
                                  onChange: (v) =>
                                    setActiveEdit((p) => (p ? { ...p, value: v } : p)),
                                  onCommit: handleCommit,
                                  onCancel: handleCancelEdit,
                                })
                              ) : (
                                <input
                                  autoFocus
                                  type="text"
                                  value={String(activeEdit.value ?? "")}
                                  onChange={(e) =>
                                    setActiveEdit((p) =>
                                      p ? { ...p, value: e.target.value } : p
                                    )
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleCommit()
                                    if (e.key === "Escape") handleCancelEdit()
                                  }}
                                  onBlur={handleCommit}
                                  className="h-7 w-full min-w-20 rounded-md border border-ring bg-input-background px-2 text-sm outline-none ring-2 ring-ring/50"
                                />
                              )
                            ) : col.cell ? (
                              col.cell(val, row, ri)
                            ) : (
                              <span className="block truncate">{String(val ?? "")}</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {enablePagination && paginationCfg && <DataGridPagination {...paginationCfg} />}
    </div>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────

const PAGE_SIZES = [10, 25, 50, 100] as const

function DataGridPagination({ total, skip, take, onPageChange }: PaginationConfig) {
  const page = Math.floor(skip / take)
  const pageCount = Math.max(1, Math.ceil(total / take))
  const from = total === 0 ? 0 : skip + 1
  const to = Math.min(skip + take, total)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-sm text-muted-foreground">
      <span>
        {from}–{to} of {total} row{total !== 1 ? "s" : ""}
      </span>

      <div className="flex items-center gap-1">
        <PagBtn
          onClick={() => onPageChange(0, take)}
          disabled={page === 0}
          aria-label="First page"
        >
          <ChevronsLeftIcon className="size-4" />
        </PagBtn>
        <PagBtn
          onClick={() => onPageChange(Math.max(0, skip - take), take)}
          disabled={page === 0}
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="size-4" />
        </PagBtn>
        <span className="min-w-[6ch] text-center text-xs font-medium text-foreground">
          {page + 1} / {pageCount}
        </span>
        <PagBtn
          onClick={() => onPageChange(skip + take, take)}
          disabled={page >= pageCount - 1}
          aria-label="Next page"
        >
          <ChevronRightIcon className="size-4" />
        </PagBtn>
        <PagBtn
          onClick={() => onPageChange((pageCount - 1) * take, take)}
          disabled={page >= pageCount - 1}
          aria-label="Last page"
        >
          <ChevronsRightIcon className="size-4" />
        </PagBtn>
      </div>

      <select
        value={take}
        onChange={(e) => onPageChange(0, Number(e.target.value))}
        aria-label="Rows per page"
        className="h-7 cursor-pointer rounded-md bg-input-background px-2 text-xs outline-none transition-colors focus:ring-2 focus:ring-ring/50"
      >
        {PAGE_SIZES.map((s) => (
          <option key={s} value={s}>
            {s} / page
          </option>
        ))}
      </select>
    </div>
  )
}

function PagBtn({ children, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      className="inline-flex size-7 items-center justify-center rounded-md bg-background transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
      {...props}
    >
      {children}
    </button>
  )
}

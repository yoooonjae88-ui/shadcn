"use client"

import * as React from "react"

import type { CellCoord, FilterState, SortState } from "./data-grid"

// ─── Types ────────────────────────────────────────────────────────────────────

export type DataGridState = {
  sort: SortState | null
  filters: FilterState
  search: string
  skip: number
  take: number
  selectedRowKeys: string[]
  selectedCells: CellCoord[]
}

export type UseDataGridOptions = {
  /** Initial page size. Defaults to 25. */
  defaultTake?: number
  /** Initial sort state. */
  defaultSort?: SortState | null
}

export type UseDataGridReturn = {
  /** Full snapshot of all grid state — pass to your data-fetching hook. */
  state: DataGridState

  sort: SortState | null
  filters: FilterState
  search: string
  skip: number
  take: number
  selectedRowKeys: string[]
  selectedCells: CellCoord[]

  /** Pass as DataGrid onSortChange — also resets to page 1. */
  onSortChange: (sort: SortState | null) => void
  /** Pass as DataGrid onFilterChange — also resets to page 1. */
  onFilterChange: (filters: FilterState) => void
  /** Pass as DataGrid onSearchChange — also resets to page 1. */
  onSearchChange: (search: string) => void
  /** Pass as DataGrid pagination.onPageChange. */
  onPageChange: (skip: number, take: number) => void
  /** Pass as DataGrid onRowSelectionChange. */
  onRowSelectionChange: (rows: unknown[], keys: string[]) => void
  /** Pass as DataGrid onCellSelectionChange. */
  onCellSelectionChange: (cells: CellCoord[]) => void

  /** Reset all state to defaults. */
  reset: () => void
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Convenience hook that manages the external/server-side state for a DataGrid.
 *
 * Usage:
 * ```tsx
 * const grid = useDataGrid({ defaultTake: 20 })
 * const { data } = useSWR(["/api/users", grid.state], fetchUsers)
 *
 * return (
 *   <DataGrid
 *     data={data.rows}
 *     columns={columns}
 *     serverSide
 *     features={{ sorting: true, filtering: true, pagination: true }}
 *     pagination={{ total: data.total, skip: grid.skip, take: grid.take, onPageChange: grid.onPageChange }}
 *     onSortChange={grid.onSortChange}
 *     onFilterChange={grid.onFilterChange}
 *     onSearchChange={grid.onSearchChange}
 *     onRowSelectionChange={grid.onRowSelectionChange}
 *   />
 * )
 * ```
 */
export function useDataGrid(options: UseDataGridOptions = {}): UseDataGridReturn {
  const { defaultTake = 25, defaultSort = null } = options

  const [sort, setSort] = React.useState<SortState | null>(defaultSort)
  const [filters, setFilters] = React.useState<FilterState>({})
  const [search, setSearch] = React.useState("")
  const [skip, setSkip] = React.useState(0)
  const [take, setTake] = React.useState(defaultTake)
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<string[]>([])
  const [selectedCells, setSelectedCells] = React.useState<CellCoord[]>([])

  function onSortChange(s: SortState | null) {
    setSort(s)
    setSkip(0)
  }

  function onFilterChange(f: FilterState) {
    setFilters(f)
    setSkip(0)
  }

  function onSearchChange(s: string) {
    setSearch(s)
    setSkip(0)
  }

  function onPageChange(newSkip: number, newTake: number) {
    setSkip(newSkip)
    setTake(newTake)
  }

  function onRowSelectionChange(_rows: unknown[], keys: string[]) {
    setSelectedRowKeys(keys)
  }

  function onCellSelectionChange(cells: CellCoord[]) {
    setSelectedCells(cells)
  }

  function reset() {
    setSort(defaultSort)
    setFilters({})
    setSearch("")
    setSkip(0)
    setTake(defaultTake)
    setSelectedRowKeys([])
    setSelectedCells([])
  }

  const state: DataGridState = {
    sort,
    filters,
    search,
    skip,
    take,
    selectedRowKeys,
    selectedCells,
  }

  return {
    state,
    sort,
    filters,
    search,
    skip,
    take,
    selectedRowKeys,
    selectedCells,
    onSortChange,
    onFilterChange,
    onSearchChange,
    onPageChange,
    onRowSelectionChange,
    onCellSelectionChange,
    reset,
  }
}

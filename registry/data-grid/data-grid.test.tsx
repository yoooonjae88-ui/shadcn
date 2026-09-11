import { act, render, screen, within } from "@testing-library/react"
import { renderHook } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { DataGrid, type ColumnDef } from "@/registry/data-grid/data-grid"
import { useDataGrid } from "@/registry/data-grid/use-data-grid"

type Row = { id: number; name: string; role: string }

const columns: ColumnDef<Row>[] = [
  { key: "name", header: "Name" },
  { key: "role", header: "Role" },
]

const data: Row[] = [
  { id: 1, name: "Ada", role: "Engineer" },
  { id: 2, name: "Bob", role: "Designer" },
  { id: 3, name: "Cleo", role: "Engineer" },
]

describe("DataGrid", () => {
  it("renders headers and rows", () => {
    render(<DataGrid columns={columns} data={data} keyField="id" />)
    expect(screen.getByRole("table")).toBeInTheDocument()
    expect(screen.getByText("Name")).toBeInTheDocument()
    expect(screen.getByText("Ada")).toBeInTheDocument()
    expect(screen.getByText("Designer")).toBeInTheDocument()
  })

  it("shows the empty message with no data", () => {
    render(
      <DataGrid
        columns={columns}
        data={[]}
        emptyMessage="Nothing here"
      />
    )
    expect(screen.getByText("Nothing here")).toBeInTheDocument()
  })

  it("sorts by column, cycling asc → desc → none", async () => {
    const user = userEvent.setup()
    const onSortChange = vi.fn()
    render(
      <DataGrid
        columns={columns}
        data={data}
        keyField="id"
        features={{ sorting: true }}
        onSortChange={onSortChange}
      />
    )

    const nameHeader = screen.getByRole("button", { name: "Name" })
    const firstCell = () =>
      within(screen.getAllByRole("row")[1]).getAllByRole("cell")[0]

    await user.click(nameHeader)
    expect(onSortChange).toHaveBeenLastCalledWith({
      key: "name",
      direction: "asc",
    })
    expect(firstCell()).toHaveTextContent("Ada")

    await user.click(nameHeader)
    expect(onSortChange).toHaveBeenLastCalledWith({
      key: "name",
      direction: "desc",
    })
    expect(firstCell()).toHaveTextContent("Cleo")

    await user.click(nameHeader)
    expect(onSortChange).toHaveBeenLastCalledWith(null)
  })

  it("filters rows with the global search", async () => {
    const user = userEvent.setup()
    render(
      <DataGrid
        columns={columns}
        data={data}
        keyField="id"
        features={{ search: true }}
      />
    )

    await user.type(screen.getByPlaceholderText("Search…"), "engineer")
    expect(screen.getByText("Ada")).toBeInTheDocument()
    expect(screen.getByText("Cleo")).toBeInTheDocument()
    expect(screen.queryByText("Bob")).not.toBeInTheDocument()
  })

  it("filters rows with per-column filters", async () => {
    const user = userEvent.setup()
    render(
      <DataGrid
        columns={columns}
        data={data}
        keyField="id"
        features={{ filtering: true }}
      />
    )

    const [nameFilter] = screen.getAllByPlaceholderText("Filter…")
    await user.type(nameFilter, "bo")
    expect(screen.getByText("Bob")).toBeInTheDocument()
    expect(screen.queryByText("Ada")).not.toBeInTheDocument()
  })

  it("selects rows and reports keys", async () => {
    const user = userEvent.setup()
    const onRowSelectionChange = vi.fn()
    render(
      <DataGrid
        columns={columns}
        data={data}
        keyField="id"
        features={{ rowSelection: "multi" }}
        onRowSelectionChange={onRowSelectionChange}
      />
    )

    await user.click(screen.getByText("Ada"))
    expect(onRowSelectionChange).toHaveBeenLastCalledWith(
      [data[0]],
      ["1"]
    )

    await user.click(screen.getByLabelText("Select all rows"))
    expect(onRowSelectionChange.mock.lastCall?.[1]).toEqual(["1", "2", "3"])
  })

  it("adopts a new data prop", () => {
    const { rerender } = render(
      <DataGrid columns={columns} data={data} keyField="id" />
    )
    rerender(
      <DataGrid
        columns={columns}
        data={[{ id: 9, name: "Zoe", role: "PM" }]}
        keyField="id"
      />
    )
    expect(screen.getByText("Zoe")).toBeInTheDocument()
    expect(screen.queryByText("Ada")).not.toBeInTheDocument()
  })

  it("paginates client-side", () => {
    const many = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      role: "x",
    }))
    render(
      <DataGrid
        columns={columns}
        data={many}
        keyField="id"
        features={{ pagination: true }}
      />
    )
    // Default page size is 25.
    expect(screen.getByText("User 1")).toBeInTheDocument()
    expect(screen.queryByText("User 26")).not.toBeInTheDocument()
    expect(screen.getByLabelText("Next page")).toBeEnabled()
  })
})

describe("useDataGrid", () => {
  it("exposes defaults and resets paging on sort/filter/search", () => {
    const { result } = renderHook(() => useDataGrid({ defaultTake: 10 }))

    expect(result.current.state).toMatchObject({
      sort: null,
      filters: {},
      search: "",
      skip: 0,
      take: 10,
    })

    act(() => result.current.onPageChange(20, 10))
    expect(result.current.skip).toBe(20)

    act(() => result.current.onSortChange({ key: "name", direction: "asc" }))
    expect(result.current.sort).toEqual({ key: "name", direction: "asc" })
    expect(result.current.skip).toBe(0)

    act(() => result.current.onPageChange(20, 10))
    act(() => result.current.onSearchChange("ada"))
    expect(result.current.search).toBe("ada")
    expect(result.current.skip).toBe(0)
  })

  it("tracks selection and resets everything", () => {
    const { result } = renderHook(() =>
      useDataGrid({ defaultSort: { key: "id", direction: "desc" } })
    )

    act(() => result.current.onRowSelectionChange([], ["1", "2"]))
    act(() =>
      result.current.onCellSelectionChange([{ rowIndex: 0, columnKey: "name" }])
    )
    expect(result.current.selectedRowKeys).toEqual(["1", "2"])
    expect(result.current.selectedCells).toHaveLength(1)

    act(() => result.current.reset())
    expect(result.current.selectedRowKeys).toEqual([])
    expect(result.current.selectedCells).toEqual([])
    expect(result.current.sort).toEqual({ key: "id", direction: "desc" })
  })
})

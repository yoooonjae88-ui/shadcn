import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it } from "vitest"

import {
  WidgetBoard,
  WidgetCanvas,
  WidgetCard,
  WidgetTrash,
  useWidgetBoard,
} from "@/registry/widget-board/widget-board"

// jsdom has no real DataTransfer; a minimal stub covers what the drag
// handlers touch (setData / effectAllowed / setDragImage).
function mockDataTransfer() {
  return {
    setData: () => {},
    getData: () => "",
    setDragImage: () => {},
    effectAllowed: "",
    dropEffect: "",
    types: [] as string[],
  }
}

afterEach(() => {
  localStorage.clear()
})

describe("useWidgetBoard", () => {
  it("seeds from initial and reports hydrated after mount", () => {
    const { result } = renderHook(() =>
      useWidgetBoard({
        storageKey: "test-board",
        initial: [{ id: "a", type: "clock" }],
      })
    )
    expect(result.current.hydrated).toBe(true)
    expect(result.current.widgets).toEqual([{ id: "a", type: "clock" }])
  })

  it("adds, moves and removes widgets", () => {
    const { result } = renderHook(() =>
      useWidgetBoard({ storageKey: "test-board" })
    )

    act(() => result.current.addWidget("clock"))
    act(() => result.current.addWidget("weather"))
    expect(result.current.widgets.map((w) => w.type)).toEqual([
      "clock",
      "weather",
    ])

    const clockId = result.current.widgets[0].id
    act(() => result.current.moveWidget(clockId, 2))
    expect(result.current.widgets.map((w) => w.type)).toEqual([
      "weather",
      "clock",
    ])

    act(() => result.current.removeWidget(clockId))
    expect(result.current.widgets.map((w) => w.type)).toEqual(["weather"])
  })

  it("inserts at a specific index", () => {
    const { result } = renderHook(() =>
      useWidgetBoard({ storageKey: "test-board" })
    )
    act(() => result.current.addWidget("a"))
    act(() => result.current.addWidget("b"))
    act(() => result.current.addWidget("middle", 1))
    expect(result.current.widgets.map((w) => w.type)).toEqual([
      "a",
      "middle",
      "b",
    ])
  })

  it("persists to localStorage and rehydrates from it", () => {
    const first = renderHook(() =>
      useWidgetBoard({ storageKey: "persist-board" })
    )
    act(() => first.result.current.addWidget("clock"))
    first.unmount()

    const second = renderHook(() =>
      useWidgetBoard({ storageKey: "persist-board" })
    )
    expect(second.result.current.widgets.map((w) => w.type)).toEqual(["clock"])
  })

  it("clear empties the board; reset restores the initial layout", () => {
    const initial = [{ id: "a", type: "clock" }]
    const { result } = renderHook(() =>
      useWidgetBoard({ storageKey: "test-board", initial })
    )

    act(() => result.current.clear())
    expect(result.current.widgets).toEqual([])

    act(() => result.current.reset())
    expect(result.current.widgets).toEqual(initial)
  })
})

describe("WidgetBoard", () => {
  function Board() {
    const board = useWidgetBoard({
      storageKey: "render-board",
      initial: [{ id: "w1", type: "clock" }],
    })
    return (
      <WidgetBoard board={board}>
        <WidgetCanvas>
          {board.widgets.map((widget, index) => (
            <WidgetCard key={widget.id} widget={widget} index={index} title="Clock">
              body
            </WidgetCard>
          ))}
        </WidgetCanvas>
      </WidgetBoard>
    )
  }

  it("renders the widgets on the canvas", () => {
    render(<Board />)
    expect(screen.getByText("Clock")).toBeInTheDocument()
    expect(
      document.querySelector("[data-slot='widget-card']")
    ).toBeInTheDocument()
  })

  it("removes a widget via its close button", async () => {
    const user = userEvent.setup()
    render(<Board />)

    await user.click(screen.getByRole("button", { name: "Remove widget" }))
    expect(
      document.querySelector("[data-slot='widget-card']")
    ).not.toBeInTheDocument()
    expect(screen.getByText("Your dashboard is empty")).toBeInTheDocument()
  })
})

describe("WidgetTrash", () => {
  function TrashBoard() {
    const board = useWidgetBoard({
      storageKey: "trash-board",
      initial: [{ id: "w1", type: "clock" }],
    })
    return (
      <WidgetBoard board={board}>
        <WidgetCanvas>
          {board.widgets.map((widget, index) => (
            <WidgetCard key={widget.id} widget={widget} index={index} title="Clock">
              body
            </WidgetCard>
          ))}
        </WidgetCanvas>
        <WidgetTrash />
      </WidgetBoard>
    )
  }

  it("keeps the active label while the pointer moves over its children", () => {
    render(<TrashBoard />)

    // Start moving an existing widget so the trash arms.
    const handle = document.querySelector("[data-slot='widget-drag-handle']")!
    fireEvent.dragStart(handle, { dataTransfer: mockDataTransfer() })

    const trash = document.querySelector("[data-slot='widget-trash']")!
    expect(screen.getByText("Drop to remove")).toBeInTheDocument()

    // Enter the trash zone.
    fireEvent.dragEnter(trash)
    expect(screen.getByText("Release to delete")).toBeInTheDocument()

    // Crossing onto a child fires dragenter on the child (which bubbles to the
    // trash) then dragleave on the trash — the label must stay armed instead
    // of flickering back to the idle text.
    fireEvent.dragEnter(screen.getByText("Release to delete"))
    fireEvent.dragLeave(trash)
    expect(screen.getByText("Release to delete")).toBeInTheDocument()

    // Truly leaving the trash restores the idle label.
    fireEvent.dragLeave(trash)
    expect(screen.getByText("Drop to remove")).toBeInTheDocument()
  })
})

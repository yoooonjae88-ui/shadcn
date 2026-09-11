import { fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { Splitter, SplitterPanel } from "@/registry/splitter/splitter"

// jsdom does no layout, so container measurements are 0 — these tests cover
// structure and the a11y contract; drag behaviour is exercised in the browser.
function renderSplitter(
  props: Partial<React.ComponentProps<typeof Splitter>> = {}
) {
  return render(
    <Splitter {...props}>
      <SplitterPanel>Left</SplitterPanel>
      <SplitterPanel>Right</SplitterPanel>
    </Splitter>
  )
}

describe("Splitter", () => {
  it("renders both panels", () => {
    renderSplitter()
    expect(screen.getByText("Left")).toBeInTheDocument()
    expect(screen.getByText("Right")).toBeInTheDocument()
    expect(
      document.querySelectorAll("[data-slot='splitter-panel']")
    ).toHaveLength(2)
  })

  it("renders one separator bar between two panels", () => {
    renderSplitter()
    const bars = screen.getAllByRole("separator")
    expect(bars).toHaveLength(1)
    // Horizontal layout → the bar itself is a vertical divider.
    expect(bars[0]).toHaveAttribute("aria-orientation", "vertical")
    expect(bars[0]).toHaveAttribute("aria-valuemin", "0")
    expect(bars[0]).toHaveAttribute("aria-valuemax", "100")
  })

  it("renders n-1 bars for n panels", () => {
    render(
      <Splitter>
        <SplitterPanel>A</SplitterPanel>
        <SplitterPanel>B</SplitterPanel>
        <SplitterPanel>C</SplitterPanel>
      </Splitter>
    )
    expect(screen.getAllByRole("separator")).toHaveLength(2)
  })

  it("flips the bar orientation in vertical layout", () => {
    renderSplitter({ layout: "vertical" })
    expect(screen.getByRole("separator")).toHaveAttribute(
      "aria-orientation",
      "horizontal"
    )
  })

  describe("with a measured container", () => {
    // The splitter reads offsetWidth to size its panels; jsdom always
    // reports 0, so give it a real width for these tests.
    beforeEach(() => {
      Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        configurable: true,
        get() {
          return 402
        },
      })
    })

    afterEach(() => {
      // @ts-expect-error restore jsdom's default (no own getter)
      delete HTMLElement.prototype.offsetWidth
    })

    it("makes resizable bars focusable", () => {
      renderSplitter()
      expect(screen.getByRole("separator")).toHaveAttribute("tabindex", "0")
    })

    it("removes the bar from the tab order when panels are not resizable", () => {
      render(
        <Splitter>
          <SplitterPanel resizable={false}>Left</SplitterPanel>
          <SplitterPanel resizable={false}>Right</SplitterPanel>
        </Splitter>
      )
      expect(screen.getByRole("separator")).not.toHaveAttribute("tabindex")
    })

    it("resizes the pair with arrow keys and reports pixel sizes", () => {
      const onResize = vi.fn()
      render(
        <Splitter onResize={onResize}>
          <SplitterPanel>Left</SplitterPanel>
          <SplitterPanel>Right</SplitterPanel>
        </Splitter>
      )

      fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowRight" })
      expect(onResize).toHaveBeenCalled()
      const sizes = onResize.mock.lastCall?.[0] as number[]
      // 400px of panel space split evenly, then moved 10px to the right.
      expect(sizes[0]).toBeCloseTo(210)
      expect(sizes[1]).toBeCloseTo(190)
    })
  })

  it("exposes SplitterPanel as Splitter.Panel", () => {
    expect(Splitter.Panel).toBe(SplitterPanel)
  })

  it("renders a standalone panel as a plain scrollable div", () => {
    render(<SplitterPanel data-testid="panel">Alone</SplitterPanel>)
    expect(screen.getByTestId("panel")).toHaveClass("overflow-auto")
  })
})

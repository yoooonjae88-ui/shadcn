import * as React from "react"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { FloatButton } from "@/registry/float-button/float-button"

const corner = () =>
  document.querySelector("[data-slot='badge-corner']") as HTMLElement

describe("FloatButton", () => {
  it("renders a button pinned to the bottom-right by default", () => {
    render(<FloatButton aria-label="Help" />)

    const button = screen.getByRole("button", { name: "Help" })
    expect(button).toHaveAttribute("type", "button")

    const anchor = document.querySelector<HTMLElement>(
      "[data-slot='float-button-anchor']"
    )
    expect(anchor).toHaveStyle({ position: "fixed", bottom: "24px", right: "24px" })
  })

  it("honours corner, offset and position", () => {
    render(
      <FloatButton
        aria-label="Help"
        position="absolute"
        corner="top-left"
        offset={{ x: 8, y: 12 }}
      />
    )

    const anchor = document.querySelector<HTMLElement>(
      "[data-slot='float-button-anchor']"
    )
    expect(anchor).toHaveStyle({ position: "absolute", top: "12px", left: "8px" })
  })

  it("renders a link when given an href", () => {
    render(<FloatButton aria-label="Docs" href="/docs" target="_blank" />)

    const link = screen.getByRole("link", { name: "Docs" })
    expect(link).toHaveAttribute("href", "/docs")
    expect(link).toHaveAttribute("rel", "noreferrer")
  })

  it("shows a description only on square buttons", () => {
    const { rerender } = render(
      <FloatButton aria-label="Help" description="Help" />
    )
    expect(screen.queryByText("Help")).not.toBeInTheDocument()

    rerender(<FloatButton aria-label="Help" shape="square" description="Help" />)
    expect(screen.getByText("Help")).toBeInTheDocument()
  })

  it("reveals its tooltip on hover", async () => {
    const user = userEvent.setup()
    render(<FloatButton aria-label="Support" tooltip="Contact support" />)

    await user.hover(screen.getByRole("button", { name: "Support" }))
    await waitFor(() =>
      expect(screen.getByText("Contact support")).toBeInTheDocument()
    )
  })

  it("renders a badge count", () => {
    render(<FloatButton aria-label="Inbox" badge={{ count: 5 }} />)
    expect(
      document.querySelector("[data-slot='badge-count']")
    ).toHaveTextContent("5")
  })

  it("pulls the badge off the bounding box onto the button's edge", () => {
    // A circle's corner arc has the button's own radius (24px at the default
    // size), a square's is its 16px `rounded-2xl`; both pull back r(1 − √½).
    const { rerender } = render(
      <FloatButton aria-label="Inbox" badge={{ dot: true }} />
    )
    expect(corner()).toHaveStyle({
      transform: "translate(calc(50% + -7px), calc(-50% + 7px))",
    })

    rerender(
      <FloatButton aria-label="Inbox" shape="square" badge={{ dot: true }} />
    )
    expect(corner()).toHaveStyle({
      transform: "translate(calc(50% + -5px), calc(-50% + 5px))",
    })

    rerender(<FloatButton aria-label="Inbox" size="lg" badge={{ dot: true }} />)
    expect(corner()).toHaveStyle({
      transform: "translate(calc(50% + -8px), calc(-50% + 8px))",
    })
  })

  it("lets a caller override the badge offset", () => {
    render(
      <FloatButton aria-label="Inbox" badge={{ dot: true, offset: [4, -4] }} />
    )
    expect(corner()).toHaveStyle({
      transform: "translate(calc(50% + 4px), calc(-50% + -4px))",
    })
  })
})

describe("FloatButton.Group", () => {
  it("stacks its buttons with no trigger", () => {
    render(
      <FloatButton.Group>
        <FloatButton aria-label="Star" />
        <FloatButton aria-label="Save" />
      </FloatButton.Group>
    )

    expect(screen.getAllByRole("button")).toHaveLength(2)
    expect(
      document.querySelector("[data-slot='float-button-trigger']")
    ).not.toBeInTheDocument()
  })

  it("separates a merged square stack", () => {
    render(
      <FloatButton.Group shape="square">
        <FloatButton aria-label="Star" />
        <FloatButton aria-label="Save" />
        <FloatButton aria-label="Share" />
      </FloatButton.Group>
    )

    expect(
      document.querySelectorAll("[data-slot='float-button-separator']")
    ).toHaveLength(2)
  })

  it("passes its shape down to the buttons", () => {
    render(
      <FloatButton.Group shape="square">
        <FloatButton aria-label="Star" />
      </FloatButton.Group>
    )

    expect(screen.getByRole("button", { name: "Star" })).toHaveAttribute(
      "data-shape",
      "square"
    )
  })

  it("toggles the menu on click and closes on Escape", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <FloatButton.Group
        trigger="click"
        triggerLabel="Actions"
        onOpenChange={onOpenChange}
      >
        <FloatButton aria-label="Email" />
      </FloatButton.Group>
    )

    const trigger = screen.getByRole("button", { name: "Actions" })
    expect(trigger).toHaveAttribute("aria-expanded", "false")

    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(onOpenChange).toHaveBeenLastCalledWith(true)

    await user.keyboard("{Escape}")
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
  })

  it("closes the menu on an outside click", async () => {
    const user = userEvent.setup()
    render(
      <div>
        <button type="button">Outside</button>
        <FloatButton.Group trigger="click" triggerLabel="Actions">
          <FloatButton aria-label="Email" />
        </FloatButton.Group>
      </div>
    )

    const trigger = screen.getByRole("button", { name: "Actions" })
    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")

    await user.click(screen.getByRole("button", { name: "Outside" }))
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  it("opens on hover when triggered by hover", async () => {
    const user = userEvent.setup()
    render(
      <FloatButton.Group trigger="hover" triggerLabel="Actions">
        <FloatButton aria-label="Email" />
      </FloatButton.Group>
    )

    const trigger = screen.getByRole("button", { name: "Actions" })
    const menu = document.querySelector<HTMLElement>(
      "[data-slot='float-button-menu']"
    )!
    expect(menu).toHaveAttribute("data-state", "closed")

    await user.hover(trigger)
    expect(menu).toHaveAttribute("data-state", "open")

    await user.unhover(trigger)
    expect(menu).toHaveAttribute("data-state", "closed")
  })

  it("respects a controlled open state", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <FloatButton.Group
        trigger="click"
        triggerLabel="Actions"
        open={false}
        onOpenChange={onOpenChange}
      >
        <FloatButton aria-label="Email" />
      </FloatButton.Group>
    )

    const trigger = screen.getByRole("button", { name: "Actions" })
    await user.click(trigger)

    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })
})

describe("FloatButton.BackTop", () => {
  function renderInScroller(
    props: React.ComponentProps<typeof FloatButton.BackTop> = {},
    measure?: (el: HTMLDivElement) => void
  ) {
    function Wrapper() {
      const ref = React.useRef<HTMLDivElement>(null)
      // jsdom does no layout, so a test that needs scroll geometry declares
      // it on the element as it mounts.
      const attach = (el: HTMLDivElement | null) => {
        ref.current = el
        if (el) measure?.(el)
      }
      return (
        <div>
          <div ref={attach} data-testid="scroller" style={{ overflow: "auto" }} />
          <FloatButton.BackTop
            target={() => ref.current ?? window}
            visibilityHeight={100}
            {...props}
          />
        </div>
      )
    }
    return render(<Wrapper />)
  }

  it("stays hidden until the target is scrolled past visibilityHeight", async () => {
    renderInScroller()

    const button = screen.getByRole("button", { name: "Back to top" })
    expect(button).toHaveAttribute("data-visible", "false")

    const scroller = screen.getByTestId("scroller")
    scroller.scrollTop = 250
    fireEvent.scroll(scroller)

    await waitFor(() =>
      expect(button).toHaveAttribute("data-visible", "true")
    )
  })

  it("has no progress ring by default", async () => {
    renderInScroller()

    const scroller = screen.getByTestId("scroller")
    scroller.scrollTop = 250
    fireEvent.scroll(scroller)

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Back to top" })
      ).toHaveAttribute("data-visible", "true")
    )
    expect(
      document.querySelector("[data-slot='float-button-progress']")
    ).not.toBeInTheDocument()
  })

  it("traces the scrolled fraction around the button with showProgress", async () => {
    // 1000px of content in a 200px window leaves 800px of travel.
    renderInScroller({ showProgress: true, visibilityHeight: 0 }, (el) => {
      Object.defineProperty(el, "scrollHeight", { value: 1000 })
      Object.defineProperty(el, "clientHeight", { value: 200 })
    })

    // Nothing is drawn at the top — the ring has no track behind it.
    expect(
      document.querySelector("[data-slot='float-button-progress']")
    ).not.toBeInTheDocument()

    const scroller = screen.getByTestId("scroller")
    scroller.scrollTop = 200
    fireEvent.scroll(scroller)

    const circle = await waitFor(() => {
      const el = document.querySelector(
        "[data-slot='float-button-progress'] circle"
      )
      if (!el) throw new Error("no ring")
      return el
    })

    // A quarter of the way down draws a quarter of the outline...
    const [drawn, gap] = (circle.getAttribute("stroke-dasharray") ?? "")
      .split(" ")
      .map(Number)
    expect(drawn / (drawn + gap)).toBeCloseTo(0.25, 2)
    // ...starting at twelve o'clock, three quarters along the circle's path.
    expect(Number(circle.getAttribute("stroke-dashoffset"))).toBeCloseTo(
      -0.75 * (drawn + gap),
      2
    )

    scroller.scrollTop = 800
    fireEvent.scroll(scroller)
    await waitFor(() => {
      const [full, rest] = (
        document
          .querySelector("[data-slot='float-button-progress'] circle")
          ?.getAttribute("stroke-dasharray") ?? ""
      )
        .split(" ")
        .map(Number)
      expect(full / (full + rest)).toBeCloseTo(1, 2)
    })
  })

  it("keeps the whole stroke inside the ring's viewport", async () => {
    // The outer half of the stroke fell outside the viewBox once, and an
    // SVG clips to it by default: the ring came out flattened on all four
    // sides. Both shapes are checked against the box they are drawn in.
    for (const shape of ["circle", "square"] as const) {
      const view = render(<div />)
      renderInScroller({ showProgress: true, visibilityHeight: 0, shape }, (el) => {
        Object.defineProperty(el, "scrollHeight", { value: 1000 })
        Object.defineProperty(el, "clientHeight", { value: 200 })
      })

      const scroller = screen.getAllByTestId("scroller").at(-1)!
      scroller.scrollTop = 500
      fireEvent.scroll(scroller)

      const ring = await waitFor(() => {
        const el = document.querySelectorAll(
          "[data-slot='float-button-progress']"
        )
        if (!el.length) throw new Error("no ring")
        return el[el.length - 1]
      })

      const [, , boxWidth, boxHeight] = (ring.getAttribute("viewBox") ?? "")
        .split(" ")
        .map(Number)
      const shapeEl = ring.querySelector(shape === "circle" ? "circle" : "rect")!
      const half = Number(shapeEl.getAttribute("stroke-width")) / 2

      if (shape === "circle") {
        const r = Number(shapeEl.getAttribute("r"))
        const centre = Number(shapeEl.getAttribute("cx"))
        expect(centre).toBe(boxWidth / 2)
        expect(r + half).toBeLessThanOrEqual(boxWidth / 2)
      } else {
        const x = Number(shapeEl.getAttribute("x"))
        const width = Number(shapeEl.getAttribute("width"))
        expect(x - half).toBeGreaterThanOrEqual(0)
        expect(x + width + half).toBeLessThanOrEqual(boxWidth)
      }
      expect(boxWidth).toBe(boxHeight)
      view.unmount()
    }
  })

  it("traces a square button's outline with a rect", async () => {
    renderInScroller(
      { showProgress: true, visibilityHeight: 0, shape: "square" },
      (el) => {
        Object.defineProperty(el, "scrollHeight", { value: 1000 })
        Object.defineProperty(el, "clientHeight", { value: 200 })
      }
    )

    const scroller = screen.getByTestId("scroller")
    scroller.scrollTop = 400
    fireEvent.scroll(scroller)

    await waitFor(() => {
      expect(
        document.querySelector("[data-slot='float-button-progress'] rect")
      ).toBeInTheDocument()
    })
    expect(
      document.querySelector("[data-slot='float-button-progress'] circle")
    ).not.toBeInTheDocument()
  })

  it("scrolls the target back to the top when clicked", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    renderInScroller({ duration: 0, onClick })

    const scroller = screen.getByTestId("scroller")
    scroller.scrollTop = 250
    fireEvent.scroll(scroller)

    await user.click(screen.getByRole("button", { name: "Back to top" }))
    expect(scroller.scrollTop).toBe(0)
    expect(onClick).toHaveBeenCalled()
  })
})

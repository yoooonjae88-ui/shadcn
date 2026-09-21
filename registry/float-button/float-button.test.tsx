import * as React from "react"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { FloatButton } from "@/registry/float-button/float-button"

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
  function renderInScroller(props: React.ComponentProps<typeof FloatButton.BackTop> = {}) {
    function Wrapper() {
      const ref = React.useRef<HTMLDivElement>(null)
      return (
        <div>
          <div ref={ref} data-testid="scroller" style={{ overflow: "auto" }} />
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

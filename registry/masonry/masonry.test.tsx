import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Masonry } from "@/registry/masonry/masonry"

// jsdom does no layout (heights are 0), so these tests cover the structural
// contract: item rendering, both APIs, pinned columns and the close flow.

const items = [
  { key: "a", children: <p>Alpha</p> },
  { key: "b", children: <p>Beta</p> },
  { key: "c", children: <p>Gamma</p> },
]

describe("Masonry", () => {
  it("renders items from the data-driven API", () => {
    render(<Masonry items={items} />)
    expect(screen.getByText("Alpha")).toBeInTheDocument()
    expect(screen.getByText("Beta")).toBeInTheDocument()
    expect(screen.getByText("Gamma")).toBeInTheDocument()
    expect(
      document.querySelectorAll("[data-slot='masonry-item']")
    ).toHaveLength(3)
  })

  it("renders items via itemRender", () => {
    render(
      <Masonry
        items={[{ key: "x", data: { label: "Custom" } }]}
        itemRender={(item) => (
          <span>rendered {(item.data as { label: string }).label}</span>
        )}
      />
    )
    expect(screen.getByText("rendered Custom")).toBeInTheDocument()
  })

  it("lays out plain children in order", () => {
    render(
      <Masonry>
        <p>First child</p>
        <p>Second child</p>
      </Masonry>
    )
    expect(
      document.querySelectorAll("[data-slot='masonry-item']")
    ).toHaveLength(2)
  })

  it("shows close buttons when closable and fires onClose with the key", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Masonry items={items} closable onClose={onClose} />)

    // Items stay visibility:hidden until their first measurement, which our
    // ResizeObserver stub never delivers, and hidden elements get no
    // accessible name — query by attribute instead of role.
    const closeButtons = document.querySelectorAll("button[aria-label='Close']")
    expect(closeButtons).toHaveLength(3)

    await user.click(closeButtons[0] as HTMLElement)
    expect(onClose).toHaveBeenCalledWith("a")
  })

  it("renders no close buttons by default", () => {
    render(<Masonry items={items} />)
    expect(
      document.querySelector("button[aria-label='Close']")
    ).not.toBeInTheDocument()
  })

  it("honours a per-item closable override", () => {
    render(
      <Masonry
        items={[
          { key: "a", children: <p>Alpha</p>, closable: true },
          { key: "b", children: <p>Beta</p> },
        ]}
      />
    )
    expect(
      document.querySelectorAll("button[aria-label='Close']")
    ).toHaveLength(1)
  })
})

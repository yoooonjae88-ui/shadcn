import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Pagination } from "@/registry/pagination/pagination"

describe("Pagination", () => {
  it("renders one button per page for small totals", () => {
    render(<Pagination total={30} />)
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "4" })).not.toBeInTheDocument()
  })

  it("marks the current page with aria-current", () => {
    render(<Pagination total={30} defaultCurrent={2} />)
    expect(screen.getByRole("button", { name: "2" })).toHaveAttribute(
      "aria-current",
      "page"
    )
  })

  it("navigates on page click and reports via onChange", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Pagination total={30} onChange={onChange} />)

    await user.click(screen.getByRole("button", { name: "3" }))
    expect(onChange).toHaveBeenCalledWith(3, 10)
    expect(screen.getByRole("button", { name: "3" })).toHaveAttribute(
      "aria-current",
      "page"
    )
  })

  it("disables prev on the first page and next on the last", async () => {
    const user = userEvent.setup()
    render(<Pagination total={20} />)

    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled()
    await user.click(screen.getByRole("button", { name: "Next page" }))
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled()
  })

  it("collapses long ranges into ellipsis jumpers", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Pagination total={500} defaultCurrent={10} onChange={onChange} />)

    // Window around page 10 plus pinned first/last pages.
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "50" })).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Previous 5 pages" })
    ).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Next 5 pages" }))
    expect(onChange).toHaveBeenCalledWith(15, 10)
  })

  it("hides itself on a single page with hideOnSinglePage", () => {
    render(<Pagination total={5} hideOnSinglePage />)
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument()
  })

  it("renders the total summary", () => {
    render(
      <Pagination
        total={85}
        showTotal={(total, [from, to]) => `${from}-${to} of ${total}`}
      />
    )
    expect(screen.getByText("1-10 of 85")).toBeInTheDocument()
  })

  it("shows the page-size select automatically when total > 50", () => {
    render(<Pagination total={100} />)
    expect(screen.getByLabelText("Page size")).toBeInTheDocument()
  })

  it("jumps to a typed page with the quick jumper", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Pagination total={100} showQuickJumper onChange={onChange} />)

    const input = screen.getByLabelText("Jump to page")
    await user.type(input, "7{Enter}")
    expect(onChange).toHaveBeenCalledWith(7, 10)
  })

  it("simple mode renders an editable page input over the page count", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Pagination total={50} simple onChange={onChange} />)

    const input = screen.getByLabelText("Page")
    expect(input).toHaveValue("1")
    expect(screen.getByText("5")).toBeInTheDocument()

    await user.clear(input)
    await user.type(input, "4{Enter}")
    expect(onChange).toHaveBeenCalledWith(4, 10)
  })

  it("ignores interaction when disabled", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Pagination total={30} disabled onChange={onChange} />)

    await user.click(screen.getByRole("button", { name: "2" }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it("supports custom item rendering", () => {
    render(
      <Pagination
        total={20}
        itemRender={(page, type, element) =>
          type === "page" ? <a href={`/page/${page}`}>{page}</a> : element
        }
      />
    )
    expect(screen.getByRole("link", { name: "1" })).toHaveAttribute(
      "href",
      "/page/1"
    )
  })
})

import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { SearchInput } from "@/registry/search-input/search-input"

describe("SearchInput", () => {
  it("starts collapsed with the field hidden from the tab order", () => {
    render(<SearchInput />)
    expect(screen.getByRole("button", { name: "Search" })).toHaveAttribute(
      "aria-expanded",
      "false"
    )
    const input = document.querySelector(
      "[data-slot='search-input-field']"
    ) as HTMLInputElement
    expect(input).toHaveAttribute("tabindex", "-1")
    expect(input).toHaveAttribute("aria-hidden", "true")
  })

  it("expands when the trigger is clicked", async () => {
    const user = userEvent.setup()
    const onExpandedChange = vi.fn()
    render(<SearchInput onExpandedChange={onExpandedChange} />)

    await user.click(screen.getByRole("button", { name: "Search" }))
    expect(onExpandedChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole("button", { name: "Search" })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
  })

  it("reports keystrokes via onValueChange and submits on Enter", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    const onSearch = vi.fn()
    render(
      <SearchInput
        defaultExpanded
        onValueChange={onValueChange}
        onSearch={onSearch}
      />
    )

    const input = screen.getByPlaceholderText("Search…")
    await user.type(input, "cats")
    expect(onValueChange).toHaveBeenLastCalledWith("cats")

    await user.keyboard("{Enter}")
    expect(onSearch).toHaveBeenCalledWith("cats")
  })

  it("clicking the icon while open submits the current query", async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<SearchInput defaultExpanded defaultValue="dogs" onSearch={onSearch} />)

    await user.click(screen.getByRole("button", { name: "Search" }))
    expect(onSearch).toHaveBeenCalledWith("dogs")
  })

  it("Escape clears the value first, then collapses", async () => {
    const user = userEvent.setup()
    const onExpandedChange = vi.fn()
    render(
      <SearchInput
        defaultExpanded
        defaultValue="abc"
        onExpandedChange={onExpandedChange}
      />
    )
    const input = screen.getByPlaceholderText("Search…")

    input.focus()
    await user.keyboard("{Escape}")
    expect(input).toHaveValue("")
    expect(onExpandedChange).not.toHaveBeenCalled()

    await user.keyboard("{Escape}")
    expect(onExpandedChange).toHaveBeenCalledWith(false)
  })

  it("shows a clear button only when there is a value", async () => {
    const user = userEvent.setup()
    render(<SearchInput defaultExpanded defaultValue="abc" />)

    const clear = screen.getByRole("button", { name: "Clear search" })
    await user.click(clear)
    expect(screen.getByPlaceholderText("Search…")).toHaveValue("")
    expect(
      screen.queryByRole("button", { name: "Clear search" })
    ).not.toBeInTheDocument()
  })

  it("collapses on blur when empty, but stays open with a value", () => {
    const { unmount } = render(<SearchInput defaultExpanded />)
    fireEvent.blur(screen.getByPlaceholderText("Search…"))
    expect(
      document.querySelector("[data-slot='search-input']")
    ).not.toHaveAttribute("data-expanded")
    unmount()

    render(<SearchInput defaultExpanded defaultValue="query" />)
    fireEvent.blur(screen.getByPlaceholderText("Search…"))
    expect(
      document.querySelector("[data-slot='search-input']")
    ).toHaveAttribute("data-expanded")
  })

  it("respects collapseOnBlur=false", () => {
    render(<SearchInput defaultExpanded collapseOnBlur={false} />)
    fireEvent.blur(screen.getByPlaceholderText("Search…"))
    expect(
      document.querySelector("[data-slot='search-input']")
    ).toHaveAttribute("data-expanded")
  })
})

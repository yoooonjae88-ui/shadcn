import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  Link,
  Paragraph,
  Text,
  Title,
} from "@/registry/typography/typography"

describe("Text", () => {
  it("renders an inline span by default and a paragraph via as", () => {
    const { rerender } = render(<Text>Hello</Text>)
    expect(screen.getByText("Hello").tagName).toBe("SPAN")

    rerender(<Text as="p">Hello</Text>)
    expect(screen.getByText("Hello").tagName).toBe("P")
  })

  it("applies semantic type colors", () => {
    render(<Text type="danger">Bad</Text>)
    expect(screen.getByText("Bad")).toHaveClass("text-destructive")
  })

  it("copies its content via the copy button", async () => {
    const user = userEvent.setup()
    const onCopy = vi.fn()
    render(<Text copyable={{ onCopy }}>Copy me</Text>)

    await user.click(screen.getByRole("button", { name: "Copy" }))
    await waitFor(() => expect(onCopy).toHaveBeenCalledWith("Copy me"))
    // The button flips to the copied state.
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument()
  })

  it("edits its content and commits on Enter", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Text editable={{ onChange }}>Old value</Text>)

    await user.click(screen.getByRole("button", { name: "Edit" }))
    const input = screen.getByDisplayValue("Old value")
    await user.clear(input)
    await user.type(input, "New value{Enter}")
    expect(onChange).toHaveBeenCalledWith("New value")
  })

  it("clamps with ellipsis and expands inline", async () => {
    const user = userEvent.setup()
    render(
      <Text ellipsis={{ expandable: true, symbol: ["Show", "Hide"] }}>
        Long content
      </Text>
    )

    expect(
      document.querySelector("[data-slot='typography-ellipsis']")
    ).toHaveClass("truncate")

    await user.click(screen.getByRole("button", { name: "Show" }))
    expect(
      document.querySelector("[data-slot='typography-ellipsis']")
    ).not.toHaveClass("truncate")
    expect(screen.getByRole("button", { name: "Hide" })).toBeInTheDocument()
  })
})

describe("Title", () => {
  it("renders the requested heading level", () => {
    render(<Title level={3}>Section</Title>)
    const heading = screen.getByRole("heading", { level: 3, name: "Section" })
    expect(heading).toHaveAttribute("data-level", "3")
  })

  it("defaults to h1", () => {
    render(<Title>Page</Title>)
    expect(
      screen.getByRole("heading", { level: 1, name: "Page" })
    ).toBeInTheDocument()
  })
})

describe("Link", () => {
  it("renders an anchor with its href", () => {
    render(<Link href="/docs">Docs</Link>)
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "href",
      "/docs"
    )
  })

  it("drops the href and blocks clicks when disabled", () => {
    render(
      <Link href="/docs" disabled>
        Docs
      </Link>
    )
    const link = screen.getByText("Docs")
    expect(link).not.toHaveAttribute("href")
    expect(link).toHaveAttribute("aria-disabled", "true")
  })
})

describe("Paragraph", () => {
  it("is Text rendered as a block paragraph", () => {
    render(<Paragraph>Body copy</Paragraph>)
    const p = screen.getByText("Body copy")
    expect(p.tagName).toBe("P")
    expect(p).toHaveClass("mb-4")
  })
})

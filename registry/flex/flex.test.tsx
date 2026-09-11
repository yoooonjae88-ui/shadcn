import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Flex } from "@/registry/flex/flex"

describe("Flex", () => {
  it("renders a horizontal, non-wrapping flex container by default", () => {
    render(<Flex data-testid="flex">content</Flex>)
    const el = screen.getByTestId("flex")
    expect(el.tagName).toBe("DIV")
    expect(el).toHaveClass("flex", "flex-row", "flex-nowrap")
  })

  it("lays out vertically with the vertical prop", () => {
    render(<Flex data-testid="flex" vertical />)
    expect(screen.getByTestId("flex")).toHaveClass("flex-col")
  })

  it("maps wrap values to flex-wrap classes", () => {
    const { rerender } = render(<Flex data-testid="flex" wrap />)
    expect(screen.getByTestId("flex")).toHaveClass("flex-wrap")

    rerender(<Flex data-testid="flex" wrap="wrap-reverse" />)
    expect(screen.getByTestId("flex")).toHaveClass("flex-wrap-reverse")
  })

  it("resolves gap presets to pixel values", () => {
    render(<Flex data-testid="flex" gap="middle" />)
    expect(screen.getByTestId("flex")).toHaveStyle({ gap: "16px" })
  })

  it("accepts numeric and raw CSS gap values", () => {
    const { rerender } = render(<Flex data-testid="flex" gap={10} />)
    expect(screen.getByTestId("flex")).toHaveStyle({ gap: "10px" })

    rerender(<Flex data-testid="flex" gap="2rem" />)
    expect(screen.getByTestId("flex")).toHaveStyle({ gap: "2rem" })
  })

  it("writes justify and align as inline styles", () => {
    render(<Flex data-testid="flex" justify="space-between" align="center" />)
    expect(screen.getByTestId("flex")).toHaveStyle({
      justifyContent: "space-between",
      alignItems: "center",
    })
  })

  it("renders as a custom element via component", () => {
    render(<Flex data-testid="flex" component="section" />)
    expect(screen.getByTestId("flex").tagName).toBe("SECTION")
  })

  it("merges custom className and style", () => {
    render(
      <Flex data-testid="flex" className="custom" style={{ padding: 4 }} gap={8} />
    )
    const el = screen.getByTestId("flex")
    expect(el).toHaveClass("custom")
    expect(el).toHaveStyle({ padding: "4px", gap: "8px" })
  })
})

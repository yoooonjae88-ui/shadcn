import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Divider } from "@/registry/divider/divider"

describe("Divider", () => {
  it("renders a horizontal separator by default", () => {
    render(<Divider />)
    const divider = screen.getByRole("separator")
    expect(divider).toHaveAttribute("aria-orientation", "horizontal")
    expect(divider).toHaveClass("border-t")
  })

  it("renders a vertical separator without children", () => {
    render(<Divider type="vertical">ignored</Divider>)
    const divider = screen.getByRole("separator")
    expect(divider).toHaveAttribute("aria-orientation", "vertical")
    expect(screen.queryByText("ignored")).not.toBeInTheDocument()
  })

  it("renders a title inside the line", () => {
    render(<Divider>Section</Divider>)
    expect(screen.getByRole("separator")).toContainElement(
      screen.getByText("Section")
    )
  })

  it("supports dashed and dotted line styles", () => {
    const { rerender } = render(<Divider dashed />)
    expect(screen.getByRole("separator")).toHaveClass("border-dashed")

    rerender(<Divider variant="dotted" />)
    expect(screen.getByRole("separator")).toHaveClass("border-dotted")
  })

  it("variant wins over the legacy dashed boolean", () => {
    render(<Divider variant="dotted" dashed />)
    expect(screen.getByRole("separator")).toHaveClass("border-dotted")
  })

  it("applies size presets to the vertical margin", () => {
    const { rerender } = render(<Divider size="small" />)
    expect(screen.getByRole("separator")).toHaveClass("my-2")

    rerender(<Divider size="middle" />)
    expect(screen.getByRole("separator")).toHaveClass("my-4")

    rerender(<Divider />)
    expect(screen.getByRole("separator")).toHaveClass("my-6")
  })

  it("renders plain titles as body text", () => {
    const { rerender } = render(<Divider>Title</Divider>)
    expect(screen.getByRole("separator")).toHaveClass("font-medium")

    rerender(<Divider plain>Title</Divider>)
    expect(screen.getByRole("separator")).toHaveClass("font-normal")
  })

  it("applies orientationMargin so the title hugs the edge", () => {
    render(
      <Divider orientation="start" orientationMargin={24}>
        Title
      </Divider>
    )
    expect(screen.getByText("Title")).toHaveStyle({
      marginLeft: "24px",
      paddingLeft: "0",
    })
  })
})

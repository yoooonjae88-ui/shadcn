import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Button, ButtonArrow } from "@/registry/button/button"

describe("Button", () => {
  it("renders a button with its label", () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
  })

  it("fires onClick", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)

    await user.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("does not fire onClick while disabled", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>
    )

    await user.click(screen.getByRole("button"))
    expect(onClick).not.toHaveBeenCalled()
  })

  it("applies variant classes", () => {
    const { rerender } = render(<Button>Save</Button>)
    expect(screen.getByRole("button").className).toContain("bg-primary")

    rerender(<Button variant="destructive">Save</Button>)
    expect(screen.getByRole("button").className).toContain("text-destructive")

    rerender(<Button variant="teal">Save</Button>)
    expect(screen.getByRole("button").className).toContain("bg-button-teal")
  })

  it("applies size and shape classes", () => {
    const { rerender } = render(<Button size="icon">x</Button>)
    expect(screen.getByRole("button").className).toContain("size-8")

    rerender(
      <Button size="icon" shape="circle">
        x
      </Button>
    )
    expect(screen.getByRole("button").className).toContain("rounded-full")
  })

  describe("loading", () => {
    it("disables the button and sets aria-busy", () => {
      render(<Button loading>Save</Button>)
      const button = screen.getByRole("button")
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute("aria-busy", "true")
      expect(button).toHaveAttribute("data-loading")
    })

    it("shows a spinner while keeping the label in flow for width", () => {
      render(<Button loading>Save</Button>)
      const button = screen.getByRole("button")
      expect(
        button.querySelector("[data-slot='button-spinner']")
      ).toBeInTheDocument()
      // The label stays rendered (invisible) so the width doesn't change.
      expect(screen.getByText("Save")).toHaveClass("invisible")
    })
  })

  describe("ButtonArrow", () => {
    it("renders an aria-hidden chevron inside the button", () => {
      render(
        <Button>
          Options <ButtonArrow />
        </Button>
      )
      const arrow = screen
        .getByRole("button")
        .querySelector("[data-slot='button-arrow']")
      expect(arrow).toBeInTheDocument()
      expect(arrow).toHaveAttribute("aria-hidden", "true")
    })

    it("accepts a custom icon component", () => {
      const CustomIcon = (props: React.ComponentProps<"svg">) => (
        <svg data-testid="custom-icon" {...props} />
      )
      render(
        <Button>
          Options <ButtonArrow icon={CustomIcon} />
        </Button>
      )
      expect(screen.getByTestId("custom-icon")).toHaveAttribute(
        "data-slot",
        "button-arrow"
      )
    })
  })
})

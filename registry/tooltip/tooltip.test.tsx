import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/tooltip/tooltip"

function renderTooltip(
  contentProps: Partial<React.ComponentProps<typeof TooltipContent>> = {}
) {
  return render(
    <TooltipProvider delay={0}>
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent {...contentProps}>Helpful hint</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

describe("Tooltip", () => {
  it("is hidden until the trigger is hovered", () => {
    renderTooltip()
    expect(screen.queryByText("Helpful hint")).not.toBeInTheDocument()
  })

  it("shows on hover", async () => {
    const user = userEvent.setup()
    renderTooltip()

    await user.hover(screen.getByText("Hover me"))
    await waitFor(() =>
      expect(screen.getByText("Helpful hint")).toBeInTheDocument()
    )
  })

  it("shows on keyboard focus", async () => {
    const user = userEvent.setup()
    renderTooltip()

    await user.tab()
    expect(screen.getByText("Hover me")).toHaveFocus()
    await waitFor(() =>
      expect(screen.getByText("Helpful hint")).toBeInTheDocument()
    )
  })

  it("applies color variants from theme tokens", async () => {
    const user = userEvent.setup()
    renderTooltip({ variant: "destructive" })

    await user.hover(screen.getByText("Hover me"))
    await waitFor(() =>
      expect(screen.getByText("Helpful hint")).toHaveClass(
        "bg-tooltip-destructive"
      )
    )
  })

  it("renders the connecting arrow by default and hides it with showArrow=false", async () => {
    const user = userEvent.setup()
    const { unmount } = renderTooltip()

    await user.hover(screen.getByText("Hover me"))
    await waitFor(() =>
      expect(
        document.querySelector("[data-slot='tooltip-arrow']")
      ).toBeInTheDocument()
    )
    unmount()

    renderTooltip({ showArrow: false })
    await user.hover(screen.getByText("Hover me"))
    await waitFor(() =>
      expect(screen.getByText("Helpful hint")).toBeInTheDocument()
    )
    expect(
      document.querySelector("[data-slot='tooltip-arrow']")
    ).not.toBeInTheDocument()
  })
})

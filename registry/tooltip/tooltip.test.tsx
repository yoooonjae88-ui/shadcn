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

  it("tucks the arrow's base strip inside the popup on every side", async () => {
    const user = userEvent.setup()
    renderTooltip()
    await user.hover(screen.getByText("Hover me"))

    const arrow = await waitFor(() => {
      const el = document.querySelector("[data-slot='tooltip-arrow']")
      if (!el) throw new Error("no arrow")
      return el
    })

    // The arrow's svg ends in a 2px full-width strip that joins it to the
    // popup. Leave any of that strip outside and its two ends show as points
    // either side of the arrow, which is what a 1px-short inset did.
    const STRIP = 2
    const BOX_ACROSS = 10 // the box's size along the pointing axis
    const BOX_ALONG = 20 // and across it, which the rotated sides swap in

    const inset = (side: string) => {
      const match = arrow.className.match(
        new RegExp(`data-\\[side=${side}\\]:(?:top|bottom|left|right)-\\[(-?\\d+)px\\]`)
      )
      if (!match) throw new Error(`no inset for side=${side}`)
      return Number(match[1])
    }

    // Upright: the box hangs out by its height less the strip.
    expect(inset("top")).toBe(-(BOX_ACROSS - STRIP))
    expect(inset("bottom")).toBe(-(BOX_ACROSS - STRIP))

    // Rotated a quarter turn, the 20px box is centred on the 10px the arrow
    // actually occupies, so it sits half that difference further out.
    const rotatedGap = (BOX_ALONG - BOX_ACROSS) / 2
    expect(inset("left")).toBe(-(BOX_ACROSS - STRIP + rotatedGap))
    expect(inset("right")).toBe(-(BOX_ACROSS - STRIP + rotatedGap))
  })
})

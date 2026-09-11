import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/accordion/accordion"

function renderAccordion(
  props: React.ComponentProps<typeof Accordion> = {}
) {
  return render(
    <Accordion {...props}>
      <AccordionItem value="shipping">
        <AccordionTrigger>Shipping</AccordionTrigger>
        <AccordionContent>Ships worldwide.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="returns">
        <AccordionTrigger>Returns</AccordionTrigger>
        <AccordionContent>30 day returns.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

describe("Accordion", () => {
  it("renders collapsed triggers", () => {
    renderAccordion()
    const trigger = screen.getByRole("button", { name: "Shipping" })
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByText("Ships worldwide.")).not.toBeInTheDocument()
  })

  it("expands a panel on click", async () => {
    const user = userEvent.setup()
    renderAccordion()

    await user.click(screen.getByRole("button", { name: "Shipping" }))
    expect(
      screen.getByRole("button", { name: "Shipping" })
    ).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("Ships worldwide.")).toBeVisible()
  })

  it("collapses an open panel when clicked again", async () => {
    const user = userEvent.setup()
    renderAccordion()

    const trigger = screen.getByRole("button", { name: "Shipping" })
    await user.click(trigger)
    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  it("opens items independently with multiple", async () => {
    const user = userEvent.setup()
    renderAccordion({ multiple: true })

    await user.click(screen.getByRole("button", { name: "Shipping" }))
    await user.click(screen.getByRole("button", { name: "Returns" }))
    expect(screen.getByRole("button", { name: "Shipping" })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
    expect(screen.getByRole("button", { name: "Returns" })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
  })

  it("respects defaultValue", () => {
    renderAccordion({ defaultValue: ["returns"] })
    expect(screen.getByRole("button", { name: "Returns" })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
  })

  it("shares the variant with every item", () => {
    renderAccordion({ variant: "solid" })
    const root = document.querySelector("[data-slot='accordion']")
    expect(root).toHaveAttribute("data-variant", "solid")
    for (const item of document.querySelectorAll(
      "[data-slot='accordion-item']"
    )) {
      expect(item).toHaveClass("bg-accordion-solid")
    }
  })
})

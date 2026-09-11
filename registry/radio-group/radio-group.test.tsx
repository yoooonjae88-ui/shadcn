import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { RadioGroup, RadioGroupItem } from "@/registry/radio-group/radio-group"

function renderGroup(props: React.ComponentProps<typeof RadioGroup> = {}) {
  return render(
    <RadioGroup aria-label="Plan" {...props}>
      <RadioGroupItem value="starter" aria-label="Starter" />
      <RadioGroupItem value="pro" aria-label="Pro" />
    </RadioGroup>
  )
}

describe("RadioGroup", () => {
  it("renders a radiogroup with its radios", () => {
    renderGroup()
    expect(screen.getByRole("radiogroup", { name: "Plan" })).toBeInTheDocument()
    expect(screen.getAllByRole("radio")).toHaveLength(2)
  })

  it("selects a radio on click", async () => {
    const user = userEvent.setup()
    renderGroup()

    await user.click(screen.getByRole("radio", { name: "Pro" }))
    expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked()
    expect(screen.getByRole("radio", { name: "Starter" })).not.toBeChecked()
  })

  it("respects defaultValue", () => {
    renderGroup({ defaultValue: "starter" })
    expect(screen.getByRole("radio", { name: "Starter" })).toBeChecked()
  })

  it("calls onValueChange with the selected value", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    renderGroup({ onValueChange })

    await user.click(screen.getByRole("radio", { name: "Pro" }))
    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(onValueChange.mock.calls[0][0]).toBe("pro")
  })

  it("does not select while disabled", async () => {
    const user = userEvent.setup()
    renderGroup({ disabled: true })
    const radio = screen.getByRole("radio", { name: "Pro" })

    await user.click(radio)
    expect(radio).not.toBeChecked()
  })

  it("items inherit the group size", () => {
    renderGroup({ size: "lg" })
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio.className).toContain("size-5")
    }
  })

  it("an item can override the group size", () => {
    render(
      <RadioGroup aria-label="Plan" size="lg">
        <RadioGroupItem value="starter" aria-label="Starter" size="sm" />
        <RadioGroupItem value="pro" aria-label="Pro" />
      </RadioGroup>
    )
    expect(screen.getByRole("radio", { name: "Starter" }).className).toContain(
      "size-3.5"
    )
    expect(screen.getByRole("radio", { name: "Pro" }).className).toContain(
      "size-5"
    )
  })
})

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Segmented } from "@/registry/segmented/segmented"

describe("Segmented", () => {
  it("renders a radiogroup with one radio per option", () => {
    render(<Segmented options={["Daily", "Weekly", "Monthly"]} />)
    expect(screen.getByRole("radiogroup")).toBeInTheDocument()
    expect(screen.getAllByRole("radio")).toHaveLength(3)
  })

  it("selects the first enabled option by default", () => {
    render(
      <Segmented
        options={[
          { value: "a", disabled: true },
          { value: "b" },
          { value: "c" },
        ]}
      />
    )
    expect(screen.getByRole("radio", { name: "b" })).toBeChecked()
  })

  it("changes selection on click and fires onChange", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Segmented options={["Daily", "Weekly"]} onChange={onChange} />)

    await user.click(screen.getByText("Weekly"))
    expect(onChange).toHaveBeenCalledWith("Weekly")
    expect(screen.getByRole("radio", { name: "Weekly" })).toBeChecked()
  })

  it("respects defaultValue", () => {
    render(<Segmented options={["Daily", "Weekly"]} defaultValue="Weekly" />)
    expect(screen.getByRole("radio", { name: "Weekly" })).toBeChecked()
  })

  it("keeps controlled value fixed until the parent updates it", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <Segmented options={["Daily", "Weekly"]} value="Daily" onChange={onChange} />
    )

    await user.click(screen.getByText("Weekly"))
    expect(onChange).toHaveBeenCalledWith("Weekly")
    expect(screen.getByRole("radio", { name: "Daily" })).toBeChecked()
  })

  it("disables individual options", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <Segmented
        options={["Daily", { value: "Weekly", disabled: true }]}
        onChange={onChange}
      />
    )

    expect(screen.getByRole("radio", { name: "Weekly" })).toBeDisabled()
    await user.click(screen.getByText("Weekly"))
    expect(onChange).not.toHaveBeenCalled()
  })

  it("disables the whole control", () => {
    render(<Segmented options={["Daily", "Weekly"]} disabled />)
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toBeDisabled()
    }
    expect(screen.getByRole("radiogroup")).toHaveAttribute("data-disabled")
  })

  it("falls back to the nearest option when the selected one disappears", () => {
    const { rerender } = render(
      <Segmented options={["a", "b", "c"]} defaultValue="c" />
    )
    expect(screen.getByRole("radio", { name: "c" })).toBeChecked()

    rerender(<Segmented options={["a", "b"]} />)
    expect(screen.getByRole("radio", { name: "b" })).toBeChecked()
  })

  it("renders numeric options and reports them as numbers", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Segmented options={[10, 20]} onChange={onChange} />)

    await user.click(screen.getByText("20"))
    expect(onChange).toHaveBeenCalledWith(20)
  })
})

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Tour } from "@/registry/tour/tour"

const steps = [
  { title: "Welcome", description: "Step one" },
  { title: "Editor", description: "Step two" },
  { title: "Done", description: "Step three" },
]

describe("Tour", () => {
  it("renders nothing while closed", () => {
    render(<Tour open={false} steps={steps} />)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("shows the current step card in a dialog", () => {
    render(<Tour open steps={steps} />)
    const dialog = screen.getByRole("dialog")
    expect(dialog).toContainElement(screen.getByText("Welcome"))
    expect(dialog).toContainElement(screen.getByText("Step one"))
  })

  it("walks forward and back through the steps", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Tour open steps={steps} onChange={onChange} />)

    await user.click(screen.getByRole("button", { name: "Next" }))
    expect(onChange).toHaveBeenCalledWith(1)
    expect(screen.getByText("Editor")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Previous" }))
    expect(onChange).toHaveBeenCalledWith(0)
    expect(screen.getByText("Welcome")).toBeInTheDocument()
  })

  it("shows Finish on the last step and fires onFinish + onClose", async () => {
    const user = userEvent.setup()
    const onFinish = vi.fn()
    const onClose = vi.fn()
    render(
      <Tour
        open
        steps={steps}
        defaultCurrent={2}
        onFinish={onFinish}
        onClose={onClose}
      />
    )

    await user.click(screen.getByRole("button", { name: "Finish" }))
    expect(onFinish).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledWith(2)
  })

  it("closes via the close button", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Tour open steps={steps} onClose={onClose} />)

    await user.click(screen.getByRole("button", { name: "Close" }))
    expect(onClose).toHaveBeenCalledWith(0)
  })

  it("supports a controlled current index", () => {
    const { rerender } = render(<Tour open steps={steps} current={1} />)
    expect(screen.getByText("Editor")).toBeInTheDocument()

    rerender(<Tour open steps={steps} current={2} />)
    expect(screen.getByText("Done")).toBeInTheDocument()
  })

  it("lets actionsRender replace the footer", () => {
    render(
      <Tour
        open
        steps={steps}
        actionsRender={(_origin, { current, total }) => (
          <span>
            step {current + 1} of {total}
          </span>
        )}
      />
    )
    expect(screen.getByText("step 1 of 3")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument()
  })
})

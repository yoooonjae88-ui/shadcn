import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  Steps,
  StepsContent,
  StepsDescription,
  StepsIndicator,
  StepsItem,
  StepsPanel,
  StepsPanels,
  StepsSeparator,
  StepsTitle,
  StepsTrigger,
} from "@/registry/steps/steps"

function renderSteps(value: number) {
  return render(
    <Steps value={value}>
      <StepsItem step={1} data-testid="step-1">
        <StepsIndicator data-testid="indicator-1" />
        <StepsContent>
          <StepsTitle>Account</StepsTitle>
          <StepsDescription>Create your account</StepsDescription>
        </StepsContent>
        <StepsSeparator />
      </StepsItem>
      <StepsItem step={2} data-testid="step-2">
        <StepsIndicator data-testid="indicator-2" />
        <StepsContent>
          <StepsTitle>Profile</StepsTitle>
        </StepsContent>
        <StepsSeparator />
      </StepsItem>
      <StepsItem step={3} data-testid="step-3">
        <StepsIndicator data-testid="indicator-3" />
        <StepsContent>
          <StepsTitle>Done</StepsTitle>
        </StepsContent>
      </StepsItem>
    </Steps>
  )
}

describe("Steps", () => {
  it("derives complete, active and upcoming states from the current value", () => {
    renderSteps(2)
    expect(screen.getByTestId("step-1")).toHaveAttribute(
      "data-state",
      "complete"
    )
    expect(screen.getByTestId("step-2")).toHaveAttribute(
      "data-state",
      "active"
    )
    expect(screen.getByTestId("step-3")).toHaveAttribute(
      "data-state",
      "upcoming"
    )
  })

  it("marks only the active step with aria-current", () => {
    renderSteps(2)
    expect(screen.getByTestId("step-2")).toHaveAttribute(
      "aria-current",
      "step"
    )
    expect(screen.getByTestId("step-1")).not.toHaveAttribute("aria-current")
    expect(screen.getByTestId("step-3")).not.toHaveAttribute("aria-current")
  })

  it("shows a check icon for completed steps and numbers otherwise", () => {
    renderSteps(2)
    const completed = screen.getByTestId("indicator-1")
    expect(completed.querySelector("svg")).toBeInTheDocument()
    expect(completed).not.toHaveTextContent("1")

    expect(screen.getByTestId("indicator-2")).toHaveTextContent("2")
    expect(screen.getByTestId("indicator-3")).toHaveTextContent("3")
  })

  it("updates states when the value changes", () => {
    const { rerender } = renderSteps(1)
    expect(screen.getByTestId("step-1")).toHaveAttribute(
      "data-state",
      "active"
    )

    rerender(
      <Steps value={3}>
        <StepsItem step={1} data-testid="step-1">
          <StepsIndicator />
        </StepsItem>
        <StepsItem step={2} data-testid="step-2">
          <StepsIndicator />
        </StepsItem>
        <StepsItem step={3} data-testid="step-3">
          <StepsIndicator />
        </StepsItem>
      </Steps>
    )
    expect(screen.getByTestId("step-1")).toHaveAttribute(
      "data-state",
      "complete"
    )
    expect(screen.getByTestId("step-2")).toHaveAttribute(
      "data-state",
      "complete"
    )
    expect(screen.getByTestId("step-3")).toHaveAttribute(
      "data-state",
      "active"
    )
  })

  it("renders titles and descriptions", () => {
    renderSteps(1)
    expect(screen.getByText("Account")).toBeInTheDocument()
    expect(screen.getByText("Create your account")).toBeInTheDocument()
    expect(screen.getByText("Profile")).toBeInTheDocument()
  })

  it("defaults to a horizontal orientation", () => {
    render(
      <Steps value={1} data-testid="steps">
        <StepsItem step={1} data-testid="step-1">
          <StepsIndicator />
        </StepsItem>
      </Steps>
    )
    expect(screen.getByTestId("steps")).toHaveAttribute(
      "data-orientation",
      "horizontal"
    )
    expect(screen.getByTestId("step-1")).toHaveAttribute(
      "data-orientation",
      "horizontal"
    )
  })

  it("propagates a vertical orientation to the items", () => {
    render(
      <Steps value={1} orientation="vertical" data-testid="steps">
        <StepsItem step={1} data-testid="step-1">
          <StepsIndicator />
        </StepsItem>
      </Steps>
    )
    expect(screen.getByTestId("steps")).toHaveAttribute(
      "data-orientation",
      "vertical"
    )
    expect(screen.getByTestId("step-1")).toHaveAttribute(
      "data-orientation",
      "vertical"
    )
  })

  it("renders a custom indicator icon in place of the number/check", () => {
    render(
      <Steps value={2}>
        <StepsItem step={1}>
          <StepsIndicator data-testid="custom-1">
            <svg data-testid="icon-1" />
          </StepsIndicator>
        </StepsItem>
        <StepsItem step={2}>
          <StepsIndicator data-testid="custom-2">
            <svg data-testid="icon-2" />
          </StepsIndicator>
        </StepsItem>
      </Steps>
    )
    // Completed step shows the custom icon, not the default check.
    expect(screen.getByTestId("icon-1")).toBeInTheDocument()
    expect(screen.getByTestId("custom-1")).not.toHaveTextContent("1")
    // Active step shows the custom icon, not its number.
    expect(screen.getByTestId("icon-2")).toBeInTheDocument()
    expect(screen.getByTestId("custom-2")).not.toHaveTextContent("2")
  })

  it("renders a custom indicator icon for the dot variant", () => {
    render(
      <Steps value={1} variant="dot">
        <StepsItem step={1}>
          <StepsIndicator data-testid="dot-custom">
            <svg data-testid="dot-icon" />
          </StepsIndicator>
        </StepsItem>
      </Steps>
    )
    expect(screen.getByTestId("dot-custom")).toHaveAttribute(
      "data-variant",
      "dot"
    )
    expect(screen.getByTestId("dot-icon")).toBeInTheDocument()
  })

  it("renders dot indicators without numbers when variant is dot", () => {
    render(
      <Steps value={2} variant="dot">
        <StepsItem step={1}>
          <StepsIndicator data-testid="dot-1" />
        </StepsItem>
        <StepsItem step={2}>
          <StepsIndicator data-testid="dot-2" />
        </StepsItem>
        <StepsItem step={3}>
          <StepsIndicator data-testid="dot-3" />
        </StepsItem>
      </Steps>
    )
    expect(screen.getByTestId("dot-2")).toHaveAttribute("data-variant", "dot")
    expect(screen.getByTestId("dot-2")).not.toHaveTextContent("2")
    expect(screen.getByTestId("dot-3")).not.toHaveTextContent("3")
    expect(screen.getByTestId("dot-1").querySelector("svg")).toBeNull()
  })

  it("renders bar indicators for the progress variant", () => {
    render(
      <Steps value={2} variant="progress">
        <StepsItem step={1}>
          <StepsIndicator data-testid="bar-1" />
        </StepsItem>
        <StepsItem step={2}>
          <StepsIndicator data-testid="bar-2" />
        </StepsItem>
        <StepsItem step={3}>
          <StepsIndicator data-testid="bar-3" />
        </StepsItem>
      </Steps>
    )
    // No number is shown (only an sr-only label), and the fill reflects state.
    const complete = screen.getByTestId("bar-1")
    const active = screen.getByTestId("bar-2")
    const upcoming = screen.getByTestId("bar-3")
    expect(complete).toHaveAttribute("data-variant", "progress")
    expect(complete.className).toContain("bg-steps-connector-complete")
    expect(active.className).toContain("bg-steps-connector-complete")
    expect(upcoming.className).toContain("bg-steps-connector")
    expect(upcoming.className).not.toContain("bg-steps-connector-complete")
  })

  it("runs uncontrolled from defaultValue", () => {
    render(
      <Steps defaultValue={2}>
        <StepsItem step={1} data-testid="step-1">
          <StepsIndicator />
        </StepsItem>
        <StepsItem step={2} data-testid="step-2">
          <StepsIndicator />
        </StepsItem>
      </Steps>
    )
    expect(screen.getByTestId("step-1")).toHaveAttribute(
      "data-state",
      "complete"
    )
    expect(screen.getByTestId("step-2")).toHaveAttribute("data-state", "active")
  })

  it("navigates to a step when its trigger is clicked (uncontrolled)", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <Steps defaultValue={1} onValueChange={onValueChange}>
        <StepsItem step={1} data-testid="step-1">
          <StepsTrigger>
            <StepsIndicator />
          </StepsTrigger>
        </StepsItem>
        <StepsItem step={2} data-testid="step-2">
          <StepsTrigger>
            <StepsIndicator />
          </StepsTrigger>
        </StepsItem>
      </Steps>
    )
    const tabs = screen.getAllByRole("tab")
    expect(tabs[0]).toHaveAttribute("aria-selected", "true")

    await user.click(tabs[1])
    expect(onValueChange).toHaveBeenCalledWith(2)
    expect(screen.getByTestId("step-2")).toHaveAttribute("data-state", "active")
  })

  it("does not change internal state when controlled, but still notifies", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <Steps value={1} onValueChange={onValueChange}>
        <StepsItem step={1} data-testid="step-1">
          <StepsTrigger>
            <StepsIndicator />
          </StepsTrigger>
        </StepsItem>
        <StepsItem step={2} data-testid="step-2">
          <StepsTrigger>
            <StepsIndicator />
          </StepsTrigger>
        </StepsItem>
      </Steps>
    )
    await user.click(screen.getAllByRole("tab")[1])
    expect(onValueChange).toHaveBeenCalledWith(2)
    // Value is controlled, so state stays put until the prop changes.
    expect(screen.getByTestId("step-1")).toHaveAttribute("data-state", "active")
  })

  it("moves focus between triggers with the arrow keys", async () => {
    const user = userEvent.setup()
    render(
      <Steps defaultValue={1}>
        <StepsItem step={1}>
          <StepsTrigger>
            <StepsIndicator />
          </StepsTrigger>
        </StepsItem>
        <StepsItem step={2}>
          <StepsTrigger>
            <StepsIndicator />
          </StepsTrigger>
        </StepsItem>
        <StepsItem step={3}>
          <StepsTrigger>
            <StepsIndicator />
          </StepsTrigger>
        </StepsItem>
      </Steps>
    )
    const tabs = screen.getAllByRole("tab")
    tabs[0].focus()
    await user.keyboard("{ArrowRight}")
    expect(tabs[1]).toHaveFocus()
    await user.keyboard("{End}")
    expect(tabs[2]).toHaveFocus()
    await user.keyboard("{Home}")
    expect(tabs[0]).toHaveFocus()
  })

  it("disables a step's trigger", () => {
    render(
      <Steps defaultValue={1}>
        <StepsItem step={1}>
          <StepsTrigger>
            <StepsIndicator />
          </StepsTrigger>
        </StepsItem>
        <StepsItem step={2} disabled>
          <StepsTrigger data-testid="trigger-2">
            <StepsIndicator />
          </StepsTrigger>
        </StepsItem>
      </Steps>
    )
    expect(screen.getByTestId("trigger-2")).toBeDisabled()
  })

  it("shows a spinner on the loading step and keeps it active", () => {
    render(
      <Steps value={2}>
        <StepsItem step={1} data-testid="step-1">
          <StepsIndicator />
        </StepsItem>
        <StepsItem step={2} loading data-testid="step-2">
          <StepsIndicator data-testid="indicator-2" />
        </StepsItem>
      </Steps>
    )
    const item = screen.getByTestId("step-2")
    expect(item).toHaveAttribute("data-state", "active")
    expect(item).toHaveAttribute("data-loading", "true")
    // Spinner replaces the number.
    expect(screen.getByTestId("indicator-2")).not.toHaveTextContent("2")
    expect(
      screen.getByTestId("indicator-2").querySelector("svg")
    ).toBeInTheDocument()
  })

  it("renders the error state with a cross instead of a number", () => {
    render(
      <Steps value={2}>
        <StepsItem step={2} error data-testid="step-2">
          <StepsIndicator data-testid="indicator-2" />
        </StepsItem>
      </Steps>
    )
    expect(screen.getByTestId("step-2")).toHaveAttribute("data-state", "error")
    expect(screen.getByTestId("step-2")).not.toHaveAttribute("aria-current")
    expect(screen.getByTestId("indicator-2")).not.toHaveTextContent("2")
    expect(
      screen.getByTestId("indicator-2").querySelector("svg")
    ).toBeInTheDocument()
  })

  it("forces the completed state via the completed prop", () => {
    render(
      <Steps value={1}>
        <StepsItem step={3} completed data-testid="step-3">
          <StepsIndicator />
        </StepsItem>
      </Steps>
    )
    expect(screen.getByTestId("step-3")).toHaveAttribute(
      "data-state",
      "complete"
    )
  })

  it("applies per-state indicator overrides from the root", () => {
    render(
      <Steps
        value={2}
        indicators={{
          complete: <svg data-testid="done-icon" />,
        }}
      >
        <StepsItem step={1} data-testid="step-1">
          <StepsIndicator data-testid="indicator-1" />
        </StepsItem>
        <StepsItem step={2}>
          <StepsIndicator />
        </StepsItem>
      </Steps>
    )
    expect(screen.getByTestId("done-icon")).toBeInTheDocument()
  })

  it("shows only the active step's panel and hides the rest", () => {
    render(
      <Steps value={2}>
        <StepsPanels>
          <StepsPanel value={1}>Panel one</StepsPanel>
          <StepsPanel value={2}>Panel two</StepsPanel>
          <StepsPanel value={3} forceMount>
            Panel three
          </StepsPanel>
        </StepsPanels>
      </Steps>
    )
    expect(screen.queryByText("Panel one")).not.toBeInTheDocument()
    expect(screen.getByText("Panel two")).toBeVisible()
    // forceMount keeps step 3 mounted but hidden.
    const three = screen.getByText("Panel three")
    expect(three).toBeInTheDocument()
    expect(three).not.toBeVisible()
  })
})

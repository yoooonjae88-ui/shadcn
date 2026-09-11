import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  AlertToolbar,
} from "@/registry/alert/alert"

describe("Alert", () => {
  it("renders an alert role with its content", () => {
    render(
      <Alert>
        <AlertIcon>i</AlertIcon>
        <AlertContent>
          <AlertTitle>Heads up</AlertTitle>
          <AlertDescription>Something happened.</AlertDescription>
        </AlertContent>
        <AlertToolbar>
          <button>Undo</button>
        </AlertToolbar>
      </Alert>
    )
    const alert = screen.getByRole("alert")
    expect(alert).toContainElement(screen.getByText("Heads up"))
    expect(alert).toContainElement(screen.getByText("Something happened."))
    expect(alert).toContainElement(screen.getByRole("button", { name: "Undo" }))
  })

  it("applies variant/appearance compound classes", () => {
    const { rerender } = render(
      <Alert variant="destructive" appearance="solid">
        <AlertTitle>Error</AlertTitle>
      </Alert>
    )
    expect(screen.getByRole("alert").className).toContain(
      "bg-alert-destructive"
    )

    rerender(
      <Alert variant="success" appearance="light">
        <AlertTitle>Saved</AlertTitle>
      </Alert>
    )
    expect(screen.getByRole("alert").className).toContain(
      "bg-alert-success/10"
    )
  })

  it("applies size classes", () => {
    render(
      <Alert size="lg">
        <AlertTitle>Big</AlertTitle>
      </Alert>
    )
    expect(screen.getByRole("alert").className).toContain("text-base")
  })

  it("shows no dismiss button by default", () => {
    render(
      <Alert>
        <AlertTitle>Static</AlertTitle>
      </Alert>
    )
    expect(
      screen.queryByRole("button", { name: "Dismiss" })
    ).not.toBeInTheDocument()
  })

  it("dismisses itself and calls onClose when the close button is clicked", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Alert close onClose={onClose}>
        <AlertTitle>Closable</AlertTitle>
      </Alert>
    )

    await user.click(screen.getByRole("button", { name: "Dismiss" }))
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

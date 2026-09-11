import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/empty/empty"

function renderEmpty(props: React.ComponentProps<typeof Empty> = {}) {
  return render(
    <Empty data-testid="empty" {...props}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <svg />
        </EmptyMedia>
        <EmptyTitle>No projects</EmptyTitle>
        <EmptyDescription>Create your first project.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <button>New project</button>
      </EmptyContent>
    </Empty>
  )
}

describe("Empty", () => {
  it("composes header, title, description and content", () => {
    renderEmpty()
    const empty = screen.getByTestId("empty")
    expect(empty).toContainElement(screen.getByText("No projects"))
    expect(empty).toContainElement(
      screen.getByText("Create your first project.")
    )
    expect(empty).toContainElement(
      screen.getByRole("button", { name: "New project" })
    )
  })

  it("defaults to the bare variant", () => {
    renderEmpty()
    expect(screen.getByTestId("empty")).toHaveAttribute(
      "data-variant",
      "default"
    )
  })

  it("applies the outline and background variants", () => {
    const { rerender } = render(<Empty data-testid="empty" variant="outline" />)
    expect(screen.getByTestId("empty")).toHaveClass("border-dashed")

    rerender(<Empty data-testid="empty" variant="background" />)
    expect(screen.getByTestId("empty")).toHaveClass("bg-gradient-to-b")
  })

  it("wraps icon media in a muted tile", () => {
    renderEmpty()
    const media = screen
      .getByTestId("empty")
      .querySelector("[data-slot='empty-media']")
    expect(media).toHaveAttribute("data-variant", "icon")
    expect(media).toHaveClass("bg-muted")
  })
})

import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/registry/timeline/timeline"

function renderTimeline(props: React.ComponentProps<typeof Timeline> = {}) {
  return render(
    <Timeline {...props}>
      {[1, 2, 3].map((step) => (
        <TimelineItem key={step} step={step}>
          <TimelineHeader>
            <TimelineTitle>Step {step}</TimelineTitle>
          </TimelineHeader>
          <TimelineSeparator />
          <TimelineIndicator>{step}</TimelineIndicator>
          <TimelineContent>Body {step}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

function items() {
  return Array.from(document.querySelectorAll("[data-slot='timeline-item']"))
}

describe("Timeline", () => {
  it("renders a list of items with titles and content", () => {
    renderTimeline()
    expect(screen.getByRole("list")).toBeInTheDocument()
    expect(screen.getAllByRole("listitem")).toHaveLength(3)
    expect(screen.getByText("Step 2")).toBeInTheDocument()
    expect(screen.getByText("Body 3")).toBeInTheDocument()
  })

  it("marks every item complete when no value is set", () => {
    renderTimeline()
    for (const item of items()) {
      expect(item).toHaveAttribute("data-completed")
    }
  })

  it("marks only steps up to value as complete", () => {
    renderTimeline({ value: 2 })
    const [first, second, third] = items()
    expect(first).toHaveAttribute("data-completed")
    expect(second).toHaveAttribute("data-completed")
    expect(third).not.toHaveAttribute("data-completed")
  })

  it("upcoming indicators fall back to the muted dot", () => {
    renderTimeline({ value: 1 })
    const indicators = document.querySelectorAll(
      "[data-slot='timeline-indicator']"
    )
    expect(indicators[0]).toHaveClass("bg-timeline-primary")
    expect(indicators[2]).toHaveClass("bg-timeline-dot")
  })

  it("lays out horizontally when requested", () => {
    renderTimeline({ orientation: "horizontal" })
    expect(screen.getByRole("list")).toHaveAttribute(
      "data-orientation",
      "horizontal"
    )
    for (const item of items()) {
      expect(item).toHaveAttribute("data-orientation", "horizontal")
    }
  })

  it("alternates items around a centered rail", () => {
    renderTimeline({ alternate: true })
    const headers = document.querySelectorAll("[data-slot='timeline-header']")
    // Odd steps sit at the start, even steps at the end.
    expect(headers[0]).toHaveClass("me-auto")
    expect(headers[1]).toHaveClass("ms-auto")
  })
})

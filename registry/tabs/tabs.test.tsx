import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/tabs/tabs"

function renderTabs() {
  return render(
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview content</TabsContent>
      <TabsContent value="analytics">Analytics content</TabsContent>
    </Tabs>
  )
}

describe("Tabs", () => {
  it("renders a tablist with all tabs", () => {
    renderTabs()
    expect(screen.getByRole("tablist")).toBeInTheDocument()
    expect(screen.getAllByRole("tab")).toHaveLength(2)
  })

  it("selects the default tab and shows its panel", () => {
    renderTabs()
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
    expect(screen.getByText("Overview content")).toBeInTheDocument()
    expect(screen.queryByText("Analytics content")).not.toBeInTheDocument()
  })

  it("switches panels when another tab is clicked", async () => {
    const user = userEvent.setup()
    renderTabs()

    await user.click(screen.getByRole("tab", { name: "Analytics" }))

    expect(screen.getByRole("tab", { name: "Analytics" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute(
      "aria-selected",
      "false"
    )
    expect(screen.getByText("Analytics content")).toBeInTheDocument()
    expect(screen.queryByText("Overview content")).not.toBeInTheDocument()
  })

  it("supports keyboard navigation between tabs", async () => {
    const user = userEvent.setup()
    renderTabs()

    const overview = screen.getByRole("tab", { name: "Overview" })
    overview.focus()
    await user.keyboard("{ArrowRight}")

    expect(screen.getByRole("tab", { name: "Analytics" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
  })

  it("marks the selected tab with data-active for styling", async () => {
    renderTabs()
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute(
      "data-active"
    )
    expect(screen.getByRole("tab", { name: "Analytics" })).not.toHaveAttribute(
      "data-active"
    )
  })

  it("defaults to the segmented variant", () => {
    renderTabs()
    expect(screen.getByRole("tablist")).toHaveAttribute("data-variant", "default")
    screen
      .getAllByRole("tab")
      .forEach((tab) => expect(tab).toHaveAttribute("data-variant", "default"))
  })

  it("propagates the line variant from the list to its triggers", () => {
    render(
      <Tabs defaultValue="overview">
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview content</TabsContent>
      </Tabs>
    )
    expect(screen.getByRole("tablist")).toHaveAttribute("data-variant", "line")
    screen
      .getAllByRole("tab")
      .forEach((tab) => expect(tab).toHaveAttribute("data-variant", "line"))
    // Line variant drops the segmented pill background.
    expect(screen.getByRole("tablist").className).not.toContain("bg-muted")
  })
})

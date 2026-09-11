import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Anchor, type AnchorItem } from "@/registry/anchor/anchor"

const items: AnchorItem[] = [
  { key: "intro", href: "#intro", title: "Introduction" },
  {
    key: "usage",
    href: "#usage",
    title: "Usage",
    children: [{ key: "install", href: "#install", title: "Install" }],
  },
]

function renderWithSections(
  props: Partial<React.ComponentProps<typeof Anchor>> = {}
) {
  return render(
    <>
      <div id="intro" />
      <div id="usage" />
      <div id="install" />
      <Anchor items={items} {...props} />
    </>
  )
}

describe("Anchor", () => {
  it("renders a nav with all links, including nested ones", () => {
    renderWithSections()
    expect(screen.getByRole("navigation")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Introduction" })).toHaveAttribute(
      "href",
      "#intro"
    )
    expect(screen.getByRole("link", { name: "Install" })).toHaveAttribute(
      "href",
      "#install"
    )
  })

  it("hides nested links in horizontal direction", () => {
    renderWithSections({ direction: "horizontal" })
    expect(
      screen.queryByRole("link", { name: "Install" })
    ).not.toBeInTheDocument()
  })

  it("is sticky by default and unpinned with affix=false", () => {
    const { rerender } = renderWithSections()
    expect(screen.getByRole("navigation")).toHaveClass("sticky")

    rerender(
      <>
        <div id="intro" />
        <Anchor items={items} affix={false} />
      </>
    )
    expect(screen.getByRole("navigation")).not.toHaveClass("sticky")
  })

  it("marks the clicked link active and fires onClick and onChange", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onChange = vi.fn()
    renderWithSections({ onClick, onChange })

    const link = screen.getByRole("link", { name: "Usage" })
    await user.click(link)

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onClick.mock.calls[0][1]).toEqual({ title: "Usage", href: "#usage" })
    expect(onChange).toHaveBeenCalledWith("#usage")
    expect(link).toHaveAttribute("aria-current", "true")
    expect(link).toHaveAttribute("data-active")
  })

  it("lets getCurrentAnchor override the highlighted link", () => {
    renderWithSections({ getCurrentAnchor: () => "#install" })
    expect(screen.getByRole("link", { name: "Install" })).toHaveAttribute(
      "data-active"
    )
    expect(screen.getByRole("link", { name: "Usage" })).not.toHaveAttribute(
      "data-active"
    )
  })

  it("indents nested links one step deeper", () => {
    renderWithSections()
    expect(screen.getByRole("link", { name: "Usage" })).toHaveStyle({
      paddingLeft: "16px",
    })
    expect(screen.getByRole("link", { name: "Install" })).toHaveStyle({
      paddingLeft: "32px",
    })
  })
})

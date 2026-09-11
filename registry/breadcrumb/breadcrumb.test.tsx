import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/breadcrumb/breadcrumb"

function renderBreadcrumb() {
  return render(
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

describe("Breadcrumb", () => {
  it("renders a navigation landmark labelled breadcrumb", () => {
    renderBreadcrumb()
    expect(
      screen.getByRole("navigation", { name: "breadcrumb" })
    ).toBeInTheDocument()
  })

  it("renders links with their targets", () => {
    renderBreadcrumb()
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/"
    )
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "href",
      "/docs"
    )
  })

  it("marks the current page with aria-current", () => {
    renderBreadcrumb()
    const page = screen.getByText("Breadcrumb")
    expect(page).toHaveAttribute("aria-current", "page")
    expect(page).toHaveAttribute("aria-disabled", "true")
  })

  it("hides separators from assistive technology", () => {
    const { container } = renderBreadcrumb()
    const separators = container.querySelectorAll(
      '[data-slot="breadcrumb-separator"]'
    )
    expect(separators).toHaveLength(2)
    separators.forEach((separator) => {
      expect(separator).toHaveAttribute("aria-hidden", "true")
    })
  })

  it("supports a custom separator", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Here</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    expect(screen.getByText("/")).toBeInTheDocument()
  })

  it("renders a custom element when asChild is set, merging classes", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="wrapper-class">
              <button type="button" className="child-class">
                Settings
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    const el = screen.getByRole("button", { name: "Settings" })
    expect(el.tagName).toBe("BUTTON")
    expect(el).toHaveAttribute("data-slot", "breadcrumb-link")
    expect(el).toHaveClass("wrapper-class")
    expect(el).toHaveClass("child-class")
  })

  it("renders an ellipsis with screen-reader text", () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    const ellipsis = container.querySelector(
      '[data-slot="breadcrumb-ellipsis"]'
    )
    expect(ellipsis).toHaveAttribute("aria-hidden", "true")
    expect(ellipsis).toHaveTextContent("More")
  })
})

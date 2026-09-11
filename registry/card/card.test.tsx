import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeading,
  CardMedia,
  CardMediaOverlay,
  CardTable,
  CardTitle,
  CardToolbar,
} from "@/registry/card/card"

describe("Card", () => {
  it("renders all sections with their content", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card title</CardTitle>
          <CardDescription>Card description</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>Card content</CardContent>
        <CardFooter>Card footer</CardFooter>
      </Card>
    )

    expect(screen.getByText("Card title")).toBeInTheDocument()
    expect(screen.getByText("Card description")).toBeInTheDocument()
    expect(screen.getByText("Action")).toBeInTheDocument()
    expect(screen.getByText("Card content")).toBeInTheDocument()
    expect(screen.getByText("Card footer")).toBeInTheDocument()
  })

  it("exposes data-slot attributes for styling hooks", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    )

    expect(container.querySelector('[data-slot="card"]')).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="card-header"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="card-title"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="card-content"]')
    ).toBeInTheDocument()
  })

  it("merges a custom className with the defaults", () => {
    const { container } = render(<Card className="w-96">Content</Card>)
    const card = container.querySelector('[data-slot="card"]')

    expect(card).toHaveClass("w-96")
    expect(card).toHaveClass("rounded-xl")
  })

  it("forwards arbitrary props to the underlying element", () => {
    render(<Card data-testid="my-card">Content</Card>)
    expect(screen.getByTestId("my-card")).toBeInTheDocument()
  })

  it("is outlined by default and clips overflow", () => {
    const { container } = render(<Card>Content</Card>)
    const card = container.querySelector('[data-slot="card"]')

    expect(card).toHaveClass("border")
    expect(card).toHaveClass("border-card-border")
    expect(card).toHaveClass("overflow-hidden")
  })

  it("drops the outline in the ghost variant", () => {
    const { container } = render(<Card variant="ghost">Content</Card>)
    const card = container.querySelector('[data-slot="card"]')

    expect(card).toHaveAttribute("data-variant", "ghost")
    expect(card).toHaveClass("border-transparent")
  })

  it("applies the accent surface variant", () => {
    const { container } = render(<Card variant="accent">Content</Card>)
    const card = container.querySelector('[data-slot="card"]')

    expect(card).toHaveAttribute("data-variant", "accent")
    expect(card).toHaveClass("bg-card-accent")
  })

  it("renders full-bleed media with a fade overlay", () => {
    const { container } = render(
      <Card>
        <CardMedia>
          <div>cover</div>
          <CardMediaOverlay />
        </CardMedia>
        <CardContent>Body</CardContent>
      </Card>
    )

    expect(
      container.querySelector('[data-slot="card-media"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="card-media-overlay"]')
    ).toHaveClass("from-card")
  })

  it("renders the ReUI heading, toolbar and table slots", () => {
    const { container } = render(
      <Card>
        <CardHeader separator>
          <CardHeading>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeading>
          <CardToolbar>Toolbar</CardToolbar>
        </CardHeader>
        <CardTable>
          <table>
            <tbody>
              <tr>
                <td>Cell</td>
              </tr>
            </tbody>
          </table>
        </CardTable>
      </Card>
    )

    expect(
      container.querySelector('[data-slot="card-heading"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="card-toolbar"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="card-table"]')
    ).toBeInTheDocument()
    expect(screen.getByText("Cell")).toBeInTheDocument()
  })

  it("draws opt-in separators on header and footer", () => {
    const { container } = render(
      <Card>
        <CardHeader separator>Header</CardHeader>
        <CardFooter separator>Footer</CardFooter>
      </Card>
    )

    const header = container.querySelector('[data-slot="card-header"]')
    const footer = container.querySelector('[data-slot="card-footer"]')

    expect(header).toHaveClass("border-b")
    expect(header).toHaveClass("border-card-border")
    expect(footer).toHaveClass("border-t")
  })

  it("keeps header borderless by default", () => {
    const { container } = render(
      <Card>
        <CardHeader>Header</CardHeader>
      </Card>
    )
    const header = container.querySelector('[data-slot="card-header"]')

    expect(header).not.toHaveClass("border-b")
  })
})

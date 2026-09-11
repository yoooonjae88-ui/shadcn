import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/registry/carousel/carousel"

// Embla measures real layout, which jsdom doesn't do — these tests cover the
// structure, a11y contract and initial control state; scrolling behaviour is
// exercised in the browser via /preview.
function renderCarousel(
  props: Partial<React.ComponentProps<typeof Carousel>> = {}
) {
  return render(
    <Carousel {...props}>
      <CarouselContent>
        {[1, 2, 3].map((n) => (
          <CarouselItem key={n}>Slide {n}</CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

describe("Carousel", () => {
  it("renders a carousel region with slides", () => {
    renderCarousel()
    const region = screen.getByRole("region")
    expect(region).toHaveAttribute("aria-roledescription", "carousel")

    const slides = screen.getAllByRole("group")
    expect(slides).toHaveLength(3)
    for (const slide of slides) {
      expect(slide).toHaveAttribute("aria-roledescription", "slide")
    }
  })

  it("renders prev/next controls with accessible names", () => {
    renderCarousel()
    expect(
      screen.getByRole("button", { name: "Previous slide" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Next slide" })
    ).toBeInTheDocument()
  })

  it("disables the previous control on the first slide", () => {
    renderCarousel()
    expect(screen.getByRole("button", { name: "Previous slide" })).toBeDisabled()
  })

  it("hands the Embla api to setApi once mounted", () => {
    let api: unknown
    renderCarousel({ setApi: (a) => (api = a) })
    expect(api).toBeDefined()
    expect(typeof (api as { scrollNext: unknown }).scrollNext).toBe("function")
  })

  it("lays out vertically when orientation is vertical", () => {
    render(
      <Carousel orientation="vertical">
        <CarouselContent data-testid="track">
          <CarouselItem data-testid="item">Slide</CarouselItem>
        </CarouselContent>
      </Carousel>
    )
    expect(screen.getByTestId("track")).toHaveClass("flex-col")
    expect(screen.getByTestId("item")).toHaveClass("pt-4")
  })

  it("throws when a part is used outside <Carousel>", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<CarouselItem>Lonely</CarouselItem>)).toThrow(
      "useCarousel must be used within a <Carousel />"
    )
    spy.mockRestore()
  })
})

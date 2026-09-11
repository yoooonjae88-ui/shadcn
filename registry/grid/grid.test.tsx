import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Col, Row } from "@/registry/grid/grid"

// jsdom's matchMedia stub (vitest.setup.ts) never matches, so every test runs
// at the mobile-first base breakpoint.

describe("Row", () => {
  it("renders a wrapping flex row by default", () => {
    render(<Row data-testid="row" />)
    expect(screen.getByTestId("row")).toHaveClass(
      "flex",
      "flex-wrap",
      "justify-start",
      "items-start"
    )
  })

  it("maps justify and align to classes", () => {
    render(<Row data-testid="row" justify="space-between" align="middle" />)
    expect(screen.getByTestId("row")).toHaveClass(
      "justify-between",
      "items-center"
    )
  })

  it("can disable wrapping", () => {
    render(<Row data-testid="row" wrap={false} />)
    expect(screen.getByTestId("row")).toHaveClass("flex-nowrap")
  })

  it("applies a horizontal gutter as negative margins plus column padding", () => {
    render(
      <Row data-testid="row" gutter={16}>
        <Col data-testid="col" span={12} />
      </Row>
    )
    expect(screen.getByTestId("row")).toHaveStyle({
      marginLeft: "-8px",
      marginRight: "-8px",
    })
    expect(screen.getByTestId("col")).toHaveStyle({
      paddingLeft: "8px",
      paddingRight: "8px",
    })
  })

  it("applies the vertical gutter as row-gap", () => {
    render(<Row data-testid="row" gutter={[0, 24]} />)
    expect(screen.getByTestId("row")).toHaveStyle({ rowGap: "24px" })
  })
})

describe("Col", () => {
  it("sizes a span as a percentage of 24 columns", () => {
    render(<Col data-testid="col" span={12} />)
    expect(screen.getByTestId("col")).toHaveStyle({
      flex: "0 0 50%",
      maxWidth: "50%",
    })
  })

  it("hides a span of 0", () => {
    render(<Col data-testid="col" span={0} />)
    expect(screen.getByTestId("col")).toHaveStyle({ display: "none" })
  })

  it("applies offset, order, push and pull", () => {
    render(
      <Col data-testid="col" span={6} offset={6} order={2} push={3} pull={1} />
    )
    const col = screen.getByTestId("col")
    expect(col).toHaveStyle({
      marginLeft: "25%",
      order: "2",
      position: "relative",
      left: "12.5%",
    })
  })

  it("parses flex values", () => {
    const { rerender } = render(<Col data-testid="col" flex={1} />)
    expect(screen.getByTestId("col")).toHaveStyle({ flex: "1 1 auto" })

    rerender(<Col data-testid="col" flex="200px" />)
    expect(screen.getByTestId("col")).toHaveStyle({ flex: "0 0 200px" })

    rerender(<Col data-testid="col" flex="1 0 50%" />)
    expect(screen.getByTestId("col")).toHaveStyle({ flex: "1 0 50%" })
  })

  it("uses the base span when no breakpoint matches", () => {
    render(<Col data-testid="col" span={24} md={12} />)
    // matchMedia never matches in jsdom, so the md override is ignored.
    expect(screen.getByTestId("col")).toHaveStyle({ maxWidth: "100%" })
  })
})

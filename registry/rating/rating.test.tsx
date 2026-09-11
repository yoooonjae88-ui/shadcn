import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Rating } from "@/registry/rating/rating"

describe("Rating", () => {
  it("renders a read-only rating as an image with a label", () => {
    render(<Rating rating={3} />)
    const rating = screen.getByRole("img", { name: "Rating: 3 out of 5" })
    expect(rating).toBeInTheDocument()
    expect(rating).not.toHaveAttribute("tabindex")
  })

  it("renders maxRating stars", () => {
    render(<Rating rating={2} maxRating={7} />)
    expect(
      document.querySelectorAll("[data-slot='rating-star-empty']")
    ).toHaveLength(7)
  })

  it("fills stars proportionally, including partial fills", () => {
    render(<Rating rating={2.5} />)
    const fills = Array.from(
      document.querySelectorAll("[data-slot='rating-star-filled']")
    ).map((el) => (el.parentElement as HTMLElement).style.width)
    expect(fills).toEqual(["100%", "100%", "50%", "0%", "0%"])
  })

  it("shows the numeric readout with showValue", () => {
    render(<Rating rating={3.7} showValue />)
    expect(screen.getByText("3.7")).toBeInTheDocument()
  })

  it("becomes a slider when editable and commits clicks", async () => {
    const user = userEvent.setup()
    const onRatingChange = vi.fn()
    render(<Rating rating={2} editable onRatingChange={onRatingChange} />)

    const slider = screen.getByRole("slider")
    expect(slider).toHaveAttribute("aria-valuenow", "2")

    await user.click(screen.getByRole("button", { name: "Rate 4 out of 5" }))
    expect(onRatingChange).toHaveBeenCalledWith(4)
  })

  it("supports half-value picks with allowHalf", async () => {
    const user = userEvent.setup()
    const onRatingChange = vi.fn()
    render(
      <Rating rating={0} editable allowHalf onRatingChange={onRatingChange} />
    )

    await user.click(screen.getByRole("button", { name: "Rate 2.5 out of 5" }))
    expect(onRatingChange).toHaveBeenCalledWith(2.5)
  })

  it("adjusts the value with arrow keys", () => {
    const onRatingChange = vi.fn()
    render(<Rating rating={2} editable onRatingChange={onRatingChange} />)
    const slider = screen.getByRole("slider")

    fireEvent.keyDown(slider, { key: "ArrowRight" })
    expect(onRatingChange).toHaveBeenLastCalledWith(3)

    fireEvent.keyDown(slider, { key: "ArrowLeft" })
    expect(onRatingChange).toHaveBeenLastCalledWith(1)

    fireEvent.keyDown(slider, { key: "End" })
    expect(onRatingChange).toHaveBeenLastCalledWith(5)

    fireEvent.keyDown(slider, { key: "Home" })
    expect(onRatingChange).toHaveBeenLastCalledWith(0)
  })

  it("ignores interaction when disabled or readOnly", async () => {
    const onRatingChange = vi.fn()
    const { rerender } = render(
      <Rating rating={2} editable disabled onRatingChange={onRatingChange} />
    )
    // Disabled/readOnly ratings render no click targets at all.
    expect(screen.queryAllByRole("button")).toHaveLength(0)

    rerender(
      <Rating rating={2} editable readOnly onRatingChange={onRatingChange} />
    )
    expect(screen.queryAllByRole("button")).toHaveLength(0)
  })
})

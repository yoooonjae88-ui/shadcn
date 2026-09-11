import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  Popover,
  PopoverContent,
  PopoverFeedback,
  PopoverItem,
  PopoverLink,
  PopoverSeparator,
  PopoverTrigger,
} from "@/registry/popover/popover"

describe("Popover", () => {
  function renderPopover() {
    return render(
      <Popover>
        <PopoverTrigger>Open menu</PopoverTrigger>
        <PopoverContent>
          <PopoverItem>Copy</PopoverItem>
          <PopoverSeparator />
          <PopoverLink href="/docs">Docs</PopoverLink>
        </PopoverContent>
      </Popover>
    )
  }

  it("is closed until the trigger is clicked", () => {
    renderPopover()
    expect(screen.queryByText("Copy")).not.toBeInTheDocument()
  })

  it("opens on click and shows items, separator and links", async () => {
    const user = userEvent.setup()
    renderPopover()

    await user.click(screen.getByRole("button", { name: "Open menu" }))
    expect(await screen.findByText("Copy")).toBeInTheDocument()
    expect(screen.getByRole("separator")).toBeInTheDocument()
    // PopoverLink renders an <a> that Base UI exposes with a button role.
    expect(screen.getByRole("button", { name: "Docs" })).toHaveAttribute(
      "href",
      "/docs"
    )
  })

  it("clicking an item closes the popover", async () => {
    const user = userEvent.setup()
    renderPopover()

    await user.click(screen.getByRole("button", { name: "Open menu" }))
    await user.click(await screen.findByText("Copy"))
    await waitFor(() =>
      expect(screen.queryByText("Copy")).not.toBeInTheDocument()
    )
  })
})

describe("PopoverFeedback", () => {
  it("opens from the default trigger and collects feedback", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<PopoverFeedback onSubmit={onSubmit} />)

    await user.click(screen.getByRole("button", { name: /Feedback/ }))
    expect(
      await screen.findByPlaceholderText("Tell us what's on your mind…")
    ).toBeInTheDocument()

    // Pick a sentiment and write a message.
    await user.click(screen.getByRole("radio", { name: "Good" }))
    await user.type(
      screen.getByPlaceholderText("Tell us what's on your mind…"),
      "Love it"
    )
    await user.click(screen.getByRole("button", { name: "Send feedback" }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    expect(onSubmit).toHaveBeenCalledWith({
      sentiment: 4,
      category: null,
      message: "Love it",
      email: "",
    })
    // Success state replaces the form.
    expect(
      await screen.findByText("Thanks for your feedback!")
    ).toBeInTheDocument()
  })

  it("keeps submit disabled until required fields are filled", async () => {
    const user = userEvent.setup()
    render(<PopoverFeedback defaultOpen />)

    const submit = await screen.findByRole("button", { name: "Send feedback" })
    expect(submit).toBeDisabled()

    await user.type(
      screen.getByPlaceholderText("Tell us what's on your mind…"),
      "hi"
    )
    expect(submit).toBeEnabled()
  })

  it("shows an inline error when the submit handler rejects", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockRejectedValue(new Error("Network down"))
    render(<PopoverFeedback defaultOpen onSubmit={onSubmit} />)

    await user.type(
      await screen.findByPlaceholderText("Tell us what's on your mind…"),
      "hi"
    )
    await user.click(screen.getByRole("button", { name: "Send feedback" }))
    expect(await screen.findByText("Network down")).toBeInTheDocument()
  })
})

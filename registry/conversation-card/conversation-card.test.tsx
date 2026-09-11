import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  ConversationCard,
  sortConversations,
} from "@/registry/conversation-card/conversation-card"

describe("ConversationCard", () => {
  it("renders title, time and preview", () => {
    render(
      <ConversationCard title="Ada" time="9:41 AM" lastMessage="See you soon" />
    )
    expect(screen.getByText("Ada")).toBeInTheDocument()
    expect(screen.getByText("9:41 AM")).toBeInTheDocument()
    expect(screen.getByText("See you soon")).toBeInTheDocument()
  })

  it("truncates the preview to previewLength characters", () => {
    render(
      <ConversationCard
        title="Ada"
        lastMessage="A quite long message that should be truncated"
        previewLength={10}
      />
    )
    expect(screen.getByText("A quite lo…")).toBeInTheDocument()
  })

  it("fires onClick like a button", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<ConversationCard title="Ada" onClick={onClick} />)

    await user.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("marks the selected conversation", () => {
    render(<ConversationCard title="Ada" selected />)
    const card = screen.getByRole("button")
    expect(card).toHaveAttribute("aria-pressed", "true")
    expect(card).toHaveAttribute("data-selected")
  })

  it("shows a pin icon on pinned cards", () => {
    render(<ConversationCard title="Ada" pinned />)
    expect(
      document.querySelector("[data-slot='conversation-card-pin']")
    ).toBeInTheDocument()
  })

  it("uses the group glyph for group conversations", () => {
    render(<ConversationCard title="Team" type="group" />)
    expect(
      document.querySelector("[data-slot='conversation-card-icon']")
    ).toHaveAttribute("data-type", "group")
  })

  describe("unread badge", () => {
    it("shows the unread count", () => {
      render(<ConversationCard title="Ada" unreadCount={3} />)
      expect(screen.getByLabelText("3 new messages")).toHaveTextContent("3")
    })

    it("caps the display at 99+", () => {
      render(<ConversationCard title="Ada" unreadCount={150} />)
      expect(screen.getByText("99+")).toBeInTheDocument()
    })

    it("hides a zero count unless showZero", () => {
      const { rerender } = render(
        <ConversationCard title="Ada" unreadCount={0} />
      )
      expect(
        document.querySelector("[data-slot='conversation-card-badge']")
      ).not.toBeInTheDocument()

      rerender(<ConversationCard title="Ada" unreadCount={0} showZero />)
      expect(
        document.querySelector("[data-slot='conversation-card-badge']")
      ).toBeInTheDocument()
    })
  })
})

describe("sortConversations", () => {
  it("floats pinned conversations to the top, preserving order", () => {
    const sorted = sortConversations([
      { id: 1, pinned: false },
      { id: 2, pinned: true },
      { id: 3 },
      { id: 4, pinned: true },
    ])
    expect(sorted.map((c) => c.id)).toEqual([2, 4, 1, 3])
  })

  it("does not mutate the input", () => {
    const input = [{ id: 1 }, { id: 2, pinned: true }]
    sortConversations(input)
    expect(input.map((c) => c.id)).toEqual([1, 2])
  })
})

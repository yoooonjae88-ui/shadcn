import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  ChatBubble,
  ChatBubbleDeleteDialog,
  ChatBubbleMenu,
  ChatBubbleMessage,
  ChatBubbleQuote,
  ChatBubbleSender,
  ChatBubbleTimestamp,
} from "@/registry/chat-bubble/chat-bubble"

describe("ChatBubble", () => {
  it("aligns incoming messages to the start and outgoing to the end", () => {
    const { rerender } = render(
      <ChatBubble data-testid="bubble">
        <ChatBubbleMessage>Hi</ChatBubbleMessage>
      </ChatBubble>
    )
    expect(screen.getByTestId("bubble")).toHaveClass("justify-start")

    rerender(
      <ChatBubble data-testid="bubble" variant="outgoing">
        <ChatBubbleMessage>Hi</ChatBubbleMessage>
      </ChatBubble>
    )
    expect(screen.getByTestId("bubble")).toHaveClass("justify-end")
  })

  it("colors the message by variant from context", () => {
    render(
      <ChatBubble variant="outgoing">
        <ChatBubbleMessage data-testid="msg">Hi</ChatBubbleMessage>
      </ChatBubble>
    )
    const msg = screen.getByTestId("msg")
    expect(msg).toHaveAttribute("data-variant", "outgoing")
    expect(msg).toHaveClass("bg-primary")
  })

  it("renders the corner tail by default and omits it with tail=false", () => {
    const { rerender } = render(
      <ChatBubble>
        <ChatBubbleMessage>Hi</ChatBubbleMessage>
      </ChatBubble>
    )
    expect(
      document.querySelector("[data-slot='chat-bubble-tail']")
    ).toBeInTheDocument()

    rerender(
      <ChatBubble>
        <ChatBubbleMessage tail={false}>Hi</ChatBubbleMessage>
      </ChatBubble>
    )
    expect(
      document.querySelector("[data-slot='chat-bubble-tail']")
    ).not.toBeInTheDocument()
  })

  it("renders the sender name", () => {
    render(
      <ChatBubble>
        <ChatBubbleMessage>
          <ChatBubbleSender>Ada</ChatBubbleSender>
          Hello
        </ChatBubbleMessage>
      </ChatBubble>
    )
    expect(screen.getByText("Ada")).toHaveAttribute(
      "data-slot",
      "chat-bubble-sender"
    )
  })

  it("shows delivery ticks only on outgoing messages", () => {
    const { rerender } = render(
      <ChatBubble variant="outgoing">
        <ChatBubbleMessage>
          Hi
          <ChatBubbleTimestamp status="read">10:12</ChatBubbleTimestamp>
        </ChatBubbleMessage>
      </ChatBubble>
    )
    expect(
      document.querySelector("[data-slot='chat-bubble-status']")
    ).toHaveAttribute("data-status", "read")

    rerender(
      <ChatBubble variant="incoming">
        <ChatBubbleMessage>
          Hi
          <ChatBubbleTimestamp status="read">10:12</ChatBubbleTimestamp>
        </ChatBubbleMessage>
      </ChatBubble>
    )
    expect(
      document.querySelector("[data-slot='chat-bubble-status']")
    ).not.toBeInTheDocument()
  })
})

describe("ChatBubble selection mode", () => {
  it("shows the tick and toggles on click and Space", async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()

    render(
      <ChatBubble
        data-testid="bubble"
        selectable
        onSelectedChange={onSelectedChange}
      >
        <ChatBubbleMessage>Hi</ChatBubbleMessage>
      </ChatBubble>
    )

    const row = screen.getByTestId("bubble")
    expect(row).toHaveAttribute("role", "checkbox")
    expect(row).toHaveAttribute("aria-checked", "false")
    expect(
      document.querySelector("[data-slot='chat-bubble-select-indicator']")
    ).toBeInTheDocument()

    await user.click(row)
    expect(onSelectedChange).toHaveBeenLastCalledWith(true)

    row.focus()
    await user.keyboard(" ")
    expect(onSelectedChange).toHaveBeenCalledTimes(2)
  })

  it("marks the row checked when selected and stays inert when not selectable", async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()

    const { rerender } = render(
      <ChatBubble data-testid="bubble" selectable selected>
        <ChatBubbleMessage>Hi</ChatBubbleMessage>
      </ChatBubble>
    )
    expect(screen.getByTestId("bubble")).toHaveAttribute("aria-checked", "true")

    rerender(
      <ChatBubble data-testid="bubble" onSelectedChange={onSelectedChange}>
        <ChatBubbleMessage>Hi</ChatBubbleMessage>
      </ChatBubble>
    )
    await user.click(screen.getByTestId("bubble"))
    expect(onSelectedChange).not.toHaveBeenCalled()
    expect(
      document.querySelector("[data-slot='chat-bubble-select-indicator']")
    ).not.toBeInTheDocument()
  })
})

describe("ChatBubbleQuote", () => {
  it("renders the quoted sender and text", () => {
    render(
      <ChatBubble>
        <ChatBubbleMessage>
          <ChatBubbleQuote sender="Priya">Original message</ChatBubbleQuote>
          My reply
        </ChatBubbleMessage>
      </ChatBubble>
    )

    expect(screen.getByText("Priya")).toHaveAttribute(
      "data-slot",
      "chat-bubble-quote-sender"
    )
    expect(screen.getByText("Original message")).toBeInTheDocument()
  })

  it("takes its tint from the bubble variant", () => {
    render(
      <ChatBubble variant="outgoing">
        <ChatBubbleQuote data-testid="quote">Quoted</ChatBubbleQuote>
      </ChatBubble>
    )
    expect(screen.getByTestId("quote")).toHaveAttribute(
      "data-variant",
      "outgoing"
    )
  })
})

describe("ChatBubbleMenu", () => {
  it("renders only the actions it was given a handler for", async () => {
    const user = userEvent.setup()
    render(
      <ChatBubble>
        <ChatBubbleMessage
          actions={<ChatBubbleMenu onReply={() => {}} copyText="Hi" />}
        >
          Hi
        </ChatBubbleMessage>
      </ChatBubble>
    )

    await user.click(screen.getByRole("button", { name: "Message actions" }))
    expect(await screen.findByText("Reply")).toBeInTheDocument()
    expect(screen.getByText("Copy")).toBeInTheDocument()
    expect(screen.queryByText("Forward")).not.toBeInTheDocument()
    expect(screen.queryByText("Select messages")).not.toBeInTheDocument()
    expect(screen.queryByText("Delete")).not.toBeInTheDocument()
  })

  it("copies the message text and reports the reply and select actions", async () => {
    const user = userEvent.setup()
    // userEvent.setup() installs a clipboard stub we can spy on.
    const writeText = vi.spyOn(navigator.clipboard, "writeText")

    const onReply = vi.fn()
    const onSelectMessages = vi.fn()
    const onCopy = vi.fn()

    render(
      <ChatBubble>
        <ChatBubbleMessage
          actions={
            <ChatBubbleMenu
              copyText="Standup moved to 10:15"
              onReply={onReply}
              onSelectMessages={onSelectMessages}
              onCopy={onCopy}
            />
          }
        >
          Standup moved to 10:15
        </ChatBubbleMessage>
      </ChatBubble>
    )

    const trigger = screen.getByRole("button", { name: "Message actions" })

    await user.click(trigger)
    await user.click(await screen.findByText("Copy"))
    expect(writeText).toHaveBeenCalledWith("Standup moved to 10:15")
    expect(onCopy).toHaveBeenCalled()

    await user.click(trigger)
    await user.click(await screen.findByText("Reply"))
    expect(onReply).toHaveBeenCalled()

    await user.click(trigger)
    await user.click(await screen.findByText("Select messages"))
    expect(onSelectMessages).toHaveBeenCalled()
  })

  it("opens the delete dialog and reports the chosen scope", async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()

    render(
      <ChatBubble variant="outgoing">
        <ChatBubbleMessage actions={<ChatBubbleMenu onDelete={onDelete} />}>
          Hi
        </ChatBubbleMessage>
      </ChatBubble>
    )

    await user.click(screen.getByRole("button", { name: "Message actions" }))
    await user.click(await screen.findByText("Delete"))

    expect(await screen.findByText("Delete message?")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Delete for everyone" }))
    expect(onDelete).toHaveBeenCalledWith("everyone")

    await waitFor(() =>
      expect(screen.queryByText("Delete message?")).not.toBeInTheDocument()
    )
  })
})

describe("ChatBubbleDeleteDialog", () => {
  it("hides 'delete for everyone' when the scope is not available", async () => {
    render(
      <ChatBubbleDeleteDialog open canDeleteForEveryone={false} />
    )

    expect(await screen.findByText("Delete message?")).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Delete for everyone" })
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Delete for me" })
    ).toBeInTheDocument()
  })

  it("pluralises the title for a bulk delete and reports the 'me' scope", async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()

    render(<ChatBubbleDeleteDialog open count={3} onDelete={onDelete} />)

    expect(await screen.findByText("Delete 3 messages?")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Delete for me" }))
    expect(onDelete).toHaveBeenCalledWith("me")
  })
})

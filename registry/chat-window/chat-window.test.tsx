import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  ChatWindowHeader,
  ChatWindowInput,
  ChatWindowMenu,
  ChatWindowRoot,
} from "@/registry/chat-window/chat-window"

describe("ChatWindowHeader", () => {
  it("renders the title with an optional pin", () => {
    const { rerender } = render(<ChatWindowHeader title="Design team" />)
    expect(screen.getByText("Design team")).toBeInTheDocument()
    expect(
      document.querySelector("[data-slot='chat-window-pin']")
    ).not.toBeInTheDocument()

    rerender(<ChatWindowHeader title="Design team" pinned />)
    expect(
      document.querySelector("[data-slot='chat-window-pin']")
    ).toBeInTheDocument()
  })
})

describe("ChatWindowInput", () => {
  it("sends the trimmed message on Enter and clears the field", async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()
    render(<ChatWindowInput onSend={onSend} />)

    const field = screen.getByPlaceholderText("Type a message…")
    await user.type(field, "  hello there  {Enter}")
    expect(onSend).toHaveBeenCalledWith("hello there")
    expect(field).toHaveValue("")
  })

  it("Shift+Enter inserts a newline instead of sending", async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()
    render(<ChatWindowInput onSend={onSend} />)

    const field = screen.getByPlaceholderText("Type a message…")
    await user.type(field, "line 1{Shift>}{Enter}{/Shift}line 2")
    expect(onSend).not.toHaveBeenCalled()
    expect(field).toHaveValue("line 1\nline 2")
  })

  it("disables the send button while the message is empty", async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()
    render(<ChatWindowInput onSend={onSend} />)

    const send = screen.getByRole("button", { name: "Send message" })
    expect(send).toBeDisabled()

    await user.type(screen.getByPlaceholderText("Type a message…"), "hi")
    expect(send).toBeEnabled()

    await user.click(send)
    expect(onSend).toHaveBeenCalledWith("hi")
  })

  it("does not send blank messages", async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()
    render(<ChatWindowInput onSend={onSend} />)

    await user.type(screen.getByPlaceholderText("Type a message…"), "   {Enter}")
    expect(onSend).not.toHaveBeenCalled()
  })
})

describe("ChatWindowMenu", () => {
  it("opens the options menu and fires the actions", async () => {
    const user = userEvent.setup()
    const onArchive = vi.fn()
    render(<ChatWindowMenu onArchive={onArchive} />)

    await user.click(screen.getByRole("button", { name: "More options" }))
    await user.click(await screen.findByText("Archive Chat"))
    expect(onArchive).toHaveBeenCalledTimes(1)
  })
})

describe("ChatWindowRoot", () => {
  it("assembles header, body and composer", () => {
    render(
      <ChatWindowRoot title="Ada" inputProps={{ placeholder: "Say hi…" }}>
        <p>First message</p>
      </ChatWindowRoot>
    )
    expect(screen.getByText("Ada")).toBeInTheDocument()
    expect(screen.getByText("First message")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Say hi…")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "More options" })
    ).toBeInTheDocument()
  })
})

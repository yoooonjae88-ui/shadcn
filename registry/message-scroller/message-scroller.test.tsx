import { render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/registry/message-scroller/message-scroller"

const messages = [
  { id: "m1", role: "user", text: "How do I centre a div?" },
  { id: "m2", role: "assistant", text: "Use flex and place-items-center." },
  { id: "m3", role: "user", text: "And vertically?" },
]

function Transcript({
  items = messages,
  ...props
}: {
  items?: typeof messages
} & React.ComponentProps<typeof MessageScrollerProvider>) {
  return (
    <div style={{ height: 240 }}>
      <MessageScrollerProvider {...props}>
        <MessageScroller>
          <MessageScrollerViewport>
            <MessageScrollerContent>
              {items.map((message) => (
                <MessageScrollerItem
                  key={message.id}
                  messageId={message.id}
                  scrollAnchor={message.role === "user"}
                >
                  <p>{message.text}</p>
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  )
}

const slot = (name: string) =>
  document.querySelector(`[data-slot='message-scroller-${name}']`) as HTMLElement

describe("MessageScroller", () => {
  it("renders the frame, viewport, content and one item per message", () => {
    render(<Transcript />)
    expect(
      document.querySelector("[data-slot='message-scroller']")
    ).toBeInTheDocument()
    expect(slot("viewport")).toBeInTheDocument()
    expect(slot("content")).toBeInTheDocument()
    expect(
      document.querySelectorAll("[data-slot='message-scroller-item']")
    ).toHaveLength(messages.length)
    expect(screen.getByText("How do I centre a div?")).toBeInTheDocument()
  })

  it("marks the anchor rows the scroller settles a new turn on", () => {
    render(<Transcript />)
    const items = [
      ...document.querySelectorAll("[data-slot='message-scroller-item']"),
    ]
    // Every row reports its state; the two user turns are the anchors.
    expect(items.map((i) => i.getAttribute("data-scroll-anchor"))).toEqual([
      "true",
      "false",
      "true",
    ])
    expect(items.map((i) => i.getAttribute("data-message-id"))).toEqual([
      "m1",
      "m2",
      "m3",
    ])
  })

  it("makes the transcript a live region so new messages are announced", () => {
    render(<Transcript />)
    expect(slot("content")).toHaveAttribute("role", "log")
    expect(slot("content")).toHaveAttribute("aria-relevant", "additions")
    // The scrollable region is reachable and named for screen readers.
    expect(slot("viewport")).toHaveAttribute("tabindex", "0")
    expect(slot("viewport")).toHaveAttribute("aria-label")
  })

  it("keeps the viewport scrollable and the content able to exceed it", () => {
    render(<Transcript />)
    expect(slot("viewport")).toHaveClass("overflow-y-auto", "overscroll-contain")
    // h-max/min-h-full lets short transcripts fill and long ones overflow.
    expect(slot("content")).toHaveClass("h-max", "min-h-full")
  })

  it("renders a labelled scroll-to-end button that starts inactive", () => {
    render(<Transcript />)
    const button = screen.getByRole("button", { name: "Scroll to end" })
    expect(button).toHaveAttribute("data-direction", "end")
    // Nothing below the fold in jsdom, so the control is inert.
    expect(button).toHaveAttribute("data-active", "false")
  })

  it("labels and flips the start-direction button", () => {
    render(
      <div style={{ height: 240 }}>
        <MessageScrollerProvider>
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent>
                <MessageScrollerItem messageId="m1">
                  <p>Only message</p>
                </MessageScrollerItem>
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton direction="start" />
          </MessageScroller>
        </MessageScrollerProvider>
      </div>
    )
    const button = screen.getByRole("button", { name: "Scroll to start" })
    expect(button).toHaveAttribute("data-direction", "start")
    expect(button.className).toMatch(/data-\[direction=start\]:\[&_svg\]:rotate-180/)
  })

  it("takes a custom control through render and children", () => {
    render(
      <div style={{ height: 240 }}>
        <MessageScrollerProvider>
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent>
                <MessageScrollerItem messageId="m1">
                  <p>Only message</p>
                </MessageScrollerItem>
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton>Jump to latest</MessageScrollerButton>
          </MessageScroller>
        </MessageScrollerProvider>
      </div>
    )
    expect(
      screen.getByRole("button", { name: "Jump to latest" })
    ).toBeInTheDocument()
  })

  it("grows the transcript when a message is appended", async () => {
    const { rerender } = render(<Transcript />)
    expect(
      document.querySelectorAll("[data-slot='message-scroller-item']")
    ).toHaveLength(3)

    rerender(
      <Transcript
        items={[...messages, { id: "m4", role: "assistant", text: "Same idea." }]}
      />
    )
    await waitFor(() =>
      expect(
        document.querySelectorAll("[data-slot='message-scroller-item']")
      ).toHaveLength(4)
    )
    expect(screen.getByText("Same idea.")).toBeInTheDocument()
  })

  it("merges a caller's className on every part", () => {
    render(
      <div style={{ height: 240 }}>
        <MessageScrollerProvider>
          <MessageScroller className="rounded-xl">
            <MessageScrollerViewport className="px-4">
              <MessageScrollerContent className="gap-2">
                <MessageScrollerItem messageId="m1" className="py-1">
                  <p>Only message</p>
                </MessageScrollerItem>
              </MessageScrollerContent>
            </MessageScrollerViewport>
          </MessageScroller>
        </MessageScrollerProvider>
      </div>
    )
    expect(document.querySelector("[data-slot='message-scroller']")).toHaveClass(
      "rounded-xl",
      "relative"
    )
    expect(slot("viewport")).toHaveClass("px-4", "overflow-y-auto")
    expect(slot("content")).toHaveClass("gap-2", "flex")
    expect(slot("item")).toHaveClass("py-1", "shrink-0")
  })
})

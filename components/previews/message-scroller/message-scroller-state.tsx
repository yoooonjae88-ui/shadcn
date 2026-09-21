"use client"

import * as React from "react"

import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from "@/registry/message-scroller/message-scroller"
import { Button } from "@/registry/button/button"

const transcript = Array.from({ length: 12 }, (_, index) => ({
  id: `m${index + 1}`,
  role: index % 2 === 0 ? "user" : "assistant",
  text:
    index % 2 === 0
      ? `Question ${index / 2 + 1}`
      : "A reply long enough to take up a row of its own in the transcript.",
}))

// The hooks read the scroller's state from inside the provider: what can still
// be scrolled, which rows are on screen, and imperative scroll commands.
function ScrollReadout() {
  const scrollable = useMessageScrollerScrollable()
  const { currentAnchorId, visibleMessageIds } = useMessageScrollerVisibility()
  const { scrollToStart, scrollToEnd } = useMessageScroller()

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted-foreground">
        more above: <span className="tabular-nums">{String(scrollable.start)}</span>
        {" · "}
        more below: <span className="tabular-nums">{String(scrollable.end)}</span>
        {" · "}
        anchor: {currentAnchorId ?? "none"}
        {" · "}
        on screen: {visibleMessageIds.length}
      </p>
      <div className="flex gap-2">
        {/* Named differently from the scroller's own controls, which carry
            "Scroll to start"/"Scroll to end" as their screen-reader labels. */}
        <Button size="sm" variant="outline" onClick={() => scrollToStart()}>
          Jump to first message
        </Button>
        <Button size="sm" variant="outline" onClick={() => scrollToEnd()}>
          Jump to latest
        </Button>
      </div>
    </div>
  )
}

export function MessageScrollerStateExample() {
  return (
    <MessageScrollerProvider>
      <div className="flex w-full max-w-md flex-col gap-3">
        <div className="h-64">
          <MessageScroller className="rounded-xl border">
            <MessageScrollerViewport className="p-4">
              <MessageScrollerContent>
                {transcript.map((message) => (
                  <MessageScrollerItem
                    key={message.id}
                    messageId={message.id}
                    scrollAnchor={message.role === "user"}
                  >
                    <div
                      className={
                        message.role === "user"
                          ? "ml-auto w-fit max-w-[85%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground"
                          : "w-fit max-w-[85%] rounded-lg bg-muted px-3 py-2 text-sm"
                      }
                    >
                      {message.text}
                    </div>
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </div>
        <ScrollReadout />
      </div>
    </MessageScrollerProvider>
  )
}

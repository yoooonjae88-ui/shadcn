"use client"

import * as React from "react"

import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/registry/message-scroller/message-scroller"

const transcript = [
  { id: "m1", role: "user", text: "How should we structure the settings page?" },
  {
    id: "m2",
    role: "assistant",
    text: "Group related controls into sections and give each one a heading. Put destructive actions last, behind a confirmation.",
  },
  { id: "m3", role: "user", text: "What about the mobile layout?" },
  {
    id: "m4",
    role: "assistant",
    text: "Collapse the sections into an accordion and keep the save action pinned to the bottom so it stays reachable with one thumb.",
  },
  { id: "m5", role: "user", text: "Any pitfalls?" },
  {
    id: "m6",
    role: "assistant",
    text: "Avoid auto-saving fields that are expensive to undo, and never move a control between sections once people have learned where it lives.",
  },
]

// MessageScroller fills its parent, so the parent sets the height. The button
// slides in only once there is something below the fold.
export function MessageScrollerDemoExample() {
  return (
    <div className="h-80 w-full max-w-md">
      <MessageScrollerProvider>
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
      </MessageScrollerProvider>
    </div>
  )
}

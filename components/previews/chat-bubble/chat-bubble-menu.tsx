"use client"

import * as React from "react"

import {
  ChatBubble,
  ChatBubbleMenu,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
  type ChatBubbleDeleteScope,
} from "@/registry/chat-bubble/chat-bubble"

const thread = [
  {
    id: "m1",
    variant: "incoming" as const,
    text: "Standup moved to 10:15 — does that still work for you?",
    time: "9:41 AM",
  },
  {
    id: "m2",
    variant: "outgoing" as const,
    text: "Works for me, I'll bring the release notes.",
    time: "9:42 AM",
  },
]

// Hover a bubble to reveal the chevron in its top-right corner. Every item is
// opt-in: pass only the handlers the message supports. "Delete for everyone"
// is hidden on incoming messages, since you can only unsend your own.
export function ChatBubbleMenuExample() {
  const [log, setLog] = React.useState("Open a bubble's menu to try an action.")

  const describeDelete = (scope: ChatBubbleDeleteScope) =>
    scope === "everyone"
      ? "Deleted for everyone"
      : "Deleted for me (this device only)"

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex flex-col gap-1 rounded-lg bg-background p-4 shadow-sm">
        {thread.map((message) => (
          <ChatBubble key={message.id} variant={message.variant}>
            <ChatBubbleMessage
              actions={
                <ChatBubbleMenu
                  copyText={message.text}
                  canDeleteForEveryone={message.variant === "outgoing"}
                  onReply={() => setLog("Replying to this message")}
                  onForward={() => setLog("Forwarding this message")}
                  onSelectMessages={() => setLog("Entered selection mode")}
                  onCopy={() => setLog("Copied to clipboard")}
                  onDelete={(scope) => setLog(describeDelete(scope))}
                />
              }
            >
              {message.text}
              <ChatBubbleTimestamp
                status={message.variant === "outgoing" ? "read" : undefined}
              >
                {message.time}
              </ChatBubbleTimestamp>
            </ChatBubbleMessage>
          </ChatBubble>
        ))}
      </div>

      <p
        aria-live="polite"
        className="text-center text-sm text-muted-foreground"
      >
        {log}
      </p>
    </div>
  )
}

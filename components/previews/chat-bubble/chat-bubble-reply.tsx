"use client"

import * as React from "react"
import { SendHorizontal, X } from "lucide-react"

import { Button } from "@/registry/button/button"
import {
  ChatBubble,
  ChatBubbleMenu,
  ChatBubbleMessage,
  ChatBubbleQuote,
  ChatBubbleTimestamp,
} from "@/registry/chat-bubble/chat-bubble"

type Message = {
  id: string
  variant: "incoming" | "outgoing"
  sender: string
  text: string
  time: string
  quote?: { sender: string; text: string }
}

const initialThread: Message[] = [
  {
    id: "m1",
    variant: "incoming",
    sender: "Priya",
    text: "The offline colour palettes are committed — neutral, zinc, slate, stone and gray.",
    time: "9:41 AM",
  },
  {
    id: "m2",
    variant: "outgoing",
    sender: "You",
    text: "Perfect, that unblocks the air-gapped installs.",
    time: "9:42 AM",
    quote: {
      sender: "Priya",
      text: "The offline colour palettes are committed — neutral, zinc, slate, stone and gray.",
    },
  },
]

// "Reply" puts the message in the composer as a quote; sending stacks it above
// the new bubble with `ChatBubbleQuote`, tinted for the bubble it sits in.
export function ChatBubbleReplyExample() {
  const [thread, setThread] = React.useState(initialThread)
  const [replyTo, setReplyTo] = React.useState<Message | null>(null)
  const [draft, setDraft] = React.useState("")

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setThread((current) => [
      ...current,
      {
        id: `m${current.length + 1}`,
        variant: "outgoing",
        sender: "You",
        text,
        time: "9:44 AM",
        quote: replyTo
          ? { sender: replyTo.sender, text: replyTo.text }
          : undefined,
      },
    ])
    setDraft("")
    setReplyTo(null)
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-2 rounded-lg bg-background p-4 shadow-sm">
      <div className="flex flex-col gap-1">
        {thread.map((message) => (
          <ChatBubble key={message.id} variant={message.variant}>
            <ChatBubbleMessage
              actions={
                <ChatBubbleMenu
                  copyText={message.text}
                  onReply={() => setReplyTo(message)}
                />
              }
            >
              {message.quote && (
                <ChatBubbleQuote sender={message.quote.sender}>
                  {message.quote.text}
                </ChatBubbleQuote>
              )}
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

      {replyTo && (
        <div className="flex items-center gap-2 rounded-md bg-muted p-2">
          <span aria-hidden="true" className="w-1 self-stretch bg-primary" />
          <div className="min-w-0 flex-1">
            <div className="text-[12.8px] font-medium text-primary">
              {replyTo.sender}
            </div>
            <div className="truncate text-[13px] text-muted-foreground">
              {replyTo.text}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Cancel reply"
            onClick={() => setReplyTo(null)}
          >
            <X />
          </Button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return
            event.preventDefault()
            send()
          }}
          placeholder={replyTo ? "Reply…" : "Type a message…"}
          aria-label="Message"
          className="h-9 min-w-0 flex-1 rounded-full bg-muted px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <Button
          size="icon"
          shape="circle"
          aria-label="Send message"
          disabled={draft.trim().length === 0}
          onClick={send}
        >
          <SendHorizontal />
        </Button>
      </div>
    </div>
  )
}

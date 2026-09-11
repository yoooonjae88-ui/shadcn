"use client"

import * as React from "react"

import {
  ChatBubble,
  ChatBubbleMessage,
  ChatBubbleSender,
  ChatBubbleTimestamp,
} from "@/registry/chat-bubble/chat-bubble"
import { ChatWindowRoot } from "@/registry/chat-window/chat-window"

type Message = {
  id: number
  variant: "incoming" | "outgoing"
  sender?: string
  text: string
  time: string
  status?: "sent" | "delivered" | "read"
}

const initialMessages: Message[] = [
  {
    id: 1,
    variant: "incoming",
    sender: "Maya",
    text: "Pushed the new icons to the shared library — take a look when you get a sec.",
    time: "9:38 AM",
  },
  {
    id: 2,
    variant: "outgoing",
    text: "On it 👀 the chat window is nearly done too.",
    time: "9:40 AM",
    status: "read",
  },
  {
    id: 3,
    variant: "incoming",
    sender: "Sam",
    text: "Don't forget the offline install docs before Friday!",
    time: "9:41 AM",
  },
]

export function ChatWindowDemo() {
  const [messages, setMessages] = React.useState<Message[]>(initialMessages)

  const handleSend = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        variant: "outgoing",
        text,
        time: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
        status: "sent",
      },
    ])
  }

  return (
    <ChatWindowRoot
      title="Design Team"
      type="group"
      pinned
      className="h-[32rem] w-full max-w-md"
      searchProps={{ placeholder: "Search messages…" }}
      onInfo={() => console.log("Info Page")}
      onArchive={() => console.log("Archive Chat")}
      onClear={() => setMessages([])}
      inputProps={{ onSend: handleSend }}
    >
      {messages.map((m) => (
        <ChatBubble key={m.id} variant={m.variant}>
          <ChatBubbleMessage>
            {m.sender && m.variant === "incoming" && (
              <ChatBubbleSender>{m.sender}</ChatBubbleSender>
            )}
            {m.text}
            <ChatBubbleTimestamp status={m.status}>{m.time}</ChatBubbleTimestamp>
          </ChatBubbleMessage>
        </ChatBubble>
      ))}
    </ChatWindowRoot>
  )
}

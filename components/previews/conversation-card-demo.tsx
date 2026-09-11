"use client"

import * as React from "react"

import {
  ConversationCard,
  sortConversations,
} from "@/registry/conversation-card/conversation-card"

const conversations = [
  {
    id: "design-team",
    type: "group" as const,
    title: "Design Team",
    lastMessage: "Maya: pushed the new icons to the shared library, take a look",
    time: "9:41 AM",
    pinned: true,
    unreadCount: 3,
  },
  {
    id: "alex",
    type: "direct" as const,
    title: "Alex Rivera",
    lastMessage: "Sounds good, let's ship it 🚀",
    time: "9:38 AM",
    pinned: false,
    unreadCount: 0,
  },
  {
    id: "registry-launch",
    type: "group" as const,
    title: "Registry Launch",
    lastMessage: "Sam: don't forget the offline install docs before Friday",
    time: "Yesterday",
    pinned: false,
    unreadCount: 128,
  },
  {
    id: "priya",
    type: "direct" as const,
    title: "Priya Nair",
    lastMessage: "Thanks for the review!",
    time: "Mon",
    pinned: false,
    unreadCount: 0,
  },
]

export function ConversationCardDemo() {
  const [selected, setSelected] = React.useState("alex")

  return (
    // NOTE: this wrapper must stay overflow-visible. The unread badge is
    // centered on each card's top-right corner and bleeds slightly outside the
    // card edges, so an `overflow-hidden` wrapper here would clip it.
    <div className="flex w-full max-w-sm flex-col gap-1.5 rounded-xl border bg-background p-2">
      {sortConversations(conversations).map((c) => (
        <ConversationCard
          key={c.id}
          type={c.type}
          title={c.title}
          lastMessage={c.lastMessage}
          time={c.time}
          pinned={c.pinned}
          unreadCount={c.unreadCount}
          showZero={c.id === "priya"}
          selected={selected === c.id}
          onClick={() => setSelected(c.id)}
        />
      ))}
    </div>
  )
}

"use client"

import * as React from "react"

import { Button } from "@/registry/button/button"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/registry/message-scroller/message-scroller"

const reply =
  "Start from the smallest piece that renders on its own, give it a name, and only reach for state once two parts need to agree. "

// New turns anchor on the user's message and the view follows the live edge
// while the reply streams in — until the reader scrolls away, at which point
// the scroll-to-end button appears instead of yanking them back.
export function MessageScrollerStreamingExample() {
  const [messages, setMessages] = React.useState([
    { id: "m1", role: "user", text: "How do I break this component up?" },
    { id: "m2", role: "assistant", text: reply },
  ])
  const [streaming, setStreaming] = React.useState(false)

  React.useEffect(() => {
    if (!streaming) return
    const id = window.setInterval(() => {
      setMessages((current) => {
        const last = current[current.length - 1]
        return [
          ...current.slice(0, -1),
          { ...last, text: last.text + reply },
        ]
      })
    }, 600)
    return () => window.clearInterval(id)
  }, [streaming])

  function ask() {
    const n = messages.length
    setMessages((current) => [
      ...current,
      { id: `u${n}`, role: "user", text: "Tell me more." },
      { id: `a${n}`, role: "assistant", text: reply },
    ])
    setStreaming(true)
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="h-72">
        <MessageScrollerProvider>
          <MessageScroller className="rounded-xl border">
            <MessageScrollerViewport className="p-4">
              <MessageScrollerContent>
                {messages.map((message) => (
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
      <div className="flex gap-2">
        <Button size="sm" onClick={ask}>
          Send a message
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setStreaming((s) => !s)}
        >
          {streaming ? "Stop streaming" : "Stream a reply"}
        </Button>
      </div>
    </div>
  )
}

"use client"

import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/registry/message-scroller/message-scroller"

const transcript = Array.from({ length: 14 }, (_, index) => ({
  id: `m${index + 1}`,
  text: `Row ${index + 1} of the transcript.`,
}))

// Two controls, one per direction. Each is inert until there is something that
// way, and `defaultScrollPosition` decides where a reopened thread lands.
export function MessageScrollerDirectionsExample() {
  return (
    <div className="h-72 w-full max-w-md">
      <MessageScrollerProvider defaultScrollPosition="start">
        <MessageScroller className="rounded-xl border">
          <MessageScrollerViewport className="p-4">
            <MessageScrollerContent className="gap-3">
              {transcript.map((message) => (
                <MessageScrollerItem key={message.id} messageId={message.id}>
                  <div className="rounded-lg bg-muted px-3 py-2 text-sm">
                    {message.text}
                  </div>
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton direction="start" />
          <MessageScrollerButton direction="end" />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  )
}

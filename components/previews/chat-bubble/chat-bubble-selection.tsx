"use client"

import * as React from "react"
import { Forward, Trash2, X } from "lucide-react"

import { Button } from "@/registry/button/button"
import {
  ChatBubble,
  ChatBubbleDeleteDialog,
  ChatBubbleMenu,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
  type ChatBubbleDeleteScope,
} from "@/registry/chat-bubble/chat-bubble"

type Message = {
  id: string
  variant: "incoming" | "outgoing"
  text: string
  time: string
}

const initialThread: Message[] = [
  {
    id: "m1",
    variant: "incoming",
    text: "Here's the staging URL for the registry.",
    time: "9:41 AM",
  },
  {
    id: "m2",
    variant: "incoming",
    text: "https://registry.internal/r",
    time: "9:41 AM",
  },
  {
    id: "m3",
    variant: "outgoing",
    text: "Got it — forwarding both to the platform channel.",
    time: "9:43 AM",
  },
]

// "Select messages" flips every row into `selectable`, so the whole row
// toggles a tick. The action bar then forwards or deletes the selection in
// one go — `ChatBubbleDeleteDialog` takes a `count` for the bulk copy.
export function ChatBubbleSelectionExample() {
  const [thread, setThread] = React.useState(initialThread)
  const [selecting, setSelecting] = React.useState(false)
  const [selected, setSelected] = React.useState<string[]>([])
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [log, setLog] = React.useState<string | null>(null)

  const exitSelection = () => {
    setSelecting(false)
    setSelected([])
  }

  const toggle = (id: string, isSelected: boolean) =>
    setSelected((current) =>
      isSelected ? [...current, id] : current.filter((item) => item !== id)
    )

  const forward = () => {
    setLog(
      `Forwarded ${selected.length} message${selected.length === 1 ? "" : "s"}`
    )
    exitSelection()
  }

  const remove = (scope: ChatBubbleDeleteScope) => {
    setThread((current) =>
      current.filter((message) => !selected.includes(message.id))
    )
    setLog(
      `Deleted ${selected.length} message${
        selected.length === 1 ? "" : "s"
      } for ${scope === "everyone" ? "everyone" : "me"}`
    )
    exitSelection()
  }

  // "Delete for everyone" only makes sense when the whole selection is yours.
  const allOutgoing = thread
    .filter((message) => selected.includes(message.id))
    .every((message) => message.variant === "outgoing")

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex flex-col gap-1 rounded-lg bg-background p-4 shadow-sm">
        {selecting && (
          <div className="mb-2 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Cancel selection"
              onClick={exitSelection}
            >
              <X />
            </Button>
            <span className="flex-1 text-sm font-medium">
              {selected.length} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={selected.length === 0}
              onClick={forward}
            >
              <Forward />
              Forward
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Delete selected"
              disabled={selected.length === 0}
              onClick={() => setDeleteOpen(true)}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 />
            </Button>
          </div>
        )}

        {thread.map((message) => (
          <ChatBubble
            key={message.id}
            variant={message.variant}
            selectable={selecting}
            selected={selected.includes(message.id)}
            onSelectedChange={(isSelected) => toggle(message.id, isSelected)}
          >
            <ChatBubbleMessage
              actions={
                selecting ? undefined : (
                  <ChatBubbleMenu
                    copyText={message.text}
                    onSelectMessages={() => {
                      setSelecting(true)
                      setSelected([message.id])
                      setLog(null)
                    }}
                  />
                )
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

      <ChatBubbleDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        count={selected.length}
        canDeleteForEveryone={allOutgoing}
        onDelete={remove}
      />

      {log && (
        <p
          aria-live="polite"
          className="text-center text-sm text-muted-foreground"
        >
          {log}
        </p>
      )}
    </div>
  )
}

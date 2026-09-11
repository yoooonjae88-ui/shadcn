"use client"

import * as React from "react"

import { Button } from "@/registry/button/button"
import {
  ChatBubbleDeleteDialog,
  type ChatBubbleDeleteScope,
} from "@/registry/chat-bubble/chat-bubble"

// The dialog `ChatBubbleMenu` opens for "Delete". It asks *how* to delete
// rather than just confirming: unsend for everyone, or clear from this device.
// Drop "Delete for everyone" for messages you didn't send, or once the unsend
// window has closed.
export function ChatBubbleDeleteExample() {
  const [openScope, setOpenScope] = React.useState<
    "own" | "other" | "bulk" | null
  >(null)
  const [log, setLog] = React.useState<string | null>(null)

  const handleDelete = (scope: ChatBubbleDeleteScope) =>
    setLog(
      scope === "everyone"
        ? "Deleted for everyone — the message is unsent for all participants."
        : "Deleted for me — cleared from this device only."
    )

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => setOpenScope("own")}>
          Your message
        </Button>
        <Button variant="outline" onClick={() => setOpenScope("other")}>
          Someone else&apos;s
        </Button>
        <Button variant="outline" onClick={() => setOpenScope("bulk")}>
          3 selected
        </Button>
      </div>

      <ChatBubbleDeleteDialog
        open={openScope === "own"}
        onOpenChange={(open) => setOpenScope(open ? "own" : null)}
        onDelete={handleDelete}
      />

      <ChatBubbleDeleteDialog
        open={openScope === "other"}
        onOpenChange={(open) => setOpenScope(open ? "other" : null)}
        canDeleteForEveryone={false}
        onDelete={handleDelete}
      />

      <ChatBubbleDeleteDialog
        open={openScope === "bulk"}
        onOpenChange={(open) => setOpenScope(open ? "bulk" : null)}
        count={3}
        onDelete={handleDelete}
      />

      {log && (
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {log}
        </p>
      )}
    </div>
  )
}

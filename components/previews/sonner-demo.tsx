"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { Check, FileText, MessageSquarePlus, Plug, XIcon } from "lucide-react"

import { Button } from "@/registry/button/button"
import { InputTextArea } from "@/registry/input/input"
import { Segmented } from "@/registry/segmented/segmented"
import { Toaster, toast } from "@/registry/sonner/sonner"

type ToasterPosition = React.ComponentProps<typeof Toaster>["position"]

const positions: ToasterPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
]

// Fires a fake async request so `toast.promise` has something to resolve.
function saveWithDelay(shouldFail = false) {
  return new Promise<{ name: string }>((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(new Error("Request failed"))
      else resolve({ name: "Project Nova" })
    }, 1800)
  })
}

// A single toast, updated in place by its `id`, that walks an upload from 0% to
// 100% and then flips to a success state — a common "updatable toast" pattern.
// The id is captured from the first `toast.custom` call (fresh per upload) so a
// new run always starts from a clean 0% rather than inheriting the last state.
function simulateUpload() {
  let progress = 0

  // Reads the current `progress` on each re-render Sonner triggers.
  const bar = () => (
    <div className="flex w-full flex-col gap-2 rounded-lg bg-popover px-4 py-3 text-popover-foreground shadow-lg">
      <div className="flex items-center gap-2">
        <FileText className="size-4 shrink-0 text-muted-foreground" />
        <span className="flex-1 text-sm font-medium">report-q3.pdf</span>
        <span className="text-xs tabular-nums text-muted-foreground">
          {progress}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )

  // The completed state — a success confirmation rendered *inside* the same
  // white card (green shown only as an accent) rather than as a separate
  // rich-color toast, so it stays one cohesive dialog.
  const done = () => (
    <div className="flex w-full flex-col gap-1.5 rounded-lg bg-popover px-4 py-3 text-popover-foreground shadow-lg">
      <div className="flex items-center gap-2">
        <span className="flex size-5 items-center justify-center rounded-full bg-sonner-success text-sonner-success-foreground">
          <Check className="size-3.5" />
        </span>
        <span className="flex-1 text-sm font-medium">report-q3.pdf</span>
        <span className="text-xs font-medium text-sonner-success-foreground">
          Done
        </span>
      </div>
      <span className="pl-7 text-xs text-muted-foreground">
        report-q3.pdf is ready to share.
      </span>
    </div>
  )

  const id = toast.custom(bar, { duration: Infinity })

  const timer = setInterval(() => {
    progress = Math.min(progress + 20, 100)
    // Re-render including the final 100% frame before switching to success.
    toast.custom(bar, { id, duration: Infinity })

    if (progress >= 100) {
      clearInterval(timer)
      // Let the full bar paint, then swap the same toast to its done state,
      // which auto-closes after 4s (duration for auto close).
      setTimeout(() => {
        toast.custom(done, { id, duration: 4000 })
      }, 600)
    }
  }, 500)
}

// A branded, multi-action "integration connected" notification built with
// toast.custom — icon, title, description and its own action buttons.
function integrationToast() {
  toast.custom((t) => (
    <div className="flex w-full items-start gap-3 rounded-lg bg-popover p-4 text-popover-foreground shadow-lg">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Plug className="size-5" />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold">Integration connected</span>
          <span className="text-xs text-muted-foreground">
            Acme CRM can now sync your contacts and deals.
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            size="xs"
            onClick={() => {
              toast.dismiss(t)
              toast.success("Sync configured")
            }}
          >
            Configure
          </Button>
          <Button size="xs" variant="ghost" onClick={() => toast.dismiss(t)}>
            Not now
          </Button>
        </div>
      </div>
      <Button
        size="icon-xs"
        variant="ghost"
        aria-label="Dismiss"
        className="-mt-1 -mr-1"
        onClick={() => toast.dismiss(t)}
      >
        <XIcon />
      </Button>
    </div>
  ))
}

export function SonnerDemo() {
  const [feedbackOpen, setFeedbackOpen] = React.useState(false)
  const [feedback, setFeedback] = React.useState("")
  const [position, setPosition] =
    React.useState<ToasterPosition>("bottom-right")

  function submitFeedback(event: React.FormEvent) {
    event.preventDefault()
    setFeedbackOpen(false)
    const message = feedback.trim()
    setFeedback("")
    toast.success("Feedback received", {
      description: message
        ? `"${message.length > 60 ? message.slice(0, 60) + "…" : message}"`
        : "Thanks for helping us improve.",
      action: {
        label: "Undo",
        onClick: () => toast("Feedback withdrawn"),
      },
    })
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Position picker — controls where the Toaster renders */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          Toast position
        </span>
        <Segmented
          size="small"
          value={position}
          options={positions.map((value) => ({
            value: value as string,
            label: value,
          }))}
          onChange={(value) => {
            setPosition(value as ToasterPosition)
            toast(`Position: ${value}`)
          }}
        />
      </div>

      {/* Basic + status toasts */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => toast("Event has been created")}
        >
          Default
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast("Event has been created", {
              description: "Monday, January 6 at 4:30 PM",
            })
          }
        >
          Description
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.success("Changes saved successfully")}
        >
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.info("A new software update is available")}
        >
          Info
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.warning("Your session expires in 5 minutes")}
        >
          Warning
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.error("Something went wrong. Try again.")}
        >
          Error
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const id = toast.loading("Uploading files…")
            setTimeout(
              () => toast.success("Upload complete", { id }),
              1800
            )
          }}
        >
          Loading
        </Button>
      </div>

      {/* Interactive: action, cancel, promise, custom */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onClick={() =>
            toast("File moved to Trash", {
              action: {
                label: "Undo",
                onClick: () => toast.success("Restored"),
              },
            })
          }
        >
          Action
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast("Deploying to production", {
              cancel: {
                label: "Cancel",
                onClick: () => toast("Deployment cancelled"),
              },
            })
          }
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.promise(saveWithDelay(), {
              loading: "Saving project…",
              success: (data) => `${data.name} saved`,
              error: "Could not save project",
            })
          }
        >
          Promise
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.custom((t) => (
              <div className="flex items-center gap-3 rounded-lg bg-popover px-4 py-3 text-popover-foreground shadow-lg">
                <MessageSquarePlus className="size-5 text-primary" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">New message</span>
                  <span className="text-xs text-muted-foreground">
                    Maya sent you a document
                  </span>
                </div>
                <Button
                  size="xs"
                  variant="ghost"
                  className="ml-2"
                  onClick={() => toast.dismiss(t)}
                >
                  Dismiss
                </Button>
              </div>
            ))
          }
        >
          Custom
        </Button>
      </div>

      {/* Close button, updatable progress toast, custom integration toast */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="teal"
          onClick={() =>
            toast("Message archived", {
              description: "Undo within 5 seconds or it's gone.",
              closeButton: true,
            })
          }
        >
          Close button
        </Button>
        <Button variant="teal" onClick={simulateUpload}>
          Upload progress
        </Button>
        <Button variant="teal" onClick={integrationToast}>
          Custom integration
        </Button>
        <Button
          variant="teal"
          onClick={() =>
            toast("Auto-closes in 2 seconds", {
              description: "Pass `duration` (ms) to control auto close.",
              duration: 2000,
            })
          }
        >
          Duration 2s
        </Button>
        <Button
          variant="teal"
          onClick={() =>
            toast("Stays until dismissed", {
              description: "duration: Infinity disables auto close.",
              duration: Infinity,
              closeButton: true,
            })
          }
        >
          Persistent
        </Button>
      </div>

      {/* Dialog feedback flow: submit a form, confirm with a toast */}
      <DialogPrimitive.Root open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogPrimitive.Trigger
          render={<Button className="w-fit" />}
        >
          <MessageSquarePlus />
          Leave feedback
        </DialogPrimitive.Trigger>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
          <DialogPrimitive.Popup className="fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-xl bg-popover p-5 text-popover-foreground shadow-lg outline-none transition-all duration-200 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <DialogPrimitive.Title className="text-base font-semibold">
                  Send feedback
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="text-sm text-muted-foreground">
                  Tell us what you think. We read every message.
                </DialogPrimitive.Description>
              </div>
              <DialogPrimitive.Close
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Close feedback dialog"
                  />
                }
              >
                <XIcon />
              </DialogPrimitive.Close>
            </div>
            <form className="flex flex-col gap-4" onSubmit={submitFeedback}>
              <InputTextArea
                autoFocus
                rows={4}
                placeholder="Your feedback…"
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
              />
              <div className="flex justify-end gap-2">
                <DialogPrimitive.Close render={<Button variant="ghost" />}>
                  Cancel
                </DialogPrimitive.Close>
                <Button type="submit">Send feedback</Button>
              </div>
            </form>
          </DialogPrimitive.Popup>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <Toaster position={position} />
    </div>
  )
}

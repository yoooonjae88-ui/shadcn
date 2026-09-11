"use client"

import * as React from "react"
import { LoaderCircle, LogOut } from "lucide-react"

import { Button } from "@/registry/button/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/alert-dialog/alert-dialog"

// Controlled open state with a spinner; the dialog only closes once the work
// resolves.
export function AlertDialogAsyncExample() {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  async function handleConfirm() {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setLoading(false)
    setOpen(false)
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        // Don't let the dialog close mid-flight.
        if (loading) return
        setOpen(next)
      }}
    >
      <AlertDialogTrigger render={<Button variant="outline" />}>
        <LogOut />
        Sign out everywhere
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign out of all devices?</AlertDialogTitle>
          <AlertDialogDescription>
            This ends every active session. It may take a moment to complete.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* Plain buttons here so we control closing around the async work. */}
          <Button variant="outline" disabled={loading} onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button disabled={loading} onClick={handleConfirm}>
            {loading && <LoaderCircle className="animate-spin" />}
            {loading ? "Signing out…" : "Sign out"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

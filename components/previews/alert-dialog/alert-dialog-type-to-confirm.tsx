"use client"

import * as React from "react"
import { Trash2 } from "lucide-react"

import { Button } from "@/registry/button/button"
import { Input } from "@/registry/input/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/alert-dialog/alert-dialog"

// The user must type the exact phrase to enable the delete button.
export function AlertDialogTypeToConfirmExample() {
  const CONFIRM_TEXT = "DELETE"
  const [open, setOpen] = React.useState(false)
  const [text, setText] = React.useState("")

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setText("")
      }}
    >
      <AlertDialogTrigger render={<Button variant="destructive" />}>
        <Trash2 />
        Delete workspace
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete workspace?</AlertDialogTitle>
          <AlertDialogDescription>
            To confirm, type{" "}
            <span className="font-semibold text-foreground">{CONFIRM_TEXT}</span>{" "}
            in the box below. This can’t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={`Type ${CONFIRM_TEXT} to confirm`}
          autoComplete="off"
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={text !== CONFIRM_TEXT}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

"use client"

import * as React from "react"
import { TriangleAlert } from "lucide-react"

import { Button } from "@/registry/button/button"
import { Checkbox } from "@/registry/checkbox/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogIcon,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/alert-dialog/alert-dialog"

// The confirm button stays disabled until the user acknowledges the action.
export function AlertDialogCheckboxGatedExample() {
  const [open, setOpen] = React.useState(false)
  const [confirmed, setConfirmed] = React.useState(false)

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setConfirmed(false)
      }}
    >
      <AlertDialogTrigger render={<Button variant="destructive" />}>
        Deactivate account
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogIcon variant="destructive">
            <TriangleAlert />
          </AlertDialogIcon>
          <AlertDialogTitle>Deactivate your account</AlertDialogTitle>
          <AlertDialogDescription>
            Your profile and data will be scheduled for deletion. This can’t be
            reversed once it starts.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <Checkbox
            checked={confirmed}
            onCheckedChange={(value) => setConfirmed(value === true)}
          />
          I understand the consequences of this action.
        </label>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={!confirmed}>
            Deactivate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

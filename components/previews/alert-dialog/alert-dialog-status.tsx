"use client"

import { CircleCheck, Info, TriangleAlert, X } from "lucide-react"

import { Button } from "@/registry/button/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogIcon,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/alert-dialog/alert-dialog"

const statuses = [
  { variant: "success", icon: <CircleCheck />, label: "Success" },
  { variant: "warning", icon: <TriangleAlert />, label: "Warning" },
  { variant: "info", icon: <Info />, label: "Info" },
] as const

// Status icon variants, plus a custom ✕ close in the corner.
export function AlertDialogStatusExample() {
  return (
    <div className="flex flex-wrap items-start gap-2">
      {statuses.map(({ variant, icon, label }) => (
        <AlertDialog key={variant}>
          <AlertDialogTrigger render={<Button variant="outline" />}>{label}</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogClose
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Close"
                  className="absolute top-3 right-3"
                />
              }
            >
              <X />
            </AlertDialogClose>
            <AlertDialogHeader>
              <AlertDialogIcon variant={variant}>{icon}</AlertDialogIcon>
              <AlertDialogTitle>{label}</AlertDialogTitle>
              <AlertDialogDescription>
                This dialog uses the “{variant}” status colour. Close it with a
                button or the ✕ in the corner.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Got it</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </div>
  )
}

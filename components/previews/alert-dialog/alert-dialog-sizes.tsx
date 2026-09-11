"use client"

import { Button } from "@/registry/button/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/alert-dialog/alert-dialog"

// The content max-width scales with the size prop.
export function AlertDialogSizesExample() {
  return (
    <div className="flex flex-wrap items-start gap-2">
      {(["sm", "default", "lg", "xl"] as const).map((size) => (
        <AlertDialog key={size}>
          <AlertDialogTrigger render={<Button variant="outline" className="capitalize" />}>
            {size}
          </AlertDialogTrigger>
          <AlertDialogContent size={size}>
            <AlertDialogHeader>
              <AlertDialogTitle className="capitalize">{size} dialog</AlertDialogTitle>
              <AlertDialogDescription>
                The content max-width scales with the size prop (sm / default / lg / xl).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </div>
  )
}

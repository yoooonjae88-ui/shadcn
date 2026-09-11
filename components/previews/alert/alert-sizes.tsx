"use client"

import { Info } from "lucide-react"

import { Alert, AlertIcon, AlertTitle } from "@/registry/alert/alert"

export function AlertSizesExample() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-2.5">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Alert key={size} variant="info" appearance="light" size={size}>
          <AlertIcon>
            <Info />
          </AlertIcon>
          <AlertTitle>Size {size}</AlertTitle>
        </Alert>
      ))}
    </div>
  )
}

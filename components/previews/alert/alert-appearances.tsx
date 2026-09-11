"use client"

import { CircleCheck } from "lucide-react"

import { Alert, AlertIcon, AlertTitle } from "@/registry/alert/alert"

export function AlertAppearancesExample() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-2.5">
      {(["solid", "light", "outline", "stroke"] as const).map((appearance) => (
        <Alert key={appearance} variant="success" appearance={appearance}>
          <AlertIcon>
            <CircleCheck />
          </AlertIcon>
          <AlertTitle className="capitalize">{appearance}</AlertTitle>
        </Alert>
      ))}
    </div>
  )
}

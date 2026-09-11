"use client"

import { CircleAlert } from "lucide-react"

import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/registry/alert/alert"

export function AlertDismissibleExample() {
  return (
    <Alert variant="destructive" appearance="light" close className="w-full max-w-xl">
      <AlertIcon>
        <CircleAlert />
      </AlertIcon>
      <AlertContent>
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>
          We couldn&apos;t charge your card. Update your billing details to avoid
          interruption.
        </AlertDescription>
      </AlertContent>
    </Alert>
  )
}

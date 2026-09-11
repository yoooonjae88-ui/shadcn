"use client"

import { TriangleAlert } from "lucide-react"

import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/registry/alert/alert"

export function AlertDescriptionExample() {
  return (
    <Alert variant="warning" appearance="light" className="w-full max-w-xl">
      <AlertIcon>
        <TriangleAlert />
      </AlertIcon>
      <AlertContent>
        <AlertTitle>Your trial ends in 3 days</AlertTitle>
        <AlertDescription>
          Upgrade now to keep your projects, or they&apos;ll be archived until
          you renew. <a href="#">View plans</a>.
        </AlertDescription>
      </AlertContent>
    </Alert>
  )
}

"use client"

import { RocketIcon } from "lucide-react"

import { Button } from "@/registry/button/button"
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  AlertToolbar,
} from "@/registry/alert/alert"

export function AlertActionsExample() {
  return (
    <Alert variant="primary" appearance="outline" className="w-full max-w-xl">
      <AlertIcon>
        <RocketIcon />
      </AlertIcon>
      <AlertContent>
        <AlertTitle>A new version is available</AlertTitle>
        <AlertDescription>
          Version 2.4 includes performance improvements and bug fixes.
        </AlertDescription>
      </AlertContent>
      <AlertToolbar>
        <Button variant="ghost" size="sm">
          Later
        </Button>
        <Button size="sm">Update</Button>
      </AlertToolbar>
    </Alert>
  )
}

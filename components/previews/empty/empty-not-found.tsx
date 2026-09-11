"use client"

import { ArrowUpRight, RefreshCw } from "lucide-react"

import { Button } from "@/registry/button/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/empty/empty"

// A 404 layout using the description's inline-link styling.
export function EmptyNotFoundExample() {
  return (
    <Empty variant="background" className="w-full max-w-sm">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <RefreshCw aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>404 — Page not found</EmptyTitle>
        <EmptyDescription>
          The page you&apos;re looking for doesn&apos;t exist or has moved. Head
          back to the{" "}
          <a href="#" onClick={(e) => e.preventDefault()}>
            dashboard
          </a>{" "}
          to keep going.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline">
          Go home
          <ArrowUpRight aria-hidden="true" />
        </Button>
      </EmptyContent>
    </Empty>
  )
}

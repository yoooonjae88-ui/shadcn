"use client"

import { Inbox, Plus } from "lucide-react"

import { Button } from "@/registry/button/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/empty/empty"

// An icon tile, a title, a description and an action.
export function EmptyDefaultExample() {
  return (
    <Empty className="w-full max-w-sm">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>No messages yet</EmptyTitle>
        <EmptyDescription>
          When someone sends you a message it will show up here. Start a
          conversation to get things going.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>
          <Plus aria-hidden="true" />
          New message
        </Button>
      </EmptyContent>
    </Empty>
  )
}

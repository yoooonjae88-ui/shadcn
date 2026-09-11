"use client"

import * as React from "react"
import {
  CopyIcon,
  ExternalLinkIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"

import { Button } from "@/registry/button/button"
import {
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverLink,
  PopoverSeparator,
  PopoverTrigger,
} from "@/registry/popover/popover"

// An action menu built from the base primitives.
export function PopoverActionsExample() {
  const [action, setAction] = React.useState<string | null>(null)

  return (
    <div className="flex flex-col items-start gap-3">
      <Popover>
        <PopoverTrigger
          render={<Button variant="outline" size="icon" aria-label="Open actions" />}
        >
          <MoreHorizontalIcon />
        </PopoverTrigger>
        <PopoverContent align="start">
          <PopoverItem onClick={() => setAction("Edit")}>
            <PencilIcon />
            Edit
          </PopoverItem>
          <PopoverItem onClick={() => setAction("Duplicate")}>
            <CopyIcon />
            Duplicate
          </PopoverItem>
          <PopoverLink href="https://base-ui.com" target="_blank" rel="noreferrer">
            <ExternalLinkIcon />
            Open in new tab
          </PopoverLink>
          <PopoverSeparator />
          <PopoverItem
            onClick={() => setAction("Delete")}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:bg-destructive/10 focus-visible:text-destructive"
          >
            <Trash2Icon />
            Delete
          </PopoverItem>
        </PopoverContent>
      </Popover>
      {action ? (
        <p className="text-xs text-muted-foreground">
          Last action: <code>{action}</code>
        </p>
      ) : null}
    </div>
  )
}

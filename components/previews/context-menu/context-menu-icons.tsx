"use client"

import { ArrowLeft, ArrowRight, RotateCw, Share2 } from "lucide-react"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/registry/context-menu/context-menu"

// Icons are sized automatically and sit in the item's leading gap.
export function ContextMenuIconsExample() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm">
        <span className="hidden pointer-fine:inline-block">
          Right click here
        </span>
        <span className="hidden pointer-coarse:inline-block">
          Long press here
        </span>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-44">
        <ContextMenuGroup>
          <ContextMenuItem>
            <ArrowLeft />
            Back
          </ContextMenuItem>
          <ContextMenuItem>
            <ArrowRight />
            Forward
          </ContextMenuItem>
          <ContextMenuItem>
            <RotateCw />
            Reload
          </ContextMenuItem>
          <ContextMenuItem>
            <Share2 />
            Share
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  )
}

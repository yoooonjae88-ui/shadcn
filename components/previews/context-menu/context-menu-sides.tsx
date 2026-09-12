"use client"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/registry/context-menu/context-menu"

// `side` and `align` decide where the menu lands relative to the click.
const sides = ["right", "top", "bottom", "left"] as const

export function ContextMenuSidesExample() {
  return (
    <div className="grid w-full max-w-sm grid-cols-2 gap-4">
      {sides.map((side) => (
        <ContextMenu key={side}>
          <ContextMenuTrigger className="flex aspect-video w-full items-center justify-center rounded-xl border border-dashed text-sm capitalize">
            <span className="hidden pointer-fine:inline-block">
              Right click ({side})
            </span>
            <span className="hidden pointer-coarse:inline-block">
              Long press ({side})
            </span>
          </ContextMenuTrigger>
          <ContextMenuContent side={side}>
            <ContextMenuGroup>
              <ContextMenuItem>Back</ContextMenuItem>
              <ContextMenuItem>Forward</ContextMenuItem>
              <ContextMenuItem>Reload</ContextMenuItem>
            </ContextMenuGroup>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </div>
  )
}

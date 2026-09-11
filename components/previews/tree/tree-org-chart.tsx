"use client"

import { MoreHorizontal } from "lucide-react"

import { Tree, type TreeNode } from "@/registry/tree/tree"

const orgTree: TreeNode[] = [
  {
    id: "ceo",
    name: "Dana Reed",
    role: "CEO",
    children: [
      {
        id: "cto",
        name: "Miles Chen",
        role: "CTO",
        children: [
          { id: "eng1", name: "Ada Okoro", role: "Eng Lead" },
          { id: "eng2", name: "Ivan Petrov", role: "Engineer" },
        ],
      },
      {
        id: "cfo",
        name: "Sara Kim",
        role: "CFO",
        children: [{ id: "fin1", name: "Leo Marsh", role: "Analyst" }],
      },
    ],
  },
]

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
}

// Custom labels with avatars and roles, plus a hover action slot.
export function TreeOrgChartExample() {
  return (
    <div className="w-full max-w-sm rounded-lg border p-2">
      <Tree
        data={orgTree}
        defaultExpandedIds={["ceo", "cto"]}
        indentGuides
        renderLabel={(node) => (
          <span className="flex items-center gap-2">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
              {initials(node.name)}
            </span>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="truncate">{node.name}</span>
              <span className="truncate text-xs text-muted-foreground">{node.role}</span>
            </span>
          </span>
        )}
        renderActions={() => (
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="rounded-sm p-1 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover/row:opacity-100"
            aria-label="More"
          >
            <MoreHorizontal className="size-4" />
          </button>
        )}
      />
    </div>
  )
}

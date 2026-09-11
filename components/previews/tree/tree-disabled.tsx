"use client"

import { Folder } from "lucide-react"

import { Tree, type TreeNode } from "@/registry/tree/tree"

const disabledTree: TreeNode[] = [
  {
    id: "public",
    name: "Public",
    children: [
      { id: "home", name: "Home" },
      { id: "pricing", name: "Pricing" },
    ],
  },
  {
    id: "admin",
    name: "Admin (locked)",
    disabled: true,
    children: [{ id: "settings", name: "Settings" }],
  },
  { id: "billing", name: "Billing (locked)", disabled: true },
]

// Disabled nodes are skipped by clicks and keyboard navigation.
export function TreeDisabledExample() {
  return (
    <div className="w-full max-w-sm rounded-lg border p-2">
      <Tree
        data={disabledTree}
        defaultExpandedIds={["public"]}
        getItemIcon={(_, state) =>
          state.hasChildren ? <Folder className="size-4 text-primary" /> : null
        }
      />
    </div>
  )
}

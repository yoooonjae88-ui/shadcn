"use client"

import * as React from "react"
import { Shield } from "lucide-react"

import { Tree, type TreeNode } from "@/registry/tree/tree"

const permissionsTree: TreeNode[] = [
  {
    id: "content",
    name: "Content",
    children: [
      { id: "content.read", name: "View articles" },
      { id: "content.write", name: "Create & edit articles" },
      { id: "content.delete", name: "Delete articles" },
    ],
  },
  {
    id: "users",
    name: "User management",
    children: [
      { id: "users.read", name: "View users" },
      { id: "users.invite", name: "Invite users" },
      { id: "users.roles", name: "Manage roles" },
    ],
  },
]

// Checkbox selection with an indeterminate parent state.
export function TreePermissionsExample() {
  const [selected, setSelected] = React.useState<string[]>([
    "content.read",
    "content.write",
  ])
  return (
    <div className="w-full max-w-sm rounded-lg border p-2">
      <Tree
        data={permissionsTree}
        selectionMode="checkbox"
        defaultExpandedIds={["content", "users"]}
        selectedIds={selected}
        onSelectedChange={setSelected}
        getItemIcon={(_, state) =>
          state.hasChildren ? <Shield className="size-4 text-primary" /> : null
        }
      />
    </div>
  )
}

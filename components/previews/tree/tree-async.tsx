"use client"

import * as React from "react"
import { File, Folder, FolderOpen } from "lucide-react"

import { Tree, type TreeNode } from "@/registry/tree/tree"

const asyncRoot: TreeNode[] = [
  { id: "aws", name: "aws-region", isBranch: true },
  { id: "gcp", name: "gcp-region", isBranch: true },
]

// Children are fetched on first expand.
export function TreeAsyncExample() {
  const loadChildren = React.useCallback(
    (node: TreeNode) =>
      new Promise<TreeNode[]>((resolve) => {
        setTimeout(() => {
          resolve([
            { id: `${node.id}-a`, name: `${node.name}-a` },
            { id: `${node.id}-b`, name: `${node.name}-b` },
            { id: `${node.id}-c`, name: `${node.name}-c` },
          ])
        }, 900)
      }),
    []
  )
  return (
    <div className="w-full max-w-sm rounded-lg border p-2">
      <Tree
        data={asyncRoot}
        onLoadChildren={loadChildren}
        getItemIcon={(_, state) =>
          state.hasChildren ? (
            state.expanded ? (
              <FolderOpen className="size-4 text-primary" />
            ) : (
              <Folder className="size-4 text-primary" />
            )
          ) : (
            <File className="size-4" />
          )
        }
      />
    </div>
  )
}

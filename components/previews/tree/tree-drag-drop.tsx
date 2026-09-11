"use client"

import * as React from "react"
import {
  File,
  FileCode,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
  Image as ImageIcon,
} from "lucide-react"

import { Tree, moveTreeNode, type TreeNode } from "@/registry/tree/tree"

const fileTree: TreeNode[] = [
  {
    id: "src",
    name: "src",
    children: [
      {
        id: "components",
        name: "components",
        children: [
          { id: "button.tsx", name: "button.tsx", kind: "tsx" },
          { id: "tree.tsx", name: "tree.tsx", kind: "tsx" },
        ],
      },
      {
        id: "assets",
        name: "assets",
        children: [
          { id: "logo.svg", name: "logo.svg", kind: "img" },
          { id: "hero.png", name: "hero.png", kind: "img" },
        ],
      },
      { id: "index.ts", name: "index.ts", kind: "ts" },
    ],
  },
  { id: "package.json", name: "package.json", kind: "json" },
  { id: "readme.md", name: "README.md", kind: "md" },
]

function fileIcon(node: TreeNode, state: { expanded: boolean; hasChildren: boolean }) {
  if (state.hasChildren)
    return state.expanded ? (
      <FolderOpen className="size-4 text-primary" />
    ) : (
      <Folder className="size-4 text-primary" />
    )
  switch (node.kind) {
    case "tsx":
    case "ts":
      return <FileCode className="size-4" />
    case "json":
      return <FileJson className="size-4" />
    case "md":
      return <FileText className="size-4" />
    case "img":
      return <ImageIcon className="size-4" />
    default:
      return <File className="size-4" />
  }
}

// Drag rows to reorder, or drop onto a folder to move inside it.
export function TreeDragDropExample() {
  const [data, setData] = React.useState<TreeNode[]>(fileTree)
  return (
    <div className="flex w-full max-w-sm flex-col gap-2 rounded-lg border p-2">
      <Tree
        data={data}
        draggable
        defaultExpandedIds={["src", "components", "assets"]}
        getItemIcon={(node, state) => fileIcon(node, state)}
        onMove={({ dragId, targetId, position }) =>
          setData((d) => moveTreeNode(d, dragId, targetId, position))
        }
      />
      <p className="px-1 text-xs text-muted-foreground">
        Drag rows to reorder · drop onto a folder to move inside it
      </p>
    </div>
  )
}

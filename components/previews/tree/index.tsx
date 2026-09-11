import type { PreviewExample } from "@/components/previews/types"
import { TreeAsyncExample } from "./tree-async"
import { TreeDisabledExample } from "./tree-disabled"
import { TreeDragDropExample } from "./tree-drag-drop"
import { TreeFileExplorerExample } from "./tree-file-explorer"
import { TreeMultipleSelectExample } from "./tree-multiple-select"
import { TreeOrgChartExample } from "./tree-org-chart"
import { TreePermissionsExample } from "./tree-permissions"

export const treeExamples: PreviewExample[] = [
  {
    name: "file-explorer",
    title: "File explorer",
    component: TreeFileExplorerExample,
    file: "components/previews/tree/tree-file-explorer.tsx",
  },
  {
    name: "multiple-select",
    title: "Multiple selection",
    component: TreeMultipleSelectExample,
    file: "components/previews/tree/tree-multiple-select.tsx",
  },
  {
    name: "permissions",
    title: "Permissions (checkbox)",
    component: TreePermissionsExample,
    file: "components/previews/tree/tree-permissions.tsx",
  },
  {
    name: "org-chart",
    title: "Organization chart",
    component: TreeOrgChartExample,
    file: "components/previews/tree/tree-org-chart.tsx",
  },
  {
    name: "drag-drop",
    title: "Drag & drop",
    component: TreeDragDropExample,
    file: "components/previews/tree/tree-drag-drop.tsx",
  },
  {
    name: "async",
    title: "Async loading",
    component: TreeAsyncExample,
    file: "components/previews/tree/tree-async.tsx",
  },
  {
    name: "disabled",
    title: "Disabled nodes",
    component: TreeDisabledExample,
    file: "components/previews/tree/tree-disabled.tsx",
  },
]

import type { PreviewExample } from "@/components/previews/types"
import { AnchorHorizontalExample } from "./anchor-horizontal"
import { AnchorVerticalExample } from "./anchor-vertical"

export const anchorExamples: PreviewExample[] = [
  {
    name: "vertical",
    title: "Vertical",
    component: AnchorVerticalExample,
    file: "components/previews/anchor/anchor-vertical.tsx",
  },
  {
    name: "horizontal",
    title: "Horizontal",
    component: AnchorHorizontalExample,
    file: "components/previews/anchor/anchor-horizontal.tsx",
  },
]

import type { PreviewExample } from "@/components/previews/types"
import { SpaceAlignExample } from "./space-align"
import { SpaceBasicExample } from "./space-basic"
import { SpaceCompactExample } from "./space-compact"
import { SpaceSizesExample } from "./space-sizes"
import { SpaceSplitExample } from "./space-split"
import { SpaceVerticalExample } from "./space-vertical"
import { SpaceWrapExample } from "./space-wrap"

export const spaceExamples: PreviewExample[] = [
  {
    name: "basic",
    title: "Basic",
    component: SpaceBasicExample,
    file: "components/previews/space/space-basic.tsx",
  },
  {
    name: "vertical",
    title: "Vertical",
    component: SpaceVerticalExample,
    file: "components/previews/space/space-vertical.tsx",
  },
  {
    name: "sizes",
    title: "Sizes",
    component: SpaceSizesExample,
    file: "components/previews/space/space-sizes.tsx",
  },
  {
    name: "align",
    title: "Align",
    component: SpaceAlignExample,
    file: "components/previews/space/space-align.tsx",
  },
  {
    name: "split",
    title: "Split",
    component: SpaceSplitExample,
    file: "components/previews/space/space-split.tsx",
  },
  {
    name: "wrap",
    title: "Wrap",
    component: SpaceWrapExample,
    file: "components/previews/space/space-wrap.tsx",
  },
  {
    name: "compact",
    title: "Compact",
    component: SpaceCompactExample,
    file: "components/previews/space/space-compact.tsx",
  },
]

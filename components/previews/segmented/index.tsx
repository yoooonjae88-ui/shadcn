import type { PreviewExample } from "@/components/previews/types"
import { SegmentedBasicExample } from "./segmented-basic"
import { SegmentedBlockExample } from "./segmented-block"
import { SegmentedControlledExample } from "./segmented-controlled"
import { SegmentedCustomRenderExample } from "./segmented-custom-render"
import { SegmentedDisabledExample } from "./segmented-disabled"
import { SegmentedIconOnlyExample } from "./segmented-icon-only"
import { SegmentedIconsExample } from "./segmented-icons"
import { SegmentedRoundExample } from "./segmented-round"
import { SegmentedSizesExample } from "./segmented-sizes"
import { SegmentedVerticalExample } from "./segmented-vertical"

export const segmentedExamples: PreviewExample[] = [
  {
    name: "basic",
    title: "Basic",
    component: SegmentedBasicExample,
    file: "components/previews/segmented/segmented-basic.tsx",
  },
  {
    name: "controlled",
    title: "Controlled",
    component: SegmentedControlledExample,
    file: "components/previews/segmented/segmented-controlled.tsx",
  },
  {
    name: "icons",
    title: "With icon",
    component: SegmentedIconsExample,
    file: "components/previews/segmented/segmented-icons.tsx",
  },
  {
    name: "icon-only",
    title: "Icon only",
    component: SegmentedIconOnlyExample,
    file: "components/previews/segmented/segmented-icon-only.tsx",
  },
  {
    name: "sizes",
    title: "Sizes",
    component: SegmentedSizesExample,
    file: "components/previews/segmented/segmented-sizes.tsx",
  },
  {
    name: "block",
    title: "Block",
    component: SegmentedBlockExample,
    file: "components/previews/segmented/segmented-block.tsx",
  },
  {
    name: "round",
    title: "Round shape",
    component: SegmentedRoundExample,
    file: "components/previews/segmented/segmented-round.tsx",
  },
  {
    name: "disabled",
    title: "Disabled",
    component: SegmentedDisabledExample,
    file: "components/previews/segmented/segmented-disabled.tsx",
  },
  {
    name: "vertical",
    title: "Vertical",
    component: SegmentedVerticalExample,
    file: "components/previews/segmented/segmented-vertical.tsx",
  },
  {
    name: "custom-render",
    title: "Custom render",
    component: SegmentedCustomRenderExample,
    file: "components/previews/segmented/segmented-custom-render.tsx",
  },
]

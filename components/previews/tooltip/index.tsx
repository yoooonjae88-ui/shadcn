import type { PreviewExample } from "@/components/previews/types"
import { TooltipAlignmentExample } from "./tooltip-alignment"
import { TooltipArrowExample } from "./tooltip-arrow"
import { TooltipDefaultExample } from "./tooltip-default"
import { TooltipDelayExample } from "./tooltip-delay"
import { TooltipGroupedExample } from "./tooltip-grouped"
import { TooltipIconActionsExample } from "./tooltip-icon-actions"
import { TooltipRichContentExample } from "./tooltip-rich-content"
import { TooltipSidesExample } from "./tooltip-sides"
import { TooltipVariantsExample } from "./tooltip-variants"

export const tooltipExamples: PreviewExample[] = [
  {
    name: "default",
    title: "Default",
    component: TooltipDefaultExample,
    file: "components/previews/tooltip/tooltip-default.tsx",
  },
  {
    name: "sides",
    title: "Sides",
    component: TooltipSidesExample,
    file: "components/previews/tooltip/tooltip-sides.tsx",
  },
  {
    name: "alignment",
    title: "Alignment",
    component: TooltipAlignmentExample,
    file: "components/previews/tooltip/tooltip-alignment.tsx",
  },
  {
    name: "variants",
    title: "Variants",
    component: TooltipVariantsExample,
    file: "components/previews/tooltip/tooltip-variants.tsx",
  },
  {
    name: "arrow",
    title: "Arrow",
    component: TooltipArrowExample,
    file: "components/previews/tooltip/tooltip-arrow.tsx",
  },
  {
    name: "delay",
    title: "Delay",
    component: TooltipDelayExample,
    file: "components/previews/tooltip/tooltip-delay.tsx",
  },
  {
    name: "grouped",
    title: "Grouped (shared delay)",
    component: TooltipGroupedExample,
    file: "components/previews/tooltip/tooltip-grouped.tsx",
  },
  {
    name: "rich-content",
    title: "Rich content",
    component: TooltipRichContentExample,
    file: "components/previews/tooltip/tooltip-rich-content.tsx",
  },
  {
    name: "icon-actions",
    title: "Icon actions & disabled",
    component: TooltipIconActionsExample,
    file: "components/previews/tooltip/tooltip-icon-actions.tsx",
  },
]

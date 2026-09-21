import type { PreviewExample } from "@/components/previews/types"
import { FloatButtonBackTopExample } from "./float-button-back-top"
import { FloatButtonBadgeExample } from "./float-button-badge"
import { FloatButtonBasicExample } from "./float-button-basic"
import { FloatButtonControlledExample } from "./float-button-controlled"
import { FloatButtonDescriptionExample } from "./float-button-description"
import { FloatButtonGroupExample } from "./float-button-group"
import { FloatButtonMenuExample } from "./float-button-menu"
import { FloatButtonPlacementExample } from "./float-button-placement"
import { FloatButtonShapeExample } from "./float-button-shape"
import { FloatButtonTooltipExample } from "./float-button-tooltip"
import { FloatButtonTypeExample } from "./float-button-type"

export const floatButtonExamples: PreviewExample[] = [
  {
    name: "basic",
    title: "Basic",
    component: FloatButtonBasicExample,
    file: "components/previews/float-button/float-button-basic.tsx",
  },
  {
    name: "type",
    title: "Type",
    component: FloatButtonTypeExample,
    file: "components/previews/float-button/float-button-type.tsx",
  },
  {
    name: "shape",
    title: "Shape",
    component: FloatButtonShapeExample,
    file: "components/previews/float-button/float-button-shape.tsx",
  },
  {
    name: "description",
    title: "Description",
    component: FloatButtonDescriptionExample,
    file: "components/previews/float-button/float-button-description.tsx",
  },
  {
    name: "tooltip",
    title: "Tooltip",
    component: FloatButtonTooltipExample,
    file: "components/previews/float-button/float-button-tooltip.tsx",
  },
  {
    name: "badge",
    title: "Badge",
    component: FloatButtonBadgeExample,
    file: "components/previews/float-button/float-button-badge.tsx",
  },
  {
    name: "group",
    title: "Group",
    component: FloatButtonGroupExample,
    file: "components/previews/float-button/float-button-group.tsx",
  },
  {
    name: "menu",
    title: "Menu (hover & click)",
    component: FloatButtonMenuExample,
    file: "components/previews/float-button/float-button-menu.tsx",
  },
  {
    name: "placement",
    title: "Placement",
    component: FloatButtonPlacementExample,
    file: "components/previews/float-button/float-button-placement.tsx",
  },
  {
    name: "controlled",
    title: "Controlled menu",
    component: FloatButtonControlledExample,
    file: "components/previews/float-button/float-button-controlled.tsx",
  },
  {
    name: "back-top",
    title: "Back to top",
    component: FloatButtonBackTopExample,
    file: "components/previews/float-button/float-button-back-top.tsx",
  },
]

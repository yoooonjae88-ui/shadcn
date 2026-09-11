import type { PreviewExample } from "@/components/previews/types"
import { AvatarColorsExample } from "./avatar-colors"
import { AvatarDefaultExample } from "./avatar-default"
import { AvatarFallbackExample } from "./avatar-fallback"
import { AvatarGroupExample } from "./avatar-group"
import { AvatarIndicatorsExample } from "./avatar-indicators"
import { AvatarShapesExample } from "./avatar-shapes"
import { AvatarSizesExample } from "./avatar-sizes"
import { AvatarStatusExample } from "./avatar-status"

export const avatarExamples: PreviewExample[] = [
  {
    name: "default",
    title: "Default",
    component: AvatarDefaultExample,
    file: "components/previews/avatar/avatar-default.tsx",
  },
  {
    name: "fallback",
    title: "Fallback",
    component: AvatarFallbackExample,
    file: "components/previews/avatar/avatar-fallback.tsx",
  },
  {
    name: "sizes",
    title: "Sizes",
    component: AvatarSizesExample,
    file: "components/previews/avatar/avatar-sizes.tsx",
  },
  {
    name: "shapes",
    title: "Shapes",
    component: AvatarShapesExample,
    file: "components/previews/avatar/avatar-shapes.tsx",
  },
  {
    name: "status",
    title: "Status",
    component: AvatarStatusExample,
    file: "components/previews/avatar/avatar-status.tsx",
  },
  {
    name: "indicators",
    title: "Indicators & badges",
    component: AvatarIndicatorsExample,
    file: "components/previews/avatar/avatar-indicators.tsx",
  },
  {
    name: "colors",
    title: "Colored fallbacks",
    component: AvatarColorsExample,
    file: "components/previews/avatar/avatar-colors.tsx",
  },
  {
    name: "group",
    title: "Group",
    component: AvatarGroupExample,
    file: "components/previews/avatar/avatar-group.tsx",
  },
]

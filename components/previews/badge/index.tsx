import type { PreviewExample } from "@/components/previews/types"
import { BadgeAnimatedExample } from "./badge-animated"
import { BadgeColorsExample } from "./badge-colors"
import { BadgeCountExample } from "./badge-count"
import { BadgeOffsetExample } from "./badge-offset"
import { BadgeRibbonExample } from "./badge-ribbon"
import { BadgeStandaloneExample } from "./badge-standalone"
import { BadgeStatusExample } from "./badge-status"

export const badgeExamples: PreviewExample[] = [
  {
    name: "count",
    title: "Count, dot & overflow",
    component: BadgeCountExample,
    file: "components/previews/badge/badge-count.tsx",
  },
  {
    name: "animated",
    title: "Animated count",
    component: BadgeAnimatedExample,
    file: "components/previews/badge/badge-animated.tsx",
  },
  {
    name: "standalone",
    title: "Small & standalone",
    component: BadgeStandaloneExample,
    file: "components/previews/badge/badge-standalone.tsx",
  },
  {
    name: "status",
    title: "Status",
    component: BadgeStatusExample,
    file: "components/previews/badge/badge-status.tsx",
  },
  {
    name: "colors",
    title: "Preset & custom colours",
    component: BadgeColorsExample,
    file: "components/previews/badge/badge-colors.tsx",
  },
  {
    name: "offset",
    title: "Offset & title",
    component: BadgeOffsetExample,
    file: "components/previews/badge/badge-offset.tsx",
  },
  {
    name: "ribbon",
    title: "Ribbon",
    component: BadgeRibbonExample,
    file: "components/previews/badge/badge-ribbon.tsx",
  },
]

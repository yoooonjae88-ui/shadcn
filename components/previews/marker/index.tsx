import type { PreviewExample } from "@/components/previews/types"
import { MarkerBorderExample } from "./marker-border"
import { MarkerDemoExample } from "./marker-demo"
import { MarkerIconExample } from "./marker-icon"
import { MarkerLinkButtonExample } from "./marker-link-button"
import { MarkerSeparatorExample } from "./marker-separator"
import { MarkerStatusExample } from "./marker-status"
import { MarkerVariantsExample } from "./marker-variants"

export const markerExamples: PreviewExample[] = [
  {
    name: "demo",
    title: "Demo",
    component: MarkerDemoExample,
    file: "components/previews/marker/marker-demo.tsx",
  },
  {
    name: "variants",
    title: "Variants",
    component: MarkerVariantsExample,
    file: "components/previews/marker/marker-variants.tsx",
  },
  {
    name: "status",
    title: "Status",
    component: MarkerStatusExample,
    file: "components/previews/marker/marker-status.tsx",
  },
  {
    name: "separator",
    title: "Separator",
    component: MarkerSeparatorExample,
    file: "components/previews/marker/marker-separator.tsx",
  },
  {
    name: "border",
    title: "Border",
    component: MarkerBorderExample,
    file: "components/previews/marker/marker-border.tsx",
  },
  {
    name: "icon",
    title: "With icon",
    component: MarkerIconExample,
    file: "components/previews/marker/marker-icon.tsx",
  },
  {
    name: "link-button",
    title: "Links and buttons",
    component: MarkerLinkButtonExample,
    file: "components/previews/marker/marker-link-button.tsx",
  },
]

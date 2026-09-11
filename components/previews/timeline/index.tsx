import type { PreviewExample } from "@/components/previews/types"
import { TimelineAlternatingExample } from "./timeline-alternating"
import { TimelineHorizontalExample } from "./timeline-horizontal"
import { TimelineStatusExample } from "./timeline-status"
import { TimelineVerticalExample } from "./timeline-vertical"

export const timelineExamples: PreviewExample[] = [
  {
    name: "vertical",
    title: "Vertical",
    component: TimelineVerticalExample,
    file: "components/previews/timeline/timeline-vertical.tsx",
  },
  {
    name: "alternating",
    title: "Alternating",
    component: TimelineAlternatingExample,
    file: "components/previews/timeline/timeline-alternating.tsx",
  },
  {
    name: "horizontal",
    title: "Horizontal",
    component: TimelineHorizontalExample,
    file: "components/previews/timeline/timeline-horizontal.tsx",
  },
  {
    name: "status",
    title: "Status feed",
    component: TimelineStatusExample,
    file: "components/previews/timeline/timeline-status.tsx",
  },
]

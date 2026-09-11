import type { PreviewExample } from "@/components/previews/types"
import { BreadcrumbAvatarsExample } from "./breadcrumb-avatars"
import { BreadcrumbBadgeExample } from "./breadcrumb-badge"
import { BreadcrumbEllipsisExample } from "./breadcrumb-ellipsis"
import { BreadcrumbRichExample } from "./breadcrumb-rich"

export const breadcrumbExamples: PreviewExample[] = [
  {
    name: "ellipsis",
    title: "Ellipsis for long paths",
    component: BreadcrumbEllipsisExample,
    file: "components/previews/breadcrumb/breadcrumb-ellipsis.tsx",
  },
  {
    name: "avatars",
    title: "Items with avatars",
    component: BreadcrumbAvatarsExample,
    file: "components/previews/breadcrumb/breadcrumb-avatars.tsx",
  },
  {
    name: "badge",
    title: "Badge with count",
    component: BreadcrumbBadgeExample,
    file: "components/previews/breadcrumb/breadcrumb-badge.tsx",
  },
  {
    name: "rich",
    title: "Project & document info",
    component: BreadcrumbRichExample,
    file: "components/previews/breadcrumb/breadcrumb-rich.tsx",
  },
]

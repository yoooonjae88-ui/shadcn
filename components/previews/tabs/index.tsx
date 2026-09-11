import type { PreviewExample } from "@/components/previews/types"
import { TabsBadgesExample } from "./tabs-badges"
import { TabsIconsExample } from "./tabs-icons"
import { TabsVerticalExample } from "./tabs-vertical"

export const tabsExamples: PreviewExample[] = [
  {
    name: "icons",
    title: "With icons",
    component: TabsIconsExample,
    file: "components/previews/tabs/tabs-icons.tsx",
  },
  {
    name: "badges",
    title: "Badge counts (line)",
    component: TabsBadgesExample,
    file: "components/previews/tabs/tabs-badges.tsx",
  },
  {
    name: "vertical",
    title: "Vertical with icons",
    component: TabsVerticalExample,
    file: "components/previews/tabs/tabs-vertical.tsx",
  },
]

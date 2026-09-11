import type { PreviewExample } from "@/components/previews/types"
import { ProgressCircularExample } from "./progress-circular"
import { ProgressCircularLiveExample } from "./progress-circular-live"
import { ProgressCircularSizesExample } from "./progress-circular-sizes"
import { ProgressColorsExample } from "./progress-colors"
import { ProgressDefaultExample } from "./progress-default"
import { ProgressIndeterminateExample } from "./progress-indeterminate"
import { ProgressLabelExample } from "./progress-label"
import { ProgressLiveExample } from "./progress-live"
import { ProgressSizesExample } from "./progress-sizes"

export const progressExamples: PreviewExample[] = [
  {
    name: "default",
    title: "Default",
    component: ProgressDefaultExample,
    file: "components/previews/progress/progress-default.tsx",
  },
  {
    name: "sizes",
    title: "Sizes",
    component: ProgressSizesExample,
    file: "components/previews/progress/progress-sizes.tsx",
  },
  {
    name: "colors",
    title: "Colors",
    component: ProgressColorsExample,
    file: "components/previews/progress/progress-colors.tsx",
  },
  {
    name: "label",
    title: "With label & value",
    component: ProgressLabelExample,
    file: "components/previews/progress/progress-label.tsx",
  },
  {
    name: "indeterminate",
    title: "Indeterminate",
    component: ProgressIndeterminateExample,
    file: "components/previews/progress/progress-indeterminate.tsx",
  },
  {
    name: "live",
    title: "Live (animated)",
    component: ProgressLiveExample,
    file: "components/previews/progress/progress-live.tsx",
  },
  {
    name: "circular",
    title: "Circular",
    component: ProgressCircularExample,
    file: "components/previews/progress/progress-circular.tsx",
  },
  {
    name: "circular-sizes",
    title: "Circular sizes",
    component: ProgressCircularSizesExample,
    file: "components/previews/progress/progress-circular-sizes.tsx",
  },
  {
    name: "circular-live",
    title: "Circular live",
    component: ProgressCircularLiveExample,
    file: "components/previews/progress/progress-circular-live.tsx",
  },
]

import type { PreviewExample } from "@/components/previews/types"
import { StepsIconsExample } from "./steps-icons"
import { StepsPlaygroundExample } from "./steps-playground"
import { StepsProgressExample } from "./steps-progress"
import { StepsSegmentedExample } from "./steps-segmented"

export const stepsExamples: PreviewExample[] = [
  {
    name: "playground",
    title: "Numbered, clickable",
    component: StepsPlaygroundExample,
    file: "components/previews/steps/steps-playground.tsx",
  },
  {
    name: "icons",
    title: "Icons and badges",
    component: StepsIconsExample,
    file: "components/previews/steps/steps-icons.tsx",
  },
  {
    name: "progress",
    title: "Progress bar with titles",
    component: StepsProgressExample,
    file: "components/previews/steps/steps-progress.tsx",
  },
  {
    name: "segmented",
    title: "Segmented progress bar",
    component: StepsSegmentedExample,
    file: "components/previews/steps/steps-segmented.tsx",
  },
]

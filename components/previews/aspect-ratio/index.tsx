import type { PreviewExample } from "@/components/previews/types"
import { AspectRatioBasicExample } from "./aspect-ratio-basic"
import { AspectRatioImageExample } from "./aspect-ratio-image"
import { AspectRatioPortraitExample } from "./aspect-ratio-portrait"
import { AspectRatioRatiosExample } from "./aspect-ratio-ratios"
import { AspectRatioRtlExample } from "./aspect-ratio-rtl"
import { AspectRatioSquareExample } from "./aspect-ratio-square"

export const aspectRatioExamples: PreviewExample[] = [
  {
    name: "basic",
    title: "Basic",
    component: AspectRatioBasicExample,
    file: "components/previews/aspect-ratio/aspect-ratio-basic.tsx",
  },
  {
    name: "square",
    title: "Square",
    component: AspectRatioSquareExample,
    file: "components/previews/aspect-ratio/aspect-ratio-square.tsx",
  },
  {
    name: "portrait",
    title: "Portrait",
    component: AspectRatioPortraitExample,
    file: "components/previews/aspect-ratio/aspect-ratio-portrait.tsx",
  },
  {
    name: "ratios",
    title: "Common ratios",
    component: AspectRatioRatiosExample,
    file: "components/previews/aspect-ratio/aspect-ratio-ratios.tsx",
  },
  {
    name: "image",
    title: "Cropping an image",
    component: AspectRatioImageExample,
    file: "components/previews/aspect-ratio/aspect-ratio-image.tsx",
  },
  {
    name: "rtl",
    title: "RTL",
    component: AspectRatioRtlExample,
    file: "components/previews/aspect-ratio/aspect-ratio-rtl.tsx",
  },
]

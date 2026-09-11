import type { PreviewExample } from "@/components/previews/types"
import { CarouselAutoplayExample } from "./carousel-autoplay"
import { CarouselCounterExample } from "./carousel-counter"
import { CarouselDefaultExample } from "./carousel-default"
import { CarouselLoopDotsExample } from "./carousel-loop-dots"
import { CarouselMultipleExample } from "./carousel-multiple"
import { CarouselThumbnailsExample } from "./carousel-thumbnails"
import { CarouselVerticalExample } from "./carousel-vertical"

export const carouselExamples: PreviewExample[] = [
  {
    name: "default",
    title: "Default",
    component: CarouselDefaultExample,
    file: "components/previews/carousel/carousel-default.tsx",
  },
  {
    name: "multiple",
    title: "Multiple slides",
    component: CarouselMultipleExample,
    file: "components/previews/carousel/carousel-multiple.tsx",
  },
  {
    name: "loop-dots",
    title: "Loop + dots",
    component: CarouselLoopDotsExample,
    file: "components/previews/carousel/carousel-loop-dots.tsx",
  },
  {
    name: "autoplay",
    title: "Autoplay",
    component: CarouselAutoplayExample,
    file: "components/previews/carousel/carousel-autoplay.tsx",
  },
  {
    name: "vertical",
    title: "Vertical",
    component: CarouselVerticalExample,
    file: "components/previews/carousel/carousel-vertical.tsx",
  },
  {
    name: "counter",
    title: "Slide counter (API)",
    component: CarouselCounterExample,
    file: "components/previews/carousel/carousel-counter.tsx",
  },
  {
    name: "thumbnails",
    title: "Thumbnails",
    component: CarouselThumbnailsExample,
    file: "components/previews/carousel/carousel-thumbnails.tsx",
  },
]

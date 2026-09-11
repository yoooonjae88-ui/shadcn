import type { PreviewExample } from "@/components/previews/types"
import { MasonryBasicExample } from "./masonry-basic"
import { MasonryDraggableExample } from "./masonry-draggable"
import { MasonryItemsApiExample } from "./masonry-items-api"
import { MasonrySequentialExample } from "./masonry-sequential"

export const masonryExamples: PreviewExample[] = [
  {
    name: "basic",
    title: "Basic",
    component: MasonryBasicExample,
    file: "components/previews/masonry/masonry-basic.tsx",
  },
  {
    name: "sequential",
    title: "Sequential order",
    component: MasonrySequentialExample,
    file: "components/previews/masonry/masonry-sequential.tsx",
  },
  {
    name: "draggable",
    title: "Closable & draggable",
    component: MasonryDraggableExample,
    file: "components/previews/masonry/masonry-draggable.tsx",
  },
  {
    name: "items-api",
    title: "Items API & pinning",
    component: MasonryItemsApiExample,
    file: "components/previews/masonry/masonry-items-api.tsx",
  },
]

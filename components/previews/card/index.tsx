import type { PreviewExample } from "@/components/previews/types"
import { CardExpandableExample } from "./card-expandable"
import { CardHeaderMenuExample } from "./card-header-menu"
import { CardMediaExample } from "./card-media"
import { CardTableExample } from "./card-table"

export const cardExamples: PreviewExample[] = [
  {
    name: "header-menu",
    title: "Header with menu",
    component: CardHeaderMenuExample,
    file: "components/previews/card/card-header-menu.tsx",
  },
  {
    name: "expandable",
    title: "Expandable",
    component: CardExpandableExample,
    file: "components/previews/card/card-expandable.tsx",
  },
  {
    name: "media",
    title: "Cover media",
    component: CardMediaExample,
    file: "components/previews/card/card-media.tsx",
  },
  {
    name: "table",
    title: "Accent & table",
    component: CardTableExample,
    file: "components/previews/card/card-table.tsx",
  },
]

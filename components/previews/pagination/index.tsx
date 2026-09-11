import type { PreviewExample } from "@/components/previews/types"
import { PaginationAlignedExample } from "./pagination-aligned"
import { PaginationBasicExample } from "./pagination-basic"
import { PaginationFullExample } from "./pagination-full"
import { PaginationMoreExample } from "./pagination-more"
import { PaginationSimpleExample } from "./pagination-simple"

export const paginationExamples: PreviewExample[] = [
  {
    name: "basic",
    title: "Basic",
    component: PaginationBasicExample,
    file: "components/previews/pagination/pagination-basic.tsx",
  },
  {
    name: "more",
    title: "More pages",
    component: PaginationMoreExample,
    file: "components/previews/pagination/pagination-more.tsx",
  },
  {
    name: "full",
    title: "Total, size & jumper",
    component: PaginationFullExample,
    file: "components/previews/pagination/pagination-full.tsx",
  },
  {
    name: "simple",
    title: "Simple mode",
    component: PaginationSimpleExample,
    file: "components/previews/pagination/pagination-simple.tsx",
  },
  {
    name: "aligned",
    title: "Aligned center",
    component: PaginationAlignedExample,
    file: "components/previews/pagination/pagination-aligned.tsx",
  },
]

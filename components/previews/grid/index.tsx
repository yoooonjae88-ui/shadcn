import type { PreviewExample } from "@/components/previews/types"
import { GridBasicExample } from "./grid-basic"
import { GridFlexFillExample } from "./grid-flex-fill"
import { GridGutterExample } from "./grid-gutter"
import { GridJustifyAlignExample } from "./grid-justify-align"
import { GridOffsetOrderExample } from "./grid-offset-order"
import { GridResponsiveExample } from "./grid-responsive"

export const gridExamples: PreviewExample[] = [
  {
    name: "basic",
    title: "Basic grid",
    component: GridBasicExample,
    file: "components/previews/grid/grid-basic.tsx",
  },
  {
    name: "gutter",
    title: "Gutter",
    component: GridGutterExample,
    file: "components/previews/grid/grid-gutter.tsx",
  },
  {
    name: "offset-order",
    title: "Offset and order",
    component: GridOffsetOrderExample,
    file: "components/previews/grid/grid-offset-order.tsx",
  },
  {
    name: "justify-align",
    title: "Justify and align",
    component: GridJustifyAlignExample,
    file: "components/previews/grid/grid-justify-align.tsx",
  },
  {
    name: "responsive",
    title: "Responsive",
    component: GridResponsiveExample,
    file: "components/previews/grid/grid-responsive.tsx",
  },
  {
    name: "flex-fill",
    title: "Flex fill",
    component: GridFlexFillExample,
    file: "components/previews/grid/grid-flex-fill.tsx",
  },
]

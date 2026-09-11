import type { PreviewExample } from "@/components/previews/types"
import { SplitterBasicExample } from "./splitter-basic"
import { SplitterCollapsibleExample } from "./splitter-collapsible"
import { SplitterLazyExample } from "./splitter-lazy"
import { SplitterMultipleExample } from "./splitter-multiple"
import { SplitterVerticalExample } from "./splitter-vertical"

export const splitterExamples: PreviewExample[] = [
  {
    name: "basic",
    title: "Basic",
    component: SplitterBasicExample,
    file: "components/previews/splitter/splitter-basic.tsx",
  },
  {
    name: "vertical",
    title: "Vertical",
    component: SplitterVerticalExample,
    file: "components/previews/splitter/splitter-vertical.tsx",
  },
  {
    name: "collapsible",
    title: "Collapsible",
    component: SplitterCollapsibleExample,
    file: "components/previews/splitter/splitter-collapsible.tsx",
  },
  {
    name: "multiple",
    title: "Multiple panels",
    component: SplitterMultipleExample,
    file: "components/previews/splitter/splitter-multiple.tsx",
  },
  {
    name: "lazy",
    title: "Lazy resize",
    component: SplitterLazyExample,
    file: "components/previews/splitter/splitter-lazy.tsx",
  },
]

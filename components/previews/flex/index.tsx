import type { PreviewExample } from "@/components/previews/types"
import { FlexBasicExample } from "./flex-basic"
import { FlexGapExample } from "./flex-gap"
import { FlexJustifyAlignExample } from "./flex-justify-align"
import { FlexNestingExample } from "./flex-nesting"
import { FlexWrapExample } from "./flex-wrap"

export const flexExamples: PreviewExample[] = [
  {
    name: "basic",
    title: "Basic",
    component: FlexBasicExample,
    file: "components/previews/flex/flex-basic.tsx",
  },
  {
    name: "justify-align",
    title: "Justify and align",
    component: FlexJustifyAlignExample,
    file: "components/previews/flex/flex-justify-align.tsx",
  },
  {
    name: "gap",
    title: "Gap",
    component: FlexGapExample,
    file: "components/previews/flex/flex-gap.tsx",
  },
  {
    name: "wrap",
    title: "Wrap",
    component: FlexWrapExample,
    file: "components/previews/flex/flex-wrap.tsx",
  },
  {
    name: "nesting",
    title: "Nesting",
    component: FlexNestingExample,
    file: "components/previews/flex/flex-nesting.tsx",
  },
]

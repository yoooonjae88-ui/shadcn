import type { PreviewExample } from "@/components/previews/types"
import { DividerBasicExample } from "./divider-basic"
import { DividerOrientationMarginExample } from "./divider-orientation-margin"
import { DividerSizesExample } from "./divider-sizes"
import { DividerTitleExample } from "./divider-title"
import { DividerVariantsExample } from "./divider-variants"
import { DividerVerticalExample } from "./divider-vertical"

export const dividerExamples: PreviewExample[] = [
  {
    name: "basic",
    title: "Basic",
    component: DividerBasicExample,
    file: "components/previews/divider/divider-basic.tsx",
  },
  {
    name: "title",
    title: "With title",
    component: DividerTitleExample,
    file: "components/previews/divider/divider-title.tsx",
  },
  {
    name: "orientation-margin",
    title: "Orientation margin",
    component: DividerOrientationMarginExample,
    file: "components/previews/divider/divider-orientation-margin.tsx",
  },
  {
    name: "variants",
    title: "Variants",
    component: DividerVariantsExample,
    file: "components/previews/divider/divider-variants.tsx",
  },
  {
    name: "vertical",
    title: "Vertical",
    component: DividerVerticalExample,
    file: "components/previews/divider/divider-vertical.tsx",
  },
  {
    name: "sizes",
    title: "Sizes",
    component: DividerSizesExample,
    file: "components/previews/divider/divider-sizes.tsx",
  },
]

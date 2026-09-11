import type { PreviewExample } from "@/components/previews/types"
import { ButtonArrowExample } from "./button-arrow"
import { ButtonIconOnlyExample } from "./button-icon-only"
import { ButtonIconsExample } from "./button-icons"
import { ButtonLoadingExample } from "./button-loading"
import { ButtonNeutralExample } from "./button-neutral"
import { ButtonSizesExample } from "./button-sizes"
import { ButtonVariantsExample } from "./button-variants"

export const buttonExamples: PreviewExample[] = [
  {
    name: "variants",
    title: "Variants",
    component: ButtonVariantsExample,
    file: "components/previews/button/button-variants.tsx",
  },
  {
    name: "neutral",
    title: "Neutral variants",
    component: ButtonNeutralExample,
    file: "components/previews/button/button-neutral.tsx",
  },
  {
    name: "sizes",
    title: "Sizes",
    component: ButtonSizesExample,
    file: "components/previews/button/button-sizes.tsx",
  },
  {
    name: "icons",
    title: "With icons",
    component: ButtonIconsExample,
    file: "components/previews/button/button-icons.tsx",
  },
  {
    name: "icon-only",
    title: "Icon-only & shapes",
    component: ButtonIconOnlyExample,
    file: "components/previews/button/button-icon-only.tsx",
  },
  {
    name: "loading",
    title: "Loading",
    component: ButtonLoadingExample,
    file: "components/previews/button/button-loading.tsx",
  },
  {
    name: "arrow",
    title: "Button arrow",
    component: ButtonArrowExample,
    file: "components/previews/button/button-arrow.tsx",
  },
]

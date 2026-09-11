import type { PreviewExample } from "@/components/previews/types"
import { AlertActionsExample } from "./alert-actions"
import { AlertAppearancesExample } from "./alert-appearances"
import { AlertDescriptionExample } from "./alert-description"
import { AlertDismissibleExample } from "./alert-dismissible"
import { AlertSizesExample } from "./alert-sizes"
import { AlertVariantsExample } from "./alert-variants"

export const alertExamples: PreviewExample[] = [
  {
    name: "variants",
    title: "Variants",
    component: AlertVariantsExample,
    file: "components/previews/alert/alert-variants.tsx",
  },
  {
    name: "appearances",
    title: "Appearances",
    component: AlertAppearancesExample,
    file: "components/previews/alert/alert-appearances.tsx",
  },
  {
    name: "sizes",
    title: "Sizes",
    component: AlertSizesExample,
    file: "components/previews/alert/alert-sizes.tsx",
  },
  {
    name: "description",
    title: "With description",
    component: AlertDescriptionExample,
    file: "components/previews/alert/alert-description.tsx",
  },
  {
    name: "dismissible",
    title: "Dismissible",
    component: AlertDismissibleExample,
    file: "components/previews/alert/alert-dismissible.tsx",
  },
  {
    name: "actions",
    title: "With actions",
    component: AlertActionsExample,
    file: "components/previews/alert/alert-actions.tsx",
  },
]

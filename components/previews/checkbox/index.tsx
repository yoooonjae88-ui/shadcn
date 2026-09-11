import type { PreviewExample } from "@/components/previews/types"
import { CheckboxCardExample } from "./checkbox-card"
import { CheckboxCheckedExample } from "./checkbox-checked"
import { CheckboxDefaultExample } from "./checkbox-default"
import { CheckboxDescriptionExample } from "./checkbox-description"
import { CheckboxDisabledExample } from "./checkbox-disabled"
import { CheckboxFormExample } from "./checkbox-form"
import { CheckboxHorizontalExample } from "./checkbox-horizontal"
import { CheckboxIndeterminateExample } from "./checkbox-indeterminate"
import { CheckboxInvalidExample } from "./checkbox-invalid"
import { CheckboxSelectAllExample } from "./checkbox-select-all"
import { CheckboxSizesExample } from "./checkbox-sizes"

export const checkboxExamples: PreviewExample[] = [
  {
    name: "default",
    title: "Default",
    component: CheckboxDefaultExample,
    file: "components/previews/checkbox/checkbox-default.tsx",
  },
  {
    name: "checked",
    title: "Controlled",
    component: CheckboxCheckedExample,
    file: "components/previews/checkbox/checkbox-checked.tsx",
  },
  {
    name: "disabled",
    title: "Disabled",
    component: CheckboxDisabledExample,
    file: "components/previews/checkbox/checkbox-disabled.tsx",
  },
  {
    name: "indeterminate",
    title: "Indeterminate",
    component: CheckboxIndeterminateExample,
    file: "components/previews/checkbox/checkbox-indeterminate.tsx",
  },
  {
    name: "sizes",
    title: "Sizes",
    component: CheckboxSizesExample,
    file: "components/previews/checkbox/checkbox-sizes.tsx",
  },
  {
    name: "description",
    title: "With description",
    component: CheckboxDescriptionExample,
    file: "components/previews/checkbox/checkbox-description.tsx",
  },
  {
    name: "invalid",
    title: "Invalid",
    component: CheckboxInvalidExample,
    file: "components/previews/checkbox/checkbox-invalid.tsx",
  },
  {
    name: "horizontal",
    title: "Inline horizontal",
    component: CheckboxHorizontalExample,
    file: "components/previews/checkbox/checkbox-horizontal.tsx",
  },
  {
    name: "select-all",
    title: "Select all",
    component: CheckboxSelectAllExample,
    file: "components/previews/checkbox/checkbox-select-all.tsx",
  },
  {
    name: "card",
    title: "Card selection",
    component: CheckboxCardExample,
    file: "components/previews/checkbox/checkbox-card.tsx",
  },
  {
    name: "form",
    title: "Form",
    component: CheckboxFormExample,
    file: "components/previews/checkbox/checkbox-form.tsx",
  },
]

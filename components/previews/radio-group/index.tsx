import type { PreviewExample } from "@/components/previews/types"
import { RadioGroupBasicExample } from "./radio-group-basic"
import { RadioGroupCardsExample } from "./radio-group-cards"
import { RadioGroupColoredExample } from "./radio-group-colored"
import { RadioGroupControlledExample } from "./radio-group-controlled"
import { RadioGroupDescriptionExample } from "./radio-group-description"
import { RadioGroupDisabledExample } from "./radio-group-disabled"
import { RadioGroupFormExample } from "./radio-group-form"
import { RadioGroupGridExample } from "./radio-group-grid"
import { RadioGroupHorizontalExample } from "./radio-group-horizontal"
import { RadioGroupIconsExample } from "./radio-group-icons"
import { RadioGroupInvalidExample } from "./radio-group-invalid"
import { RadioGroupPricingExample } from "./radio-group-pricing"
import { RadioGroupSizesExample } from "./radio-group-sizes"

export const radioGroupExamples: PreviewExample[] = [
  {
    name: "basic",
    title: "Basic",
    component: RadioGroupBasicExample,
    file: "components/previews/radio-group/radio-group-basic.tsx",
  },
  {
    name: "controlled",
    title: "Controlled (read value)",
    component: RadioGroupControlledExample,
    file: "components/previews/radio-group/radio-group-controlled.tsx",
  },
  {
    name: "form",
    title: "Read value on form submit",
    component: RadioGroupFormExample,
    file: "components/previews/radio-group/radio-group-form.tsx",
  },
  {
    name: "disabled",
    title: "Disabled item",
    component: RadioGroupDisabledExample,
    file: "components/previews/radio-group/radio-group-disabled.tsx",
  },
  {
    name: "description",
    title: "With description",
    component: RadioGroupDescriptionExample,
    file: "components/previews/radio-group/radio-group-description.tsx",
  },
  {
    name: "invalid",
    title: "Invalid",
    component: RadioGroupInvalidExample,
    file: "components/previews/radio-group/radio-group-invalid.tsx",
  },
  {
    name: "colored",
    title: "Colored",
    component: RadioGroupColoredExample,
    file: "components/previews/radio-group/radio-group-colored.tsx",
  },
  {
    name: "sizes",
    title: "Sizes",
    component: RadioGroupSizesExample,
    file: "components/previews/radio-group/radio-group-sizes.tsx",
  },
  {
    name: "horizontal",
    title: "Inline horizontal",
    component: RadioGroupHorizontalExample,
    file: "components/previews/radio-group/radio-group-horizontal.tsx",
  },
  {
    name: "cards",
    title: "Card radios",
    component: RadioGroupCardsExample,
    file: "components/previews/radio-group/radio-group-cards.tsx",
  },
  {
    name: "icons",
    title: "List panel with icons",
    component: RadioGroupIconsExample,
    file: "components/previews/radio-group/radio-group-icons.tsx",
  },
  {
    name: "grid",
    title: "Grid layout",
    component: RadioGroupGridExample,
    file: "components/previews/radio-group/radio-group-grid.tsx",
  },
  {
    name: "pricing",
    title: "Pricing plans",
    component: RadioGroupPricingExample,
    file: "components/previews/radio-group/radio-group-pricing.tsx",
  },
]

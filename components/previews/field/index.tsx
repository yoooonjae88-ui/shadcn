import type { PreviewExample } from "@/components/previews/types"
import { FieldBookingFormExample } from "./field-booking-form"
import { FieldChoiceCardsExample } from "./field-choice-cards"
import { FieldHorizontalExample } from "./field-horizontal"
import { FieldOutlineExample } from "./field-outline"
import { FieldResponsiveExample } from "./field-responsive"
import { FieldSetExample } from "./field-set"
import { FieldVerticalExample } from "./field-vertical"

export const fieldExamples: PreviewExample[] = [
  {
    name: "vertical",
    title: "Vertical field",
    component: FieldVerticalExample,
    file: "components/previews/field/field-vertical.tsx",
  },
  {
    name: "horizontal",
    title: "Horizontal field",
    component: FieldHorizontalExample,
    file: "components/previews/field/field-horizontal.tsx",
  },
  {
    name: "responsive",
    title: "Responsive field",
    component: FieldResponsiveExample,
    file: "components/previews/field/field-responsive.tsx",
  },
  {
    name: "set",
    title: "Field set with legend",
    component: FieldSetExample,
    file: "components/previews/field/field-set.tsx",
  },
  {
    name: "choice-cards",
    title: "Choice cards",
    component: FieldChoiceCardsExample,
    file: "components/previews/field/field-choice-cards.tsx",
  },
  {
    name: "outline",
    title: "Outline group",
    component: FieldOutlineExample,
    file: "components/previews/field/field-outline.tsx",
  },
  {
    name: "booking-form",
    title: "Complete form with zod validation",
    component: FieldBookingFormExample,
    file: "components/previews/field/field-booking-form.tsx",
  },
]

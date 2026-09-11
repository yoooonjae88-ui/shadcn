import type { PreviewExample } from "@/components/previews/types"
import { AccordionControlledExample } from "./accordion-controlled"
import { AccordionDefaultExample } from "./accordion-default"
import { AccordionDisabledExample } from "./accordion-disabled"
import { AccordionIconsExample } from "./accordion-icons"
import { AccordionIndicatorStartExample } from "./accordion-indicator-start"
import { AccordionMultipleExample } from "./accordion-multiple"
import { AccordionOutlineExample } from "./accordion-outline"
import { AccordionPlusIndicatorExample } from "./accordion-plus-indicator"
import { AccordionRichContentExample } from "./accordion-rich-content"
import { AccordionSolidExample } from "./accordion-solid"

export const accordionExamples: PreviewExample[] = [
  {
    name: "default",
    title: "Default",
    component: AccordionDefaultExample,
    file: "components/previews/accordion/accordion-default.tsx",
  },
  {
    name: "multiple",
    title: "Multiple open",
    component: AccordionMultipleExample,
    file: "components/previews/accordion/accordion-multiple.tsx",
  },
  {
    name: "solid",
    title: "Solid",
    component: AccordionSolidExample,
    file: "components/previews/accordion/accordion-solid.tsx",
  },
  {
    name: "outline",
    title: "Outline",
    component: AccordionOutlineExample,
    file: "components/previews/accordion/accordion-outline.tsx",
  },
  {
    name: "plus-indicator",
    title: "Plus / minus indicator",
    component: AccordionPlusIndicatorExample,
    file: "components/previews/accordion/accordion-plus-indicator.tsx",
  },
  {
    name: "indicator-start",
    title: "Indicator at start",
    component: AccordionIndicatorStartExample,
    file: "components/previews/accordion/accordion-indicator-start.tsx",
  },
  {
    name: "icons",
    title: "With icons",
    component: AccordionIconsExample,
    file: "components/previews/accordion/accordion-icons.tsx",
  },
  {
    name: "disabled",
    title: "Disabled item",
    component: AccordionDisabledExample,
    file: "components/previews/accordion/accordion-disabled.tsx",
  },
  {
    name: "controlled",
    title: "Controlled",
    component: AccordionControlledExample,
    file: "components/previews/accordion/accordion-controlled.tsx",
  },
  {
    name: "rich-content",
    title: "Rich content",
    component: AccordionRichContentExample,
    file: "components/previews/accordion/accordion-rich-content.tsx",
  },
]

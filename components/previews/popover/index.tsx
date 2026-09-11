import type { PreviewExample } from "@/components/previews/types"
import { PopoverActionsExample } from "./popover-actions"
import { PopoverFeedbackExample } from "./popover-feedback"
import { PopoverFormExample } from "./popover-form"
import { PopoverFormSliderExample } from "./popover-form-slider"

export const popoverExamples: PreviewExample[] = [
  {
    name: "actions",
    title: "Action menu",
    component: PopoverActionsExample,
    file: "components/previews/popover/popover-actions.tsx",
  },
  {
    name: "feedback",
    title: "Feedback",
    component: PopoverFeedbackExample,
    file: "components/previews/popover/popover-feedback.tsx",
  },
  {
    name: "form",
    title: "Form",
    component: PopoverFormExample,
    file: "components/previews/popover/popover-form.tsx",
  },
  {
    name: "form-slider",
    title: "Form with slider",
    component: PopoverFormSliderExample,
    file: "components/previews/popover/popover-form-slider.tsx",
  },
]

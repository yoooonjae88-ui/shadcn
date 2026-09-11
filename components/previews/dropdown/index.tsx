import type { PreviewExample } from "@/components/previews/types"
import { DropdownCheckboxExample } from "./dropdown-checkbox"
import { DropdownMenuExample } from "./dropdown-menu"
import { DropdownRadioExample } from "./dropdown-radio"
import { DropdownSelectExample } from "./dropdown-select"

export const dropdownExamples: PreviewExample[] = [
  {
    name: "select",
    title: "Form select",
    component: DropdownSelectExample,
    file: "components/previews/dropdown/dropdown-select.tsx",
  },
  {
    name: "menu",
    title: "Action menu",
    component: DropdownMenuExample,
    file: "components/previews/dropdown/dropdown-menu.tsx",
  },
  {
    name: "checkbox",
    title: "Checkbox items",
    component: DropdownCheckboxExample,
    file: "components/previews/dropdown/dropdown-checkbox.tsx",
  },
  {
    name: "radio",
    title: "Radio group",
    component: DropdownRadioExample,
    file: "components/previews/dropdown/dropdown-radio.tsx",
  },
]

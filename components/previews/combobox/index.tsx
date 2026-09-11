import type { PreviewExample } from "@/components/previews/types"
import { ComboboxAddOptionExample } from "./combobox-add-option"
import { ComboboxBadgesExample } from "./combobox-badges"
import { ComboboxClearableExample } from "./combobox-clearable"
import { ComboboxDefaultExample } from "./combobox-default"
import { ComboboxDisabledExample } from "./combobox-disabled"
import { ComboboxDisabledOptionsExample } from "./combobox-disabled-options"
import { ComboboxGroupedExample } from "./combobox-grouped"
import { ComboboxIconsExample } from "./combobox-icons"
import { ComboboxIndicatorStartExample } from "./combobox-indicator-start"
import { ComboboxMultipleExample } from "./combobox-multiple"

export const comboboxExamples: PreviewExample[] = [
  {
    name: "default",
    title: "Default",
    component: ComboboxDefaultExample,
    file: "components/previews/combobox/combobox-default.tsx",
  },
  {
    name: "clearable",
    title: "Clearable",
    component: ComboboxClearableExample,
    file: "components/previews/combobox/combobox-clearable.tsx",
  },
  {
    name: "indicator-start",
    title: "Indicator at start",
    component: ComboboxIndicatorStartExample,
    file: "components/previews/combobox/combobox-indicator-start.tsx",
  },
  {
    name: "disabled-options",
    title: "Disabled options",
    component: ComboboxDisabledOptionsExample,
    file: "components/previews/combobox/combobox-disabled-options.tsx",
  },
  {
    name: "disabled",
    title: "Disabled",
    component: ComboboxDisabledExample,
    file: "components/previews/combobox/combobox-disabled.tsx",
  },
  {
    name: "grouped",
    title: "Grouped options",
    component: ComboboxGroupedExample,
    file: "components/previews/combobox/combobox-grouped.tsx",
  },
  {
    name: "icons",
    title: "With icons",
    component: ComboboxIconsExample,
    file: "components/previews/combobox/combobox-icons.tsx",
  },
  {
    name: "multiple",
    title: "Multiple",
    component: ComboboxMultipleExample,
    file: "components/previews/combobox/combobox-multiple.tsx",
  },
  {
    name: "badges",
    title: "Badges",
    component: ComboboxBadgesExample,
    file: "components/previews/combobox/combobox-badges.tsx",
  },
  {
    name: "add-option",
    title: "Add option",
    component: ComboboxAddOptionExample,
    file: "components/previews/combobox/combobox-add-option.tsx",
  },
]

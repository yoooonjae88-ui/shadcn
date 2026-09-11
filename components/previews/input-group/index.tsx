import type { PreviewExample } from "@/components/previews/types"
import { InputGroupButtonExample } from "./input-group-button"
import { InputGroupComposerExample } from "./input-group-composer"
import { InputGroupCopyExample } from "./input-group-copy"
import { InputGroupDropdownExample } from "./input-group-dropdown"
import { InputGroupKbdExample } from "./input-group-kbd"
import { InputGroupLoadingExample } from "./input-group-loading"
import { InputGroupStatesExample } from "./input-group-states"
import { InputGroupTextExample } from "./input-group-text"
import { InputGroupToolbarExample } from "./input-group-toolbar"
import { InputGroupTooltipExample } from "./input-group-tooltip"

export const inputGroupExamples: PreviewExample[] = [
  {
    name: "button",
    title: "Icon + button",
    component: InputGroupButtonExample,
    file: "components/previews/input-group/input-group-button.tsx",
  },
  {
    name: "text",
    title: "Text affixes",
    component: InputGroupTextExample,
    file: "components/previews/input-group/input-group-text.tsx",
  },
  {
    name: "tooltip",
    title: "Icon + tooltip",
    component: InputGroupTooltipExample,
    file: "components/previews/input-group/input-group-tooltip.tsx",
  },
  {
    name: "copy",
    title: "Inline action button",
    component: InputGroupCopyExample,
    file: "components/previews/input-group/input-group-copy.tsx",
  },
  {
    name: "kbd",
    title: "Keyboard hint",
    component: InputGroupKbdExample,
    file: "components/previews/input-group/input-group-kbd.tsx",
  },
  {
    name: "loading",
    title: "Loading state",
    component: InputGroupLoadingExample,
    file: "components/previews/input-group/input-group-loading.tsx",
  },
  {
    name: "dropdown",
    title: "With dropdown",
    component: InputGroupDropdownExample,
    file: "components/previews/input-group/input-group-dropdown.tsx",
  },
  {
    name: "composer",
    title: "Textarea with toolbar",
    component: InputGroupComposerExample,
    file: "components/previews/input-group/input-group-composer.tsx",
  },
  {
    name: "toolbar",
    title: "Textarea with top toolbar",
    component: InputGroupToolbarExample,
    file: "components/previews/input-group/input-group-toolbar.tsx",
  },
  {
    name: "states",
    title: "Invalid and disabled",
    component: InputGroupStatesExample,
    file: "components/previews/input-group/input-group-states.tsx",
  },
]

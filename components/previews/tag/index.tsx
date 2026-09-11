import type { PreviewExample } from "@/components/previews/types"
import { TagDisabledExample } from "./tag-disabled"
import { TagFilledExample } from "./tag-filled"
import { TagIconsExample } from "./tag-icons"
import { TagOutlinedExample } from "./tag-outlined"
import { TagSelectableExample } from "./tag-selectable"
import { TagSolidExample } from "./tag-solid"

export const tagExamples: PreviewExample[] = [
  {
    name: "filled",
    title: "Filled",
    component: TagFilledExample,
    file: "components/previews/tag/tag-filled.tsx",
  },
  {
    name: "solid",
    title: "Solid",
    component: TagSolidExample,
    file: "components/previews/tag/tag-solid.tsx",
  },
  {
    name: "outlined",
    title: "Outlined",
    component: TagOutlinedExample,
    file: "components/previews/tag/tag-outlined.tsx",
  },
  {
    name: "selectable",
    title: "Selectable groups",
    component: TagSelectableExample,
    file: "components/previews/tag/tag-selectable.tsx",
  },
  {
    name: "icons",
    title: "With icons",
    component: TagIconsExample,
    file: "components/previews/tag/tag-icons.tsx",
  },
  {
    name: "disabled",
    title: "Disabled",
    component: TagDisabledExample,
    file: "components/previews/tag/tag-disabled.tsx",
  },
]

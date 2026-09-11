import type { PreviewExample } from "@/components/previews/types"
import { DrawerPersistentExample } from "./drawer-persistent"
import { DrawerScrollableExample } from "./drawer-scrollable"
import { DrawerSidesExample } from "./drawer-sides"
import { DrawerSizesExample } from "./drawer-sizes"

export const drawerExamples: PreviewExample[] = [
  {
    name: "sides",
    title: "Sides",
    component: DrawerSidesExample,
    file: "components/previews/drawer/drawer-sides.tsx",
  },
  {
    name: "sizes",
    title: "Sizes",
    component: DrawerSizesExample,
    file: "components/previews/drawer/drawer-sizes.tsx",
  },
  {
    name: "scrollable",
    title: "Scrollable content",
    component: DrawerScrollableExample,
    file: "components/previews/drawer/drawer-scrollable.tsx",
  },
  {
    name: "persistent",
    title: "Persistent",
    component: DrawerPersistentExample,
    file: "components/previews/drawer/drawer-persistent.tsx",
  },
]

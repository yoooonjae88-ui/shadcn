import type { PreviewExample } from "@/components/previews/types"
import { ContextMenuBasicExample } from "./context-menu-basic"
import { ContextMenuCheckboxesExample } from "./context-menu-checkboxes"
import { ContextMenuDemoExample } from "./context-menu-demo"
import { ContextMenuDestructiveExample } from "./context-menu-destructive"
import { ContextMenuGroupsExample } from "./context-menu-groups"
import { ContextMenuIconsExample } from "./context-menu-icons"
import { ContextMenuRadioExample } from "./context-menu-radio"
import { ContextMenuRtlExample } from "./context-menu-rtl"
import { ContextMenuShortcutsExample } from "./context-menu-shortcuts"
import { ContextMenuSidesExample } from "./context-menu-sides"
import { ContextMenuSubmenuExample } from "./context-menu-submenu"

export const contextMenuExamples: PreviewExample[] = [
  {
    name: "demo",
    title: "Demo",
    component: ContextMenuDemoExample,
    file: "components/previews/context-menu/context-menu-demo.tsx",
  },
  {
    name: "basic",
    title: "Basic",
    component: ContextMenuBasicExample,
    file: "components/previews/context-menu/context-menu-basic.tsx",
  },
  {
    name: "submenu",
    title: "Submenu",
    component: ContextMenuSubmenuExample,
    file: "components/previews/context-menu/context-menu-submenu.tsx",
  },
  {
    name: "shortcuts",
    title: "Shortcuts",
    component: ContextMenuShortcutsExample,
    file: "components/previews/context-menu/context-menu-shortcuts.tsx",
  },
  {
    name: "groups",
    title: "Groups",
    component: ContextMenuGroupsExample,
    file: "components/previews/context-menu/context-menu-groups.tsx",
  },
  {
    name: "icons",
    title: "Icons",
    component: ContextMenuIconsExample,
    file: "components/previews/context-menu/context-menu-icons.tsx",
  },
  {
    name: "checkboxes",
    title: "Checkboxes",
    component: ContextMenuCheckboxesExample,
    file: "components/previews/context-menu/context-menu-checkboxes.tsx",
  },
  {
    name: "radio",
    title: "Radio",
    component: ContextMenuRadioExample,
    file: "components/previews/context-menu/context-menu-radio.tsx",
  },
  {
    name: "destructive",
    title: "Destructive",
    component: ContextMenuDestructiveExample,
    file: "components/previews/context-menu/context-menu-destructive.tsx",
  },
  {
    name: "sides",
    title: "Sides",
    component: ContextMenuSidesExample,
    file: "components/previews/context-menu/context-menu-sides.tsx",
  },
  {
    name: "rtl",
    title: "RTL",
    component: ContextMenuRtlExample,
    file: "components/previews/context-menu/context-menu-rtl.tsx",
  },
]

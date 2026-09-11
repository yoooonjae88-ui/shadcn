import type * as React from "react"

import { ChatWindowDemo } from "@/components/previews/chat-window-demo"
import { ConversationCardDemo } from "@/components/previews/conversation-card-demo"
import { DataGridDemo } from "@/components/previews/data-grid-demo"
import { MastheadDemo } from "@/components/previews/masthead-demo"
import { MenuDemo } from "@/components/previews/menu-demo"
import { MultiSelectDemo } from "@/components/previews/multi-select-demo"
import { PigeonDemo } from "@/components/previews/pigeon-demo"
import { SearchInputDemo } from "@/components/previews/search-input-demo"
import { SidebarDemo } from "@/components/previews/sidebar-demo"
import { SkeletonDemo } from "@/components/previews/skeleton-demo"
import { SonnerDemo } from "@/components/previews/sonner-demo"
import { SpinnerDemo } from "@/components/previews/spinner-demo"
import { TourDemo } from "@/components/previews/tour-demo"
import { UseDebounceDemo } from "@/components/previews/use-debounce-demo"
import { WidgetBoardDemo } from "@/components/previews/widget-board-demo"

// Maps registry item names (from registry.json) to a live demo component.
// When adding a new registry item, register its preview here so it shows
// up on the /preview page.
export const previews: Record<string, React.ComponentType> = {
  "use-debounce": UseDebounceDemo,
  "data-grid": DataGridDemo,
  masthead: MastheadDemo,
  menu: MenuDemo,
  "multi-select": MultiSelectDemo,
  pigeon: PigeonDemo,
  "search-input": SearchInputDemo,
  sidebar: SidebarDemo,
  skeleton: SkeletonDemo,
  sonner: SonnerDemo,
  spinner: SpinnerDemo,
  tour: TourDemo,
  "chat-window": ChatWindowDemo,
  "conversation-card": ConversationCardDemo,
  "widget-board": WidgetBoardDemo,
}

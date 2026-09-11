import type { PreviewExample } from "@/components/previews/types"
import { EmptyAvatarExample } from "./empty-avatar"
import { EmptyBackgroundExample } from "./empty-background"
import { EmptyDefaultExample } from "./empty-default"
import { EmptyInputExample } from "./empty-input"
import { EmptyNotFoundExample } from "./empty-not-found"
import { EmptyOutlineExample } from "./empty-outline"

export const emptyExamples: PreviewExample[] = [
  {
    name: "default",
    title: "Default",
    component: EmptyDefaultExample,
    file: "components/previews/empty/empty-default.tsx",
  },
  {
    name: "outline",
    title: "Outline",
    component: EmptyOutlineExample,
    file: "components/previews/empty/empty-outline.tsx",
  },
  {
    name: "background",
    title: "Background",
    component: EmptyBackgroundExample,
    file: "components/previews/empty/empty-background.tsx",
  },
  {
    name: "avatar",
    title: "Avatar media",
    component: EmptyAvatarExample,
    file: "components/previews/empty/empty-avatar.tsx",
  },
  {
    name: "input",
    title: "Input action",
    component: EmptyInputExample,
    file: "components/previews/empty/empty-input.tsx",
  },
  {
    name: "not-found",
    title: "Not found",
    component: EmptyNotFoundExample,
    file: "components/previews/empty/empty-not-found.tsx",
  },
]

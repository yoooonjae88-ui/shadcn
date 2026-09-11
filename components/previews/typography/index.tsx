import type { PreviewExample } from "@/components/previews/types"
import { TypographyCopyableExample } from "./typography-copyable"
import { TypographyEditableExample } from "./typography-editable"
import { TypographyEllipsisExample } from "./typography-ellipsis"
import { TypographyLinkExample } from "./typography-link"
import { TypographyTextExample } from "./typography-text"
import { TypographyTitleExample } from "./typography-title"

export const typographyExamples: PreviewExample[] = [
  {
    name: "text",
    title: "Basic text",
    component: TypographyTextExample,
    file: "components/previews/typography/typography-text.tsx",
  },
  {
    name: "title",
    title: "Title",
    component: TypographyTitleExample,
    file: "components/previews/typography/typography-title.tsx",
  },
  {
    name: "link",
    title: "Text and link",
    component: TypographyLinkExample,
    file: "components/previews/typography/typography-link.tsx",
  },
  {
    name: "editable",
    title: "Editable text",
    component: TypographyEditableExample,
    file: "components/previews/typography/typography-editable.tsx",
  },
  {
    name: "copyable",
    title: "Copyable text",
    component: TypographyCopyableExample,
    file: "components/previews/typography/typography-copyable.tsx",
  },
  {
    name: "ellipsis",
    title: "Ellipsis",
    component: TypographyEllipsisExample,
    file: "components/previews/typography/typography-ellipsis.tsx",
  },
]

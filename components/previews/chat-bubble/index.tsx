import type { PreviewExample } from "@/components/previews/types"
import { ChatBubbleDefaultExample } from "./chat-bubble-default"
import { ChatBubbleDeleteExample } from "./chat-bubble-delete"
import { ChatBubbleMenuExample } from "./chat-bubble-menu"
import { ChatBubbleReplyExample } from "./chat-bubble-reply"
import { ChatBubbleSelectionExample } from "./chat-bubble-selection"

export const chatBubbleExamples: PreviewExample[] = [
  {
    name: "default",
    title: "Default",
    component: ChatBubbleDefaultExample,
    file: "components/previews/chat-bubble/chat-bubble-default.tsx",
  },
  {
    name: "menu",
    title: "Actions menu",
    component: ChatBubbleMenuExample,
    file: "components/previews/chat-bubble/chat-bubble-menu.tsx",
  },
  {
    name: "reply",
    title: "Reply with a quote",
    component: ChatBubbleReplyExample,
    file: "components/previews/chat-bubble/chat-bubble-reply.tsx",
  },
  {
    name: "selection",
    title: "Select & forward",
    component: ChatBubbleSelectionExample,
    file: "components/previews/chat-bubble/chat-bubble-selection.tsx",
  },
  {
    name: "delete",
    title: "Delete dialog",
    component: ChatBubbleDeleteExample,
    file: "components/previews/chat-bubble/chat-bubble-delete.tsx",
  },
]

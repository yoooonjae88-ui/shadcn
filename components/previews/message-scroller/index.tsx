import type { PreviewExample } from "@/components/previews/types"
import { MessageScrollerDemoExample } from "./message-scroller-demo"
import { MessageScrollerDirectionsExample } from "./message-scroller-directions"
import { MessageScrollerStateExample } from "./message-scroller-state"
import { MessageScrollerStreamingExample } from "./message-scroller-streaming"

export const messageScrollerExamples: PreviewExample[] = [
  {
    name: "demo",
    title: "Demo",
    component: MessageScrollerDemoExample,
    file: "components/previews/message-scroller/message-scroller-demo.tsx",
  },
  {
    name: "streaming",
    title: "Streaming",
    component: MessageScrollerStreamingExample,
    file: "components/previews/message-scroller/message-scroller-streaming.tsx",
  },
  {
    name: "directions",
    title: "Both directions",
    component: MessageScrollerDirectionsExample,
    file: "components/previews/message-scroller/message-scroller-directions.tsx",
  },
  {
    name: "state",
    title: "Reading scroll state",
    component: MessageScrollerStateExample,
    file: "components/previews/message-scroller/message-scroller-state.tsx",
  },
]

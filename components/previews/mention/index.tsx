import type { PreviewExample } from "@/components/previews/types"
import { MentionAsyncExample } from "./mention-async"
import { MentionControlledExample } from "./mention-controlled"
import { MentionCustomRenderExample } from "./mention-custom-render"
import { MentionMultiTriggerExample } from "./mention-multi-trigger"
import { MentionOutlinedExample } from "./mention-outlined"
import { MentionPlacementExample } from "./mention-placement"
import { MentionReadOnlyExample } from "./mention-read-only"
import { MentionStatusExample } from "./mention-status"

export const mentionExamples: PreviewExample[] = [
  {
    name: "controlled",
    title: "Controlled",
    component: MentionControlledExample,
    file: "components/previews/mention/mention-controlled.tsx",
  },
  {
    name: "multi-trigger",
    title: "Multiple triggers",
    component: MentionMultiTriggerExample,
    file: "components/previews/mention/mention-multi-trigger.tsx",
  },
  {
    name: "async",
    title: "Asynchronous loading",
    component: MentionAsyncExample,
    file: "components/previews/mention/mention-async.tsx",
  },
  {
    name: "placement",
    title: "Popup on top",
    component: MentionPlacementExample,
    file: "components/previews/mention/mention-placement.tsx",
  },
  {
    name: "custom-render",
    title: "Custom option render",
    component: MentionCustomRenderExample,
    file: "components/previews/mention/mention-custom-render.tsx",
  },
  {
    name: "status",
    title: "Status",
    component: MentionStatusExample,
    file: "components/previews/mention/mention-status.tsx",
  },
  {
    name: "outlined",
    title: "Outlined variant",
    component: MentionOutlinedExample,
    file: "components/previews/mention/mention-outlined.tsx",
  },
  {
    name: "read-only",
    title: "Read-only & disabled",
    component: MentionReadOnlyExample,
    file: "components/previews/mention/mention-read-only.tsx",
  },
]

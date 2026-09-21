import type { PreviewExample } from "@/components/previews/types"
import { BorderBeamBasicExample } from "./border-beam-basic"
import { BorderBeamColorsExample } from "./border-beam-colors"
import { BorderBeamControlsExample } from "./border-beam-controls"
import { BorderBeamPairExample } from "./border-beam-pair"
import { BorderBeamReverseExample } from "./border-beam-reverse"
import { BorderBeamSpeedExample } from "./border-beam-speed"

export const borderBeamExamples: PreviewExample[] = [
  {
    name: "basic",
    title: "Basic",
    component: BorderBeamBasicExample,
    file: "components/previews/border-beam/border-beam-basic.tsx",
  },
  {
    name: "speed",
    title: "Size & speed",
    component: BorderBeamSpeedExample,
    file: "components/previews/border-beam/border-beam-speed.tsx",
  },
  {
    name: "pair",
    title: "Two beams",
    component: BorderBeamPairExample,
    file: "components/previews/border-beam/border-beam-pair.tsx",
  },
  {
    name: "colors",
    title: "Colours",
    component: BorderBeamColorsExample,
    file: "components/previews/border-beam/border-beam-colors.tsx",
  },
  {
    name: "reverse",
    title: "Direction & width",
    component: BorderBeamReverseExample,
    file: "components/previews/border-beam/border-beam-reverse.tsx",
  },
  {
    name: "controls",
    title: "On small controls",
    component: BorderBeamControlsExample,
    file: "components/previews/border-beam/border-beam-controls.tsx",
  },
]

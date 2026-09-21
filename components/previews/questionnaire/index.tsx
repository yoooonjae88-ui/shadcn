import type { PreviewExample } from "@/components/previews/types"
import { QuestionnaireCardExample } from "./questionnaire-card"
import { QuestionnaireDemoExample } from "./questionnaire-demo"
import { QuestionnaireFreeformExample } from "./questionnaire-freeform"
import { QuestionnaireMultipleExample } from "./questionnaire-multiple"
import { QuestionnaireShortcutsExample } from "./questionnaire-shortcuts"

export const questionnaireExamples: PreviewExample[] = [
  {
    name: "demo",
    title: "Demo",
    component: QuestionnaireDemoExample,
    file: "components/previews/questionnaire/questionnaire-demo.tsx",
  },
  {
    name: "multiple",
    title: "Multiple selection",
    component: QuestionnaireMultipleExample,
    file: "components/previews/questionnaire/questionnaire-multiple.tsx",
  },
  {
    name: "freeform",
    title: "Freeform answer",
    component: QuestionnaireFreeformExample,
    file: "components/previews/questionnaire/questionnaire-freeform.tsx",
  },
  {
    name: "shortcuts",
    title: "Shortcuts",
    component: QuestionnaireShortcutsExample,
    file: "components/previews/questionnaire/questionnaire-shortcuts.tsx",
  },
  {
    name: "card",
    title: "In a card",
    component: QuestionnaireCardExample,
    file: "components/previews/questionnaire/questionnaire-card.tsx",
  },
]

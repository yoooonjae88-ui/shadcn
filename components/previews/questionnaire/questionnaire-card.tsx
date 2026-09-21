"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/card/card"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/registry/questionnaire/questionnaire"

// Questionnaire owns the steps and answers; the card around it owns the
// framing. Same split works for a dialog or a drawer.
const items = [
  {
    name: "frequency",
    required: true,
    prompt: "How often do you ship?",
    choices: [
      { value: "daily", label: "Every day" },
      { value: "weekly", label: "Every week" },
      { value: "monthly", label: "Every month" },
    ],
  },
  {
    name: "size",
    required: true,
    prompt: "How big is the team?",
    choices: [
      { value: "solo", label: "Just me" },
      { value: "small", label: "2–10 people" },
      { value: "large", label: "More than 10" },
    ],
  },
] as const

export function QuestionnaireCardExample() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Set up your workspace</CardTitle>
        <CardDescription>Two quick questions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Questionnaire items={items}>
          <QuestionnaireProgress />
          {items.map((question) => (
            <QuestionnaireItem
              key={question.name}
              name={question.name}
              required={question.required}
            >
              <QuestionnaireTitle>{question.prompt}</QuestionnaireTitle>
              <QuestionnaireChoices>
                {question.choices.map((choice) => (
                  <QuestionnaireChoice key={choice.value} value={choice.value}>
                    <span className="font-medium">{choice.label}</span>
                  </QuestionnaireChoice>
                ))}
              </QuestionnaireChoices>
              <QuestionnaireError />
            </QuestionnaireItem>
          ))}
          <QuestionnaireActions>
            <QuestionnairePrevious />
            <QuestionnaireNext />
            <QuestionnaireSubmit />
          </QuestionnaireActions>
        </Questionnaire>
      </CardContent>
    </Card>
  )
}

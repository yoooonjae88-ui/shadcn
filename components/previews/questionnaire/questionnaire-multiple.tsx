"use client"

import * as React from "react"

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireItem,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/registry/questionnaire/questionnaire"

// multiple turns the choices into checkboxes: the indicator squares off and
// the answer submits as several values under the same name.
const items = [
  {
    name: "surfaces",
    multiple: true,
    prompt: "Which surfaces should ship first?",
    description: "Pick as many as apply.",
    choices: [
      { value: "web", label: "Web" },
      { value: "desktop", label: "Desktop" },
      { value: "mobile", label: "Mobile" },
    ],
  },
] as const

export function QuestionnaireMultipleExample() {
  const [picked, setPicked] = React.useState<string[] | null>(null)

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Questionnaire
        items={items}
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          setPicked(
            new FormData(event.currentTarget).getAll("surfaces").map(String)
          )
        }}
      >
        {items.map((question) => (
          <QuestionnaireItem
            key={question.name}
            name={question.name}
            multiple={question.multiple}
          >
            <QuestionnaireTitle>{question.prompt}</QuestionnaireTitle>
            <QuestionnaireDescription>
              {question.description}
            </QuestionnaireDescription>
            <QuestionnaireChoices>
              {question.choices.map((choice) => (
                <QuestionnaireChoice key={choice.value} value={choice.value}>
                  <span className="font-medium">{choice.label}</span>
                </QuestionnaireChoice>
              ))}
            </QuestionnaireChoices>
          </QuestionnaireItem>
        ))}
        <QuestionnaireActions>
          <QuestionnaireSubmit />
        </QuestionnaireActions>
      </Questionnaire>
      {picked ? (
        <p className="text-xs text-muted-foreground">
          Picked — {picked.join(", ") || "nothing"}
        </p>
      ) : null}
    </div>
  )
}

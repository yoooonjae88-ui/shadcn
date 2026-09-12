"use client"

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

// `shortcuts` numbers the choices and binds those keys, so the whole flow can
// be answered from the keyboard. The badge only appears once a key is bound.
const items = [
  {
    name: "plan",
    required: true,
    prompt: "Which plan fits best?",
    description: "Press 1, 2 or 3 to answer without reaching for the mouse.",
    choices: [
      { value: "starter", label: "Starter" },
      { value: "team", label: "Team" },
      { value: "enterprise", label: "Enterprise" },
    ],
  },
] as const

export function QuestionnaireShortcutsExample() {
  return (
    <div className="w-full max-w-md">
      <Questionnaire items={items} shortcuts="numbers">
        {items.map((question) => (
          <QuestionnaireItem
            key={question.name}
            name={question.name}
            required={question.required}
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
    </div>
  )
}

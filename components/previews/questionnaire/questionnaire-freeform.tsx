"use client"

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/registry/questionnaire/questionnaire"

// QuestionnaireInput sits among the choices as an "or write your own" answer;
// typing in it clears the selected choice and vice versa.
const items = [
  {
    name: "role",
    required: true,
    prompt: "What best describes your role?",
    description: "Pick the closest match, or write your own.",
    choices: [
      { value: "engineer", label: "Engineer" },
      { value: "designer", label: "Designer" },
      { value: "pm", label: "Product manager" },
    ],
  },
] as const

export function QuestionnaireFreeformExample() {
  return (
    <div className="w-full max-w-md">
      <Questionnaire items={items}>
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
              <QuestionnaireInput
                aria-label="Another role"
                placeholder="Something else…"
              />
            </QuestionnaireChoices>
            <QuestionnaireError />
          </QuestionnaireItem>
        ))}
        <QuestionnaireActions>
          <QuestionnaireSubmit />
        </QuestionnaireActions>
      </Questionnaire>
    </div>
  )
}

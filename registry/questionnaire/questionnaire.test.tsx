import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/registry/questionnaire/questionnaire"

const items = [
  {
    name: "direction",
    required: true,
    prompt: "What should we prototype next?",
    description: "Choose a direction or write your own.",
    choices: [
      { value: "delegation", label: "Delegation", description: "Hand off work." },
      { value: "questions", label: "Question prompts" },
    ],
  },
  {
    name: "detail",
    required: false,
    prompt: "How much detail should it include?",
    choices: [
      { value: "focused", label: "Focused" },
      { value: "complete", label: "Complete flow" },
    ],
  },
] as const

function Flow({
  onSubmit,
  withInput = false,
}: {
  onSubmit?: (data: FormData) => void
  withInput?: boolean
}) {
  return (
    <Questionnaire
      items={items}
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        onSubmit?.(new FormData(event.currentTarget))
      }}
    >
      <QuestionnaireProgress />
      {items.map((question) => (
        <QuestionnaireItem
          key={question.name}
          name={question.name}
          required={question.required}
        >
          <QuestionnaireTitle>{question.prompt}</QuestionnaireTitle>
          {"description" in question ? (
            <QuestionnaireDescription>
              {question.description}
            </QuestionnaireDescription>
          ) : null}
          <QuestionnaireChoices>
            {question.choices.map((choice) => (
              <QuestionnaireChoice key={choice.value} value={choice.value}>
                <span>{choice.label}</span>
                {"description" in choice ? (
                  <QuestionnaireChoiceDescription>
                    {choice.description}
                  </QuestionnaireChoiceDescription>
                ) : null}
              </QuestionnaireChoice>
            ))}
            {withInput && question.name === "direction" ? (
              <QuestionnaireInput
                aria-label="Another answer"
                placeholder="Type another answer…"
              />
            ) : null}
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
      ))}
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  )
}

const slot = (name: string) =>
  document.querySelector(`[data-slot='questionnaire-${name}']`) as HTMLElement

/**
 * Inactive items stay mounted as `<fieldset hidden inert>` — which is what
 * keeps answers and server-rendered markup intact — so "which step am I on"
 * is the `data-active` item, not which text exists.
 */
function activeItem() {
  return document.querySelector(
    "[data-slot='questionnaire-item'][data-active]"
  ) as HTMLElement
}

describe("Questionnaire", () => {
  it("shows the first item with its title, description and choices", () => {
    render(<Flow />)
    expect(
      screen.getByText("What should we prototype next?")
    ).toBeInTheDocument()
    expect(screen.getByText("Delegation")).toBeInTheDocument()
    expect(slot("progress")).toBeInTheDocument()

    // The second item is mounted but hidden and inert, not the active one.
    expect(activeItem()).toHaveTextContent("What should we prototype next?")
    const second = screen
      .getByText("How much detail should it include?")
      .closest("[data-slot='questionnaire-item']")!
    expect(second).not.toBeVisible()
    expect(second).toHaveAttribute("inert")
  })

  it("renders a choice as a real form control the whole row selects", async () => {
    const user = userEvent.setup()
    render(<Flow />)

    const choice = screen.getByText("Delegation").closest(
      "[data-slot='questionnaire-choice']"
    )!
    const input = choice.querySelector(
      "[data-slot='questionnaire-choice-input']"
    ) as HTMLInputElement
    expect(input).toBeInstanceOf(HTMLInputElement)

    await user.click(choice as HTMLElement)
    expect(input.checked).toBe(true)
    await waitFor(() => expect(choice).toHaveAttribute("data-checked"))
  })

  it("advances to the next item and back again", async () => {
    const user = userEvent.setup()
    render(<Flow />)

    await user.click(screen.getByText("Delegation"))
    await user.click(screen.getByRole("button", { name: "Next" }))

    await waitFor(() =>
      expect(activeItem()).toHaveTextContent(
        "How much detail should it include?"
      )
    )

    await user.click(screen.getByRole("button", { name: "Previous" }))
    await waitFor(() =>
      expect(activeItem()).toHaveTextContent("What should we prototype next?")
    )
  })

  it("blocks advancing past a required item and reports the error", async () => {
    const user = userEvent.setup()
    render(<Flow />)

    await user.click(screen.getByRole("button", { name: "Next" }))

    // Still on the first item, with a message in the error slot.
    expect(activeItem()).toHaveTextContent("What should we prototype next?")
    await waitFor(() => expect(slot("error")).toHaveTextContent(/\S/))
  })

  it("submits the collected answers as form data", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Flow onSubmit={onSubmit} />)

    await user.click(screen.getByText("Delegation"))
    await user.click(screen.getByRole("button", { name: "Next" }))
    await waitFor(() =>
      expect(activeItem()).toHaveTextContent(
        "How much detail should it include?"
      )
    )
    await user.click(screen.getByText("Complete flow"))
    await user.click(screen.getByRole("button", { name: "Submit" }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    const data = onSubmit.mock.calls[0][0] as FormData
    expect(data.get("direction")).toBe("delegation")
    expect(data.get("detail")).toBe("complete")
  })

  it("takes a freeform answer from the input", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Flow onSubmit={onSubmit} withInput />)

    await user.type(screen.getByLabelText("Another answer"), "Something else")
    await user.click(screen.getByRole("button", { name: "Next" }))
    await waitFor(() =>
      expect(activeItem()).toHaveTextContent(
        "How much detail should it include?"
      )
    )
    await user.click(screen.getByText("Focused"))
    await user.click(screen.getByRole("button", { name: "Submit" }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    const data = onSubmit.mock.calls[0][0] as FormData
    expect(data.get("direction")).toBe("Something else")
  })

  it("lets an optional item be skipped", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Flow onSubmit={onSubmit} />)

    await user.click(screen.getByText("Question prompts"))
    await user.click(screen.getByRole("button", { name: "Next" }))
    await waitFor(() =>
      expect(activeItem()).toHaveTextContent(
        "How much detail should it include?"
      )
    )

    await user.click(screen.getByRole("button", { name: "Skip" }))
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    expect((onSubmit.mock.calls[0][0] as FormData).get("detail")).toBeFalsy()
  })

  it("keeps the parts addressable by their data-slot", () => {
    render(<Flow withInput />)
    for (const name of [
      "",
      "progress",
      "item",
      "title",
      "description",
      "choices",
      "choice",
      "choice-label",
      "choice-indicator",
      "input",
      "actions",
      "next",
    ]) {
      const selector = name ? `questionnaire-${name}` : "questionnaire"
      expect(
        document.querySelector(`[data-slot='${selector}']`),
        `missing [data-slot='${selector}']`
      ).not.toBeNull()
    }
  })
})

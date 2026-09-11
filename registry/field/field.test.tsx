import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/registry/field/field"

describe("Field", () => {
  it("wires the label to its control", () => {
    render(
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <input id="email" type="email" />
        <FieldDescription>We never share it.</FieldDescription>
      </Field>
    )
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByText("We never share it.")).toBeInTheDocument()
  })

  it("records its orientation", () => {
    render(<Field orientation="horizontal" data-testid="field" />)
    expect(screen.getByTestId("field")).toHaveAttribute(
      "data-orientation",
      "horizontal"
    )
  })

  it("FieldSet renders a fieldset with a legend", () => {
    render(
      <FieldSet>
        <FieldLegend>Notifications</FieldLegend>
        <Field />
      </FieldSet>
    )
    expect(
      screen.getByRole("group", { name: "Notifications" }).tagName
    ).toBe("FIELDSET")
  })

  it("FieldSeparator renders optional centered content", () => {
    const { rerender } = render(<FieldSeparator data-testid="sep" />)
    expect(screen.getByTestId("sep")).not.toHaveAttribute("data-content")

    rerender(<FieldSeparator data-testid="sep">OR</FieldSeparator>)
    expect(screen.getByTestId("sep")).toHaveAttribute("data-content", "true")
    expect(screen.getByText("OR")).toBeInTheDocument()
  })

  it("FieldGroup applies the outline variant", () => {
    render(<FieldGroup data-testid="group" variant="outline" />)
    expect(screen.getByTestId("group")).toHaveAttribute(
      "data-variant",
      "outline"
    )
  })
})

describe("FieldError", () => {
  it("renders nothing without content", () => {
    render(<FieldError data-testid="error" errors={[]} />)
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("renders a single error inline", () => {
    render(<FieldError errors={[{ message: "Required" }]} />)
    const alert = screen.getByRole("alert")
    expect(alert).toHaveTextContent("Required")
    expect(alert.querySelector("ul")).not.toBeInTheDocument()
  })

  it("renders several errors as a list, skipping empty entries", () => {
    render(
      <FieldError
        errors={[
          { message: "Too short" },
          null,
          { message: "Needs a digit" },
          undefined,
        ]}
      />
    )
    const items = screen.getAllByRole("listitem")
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent("Too short")
  })

  it("children take precedence over the errors array", () => {
    render(
      <FieldError errors={[{ message: "From array" }]}>
        Custom message
      </FieldError>
    )
    expect(screen.getByRole("alert")).toHaveTextContent("Custom message")
    expect(screen.queryByText("From array")).not.toBeInTheDocument()
  })
})

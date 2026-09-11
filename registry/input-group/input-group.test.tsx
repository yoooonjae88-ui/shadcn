import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/registry/input-group/input-group"

describe("InputGroup", () => {
  it("composes an input with addons on both edges", () => {
    render(
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput aria-label="Site" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    )
    expect(screen.getByText("https://")).toBeInTheDocument()
    expect(screen.getByText(".com")).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Site" })).toBeInTheDocument()

    const addons = document.querySelectorAll("[data-slot='input-group-addon']")
    expect(addons[0]).toHaveAttribute("data-align", "inline-start")
    expect(addons[1]).toHaveAttribute("data-align", "inline-end")
  })

  it("clicking addon padding focuses the control", async () => {
    const user = userEvent.setup()
    render(
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>@</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput aria-label="Handle" />
      </InputGroup>
    )

    await user.click(screen.getByText("@"))
    expect(screen.getByRole("textbox", { name: "Handle" })).toHaveFocus()
  })

  it("buttons inside an addon keep their own clicks and do not steal focus", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <InputGroup>
        <InputGroupInput aria-label="Query" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton onClick={onClick}>Go</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    )

    await user.click(screen.getByRole("button", { name: "Go" }))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.getByRole("textbox", { name: "Query" })).not.toHaveFocus()
  })

  it("supports a textarea with block-aligned toolbar addons", () => {
    render(
      <InputGroup>
        <InputGroupTextarea aria-label="Message" />
        <InputGroupAddon align="block-end">
          <InputGroupText>0 / 200</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    )
    expect(screen.getByRole("textbox", { name: "Message" }).tagName).toBe(
      "TEXTAREA"
    )
    expect(
      document.querySelector("[data-align='block-end']")
    ).toBeInTheDocument()
  })
})

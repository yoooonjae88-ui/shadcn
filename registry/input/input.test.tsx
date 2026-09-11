import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  Input,
  InputOTP,
  InputPassword,
  InputSearch,
} from "@/registry/input/input"

describe("Input", () => {
  it("renders a text input and accepts typing", async () => {
    const user = userEvent.setup()
    render(<Input aria-label="Name" />)
    const input = screen.getByRole("textbox", { name: "Name" })

    await user.type(input, "Ada")
    expect(input).toHaveValue("Ada")
  })

  it("fires onPressEnter", async () => {
    const user = userEvent.setup()
    const onPressEnter = vi.fn()
    render(<Input aria-label="Name" onPressEnter={onPressEnter} />)

    await user.type(screen.getByRole("textbox"), "x{Enter}")
    expect(onPressEnter).toHaveBeenCalledTimes(1)
  })

  it("renders prefix, suffix and addons", () => {
    render(
      <Input
        aria-label="Site"
        prefix={<span data-testid="prefix">P</span>}
        suffix={<span data-testid="suffix">S</span>}
        addonBefore="https://"
        addonAfter=".com"
      />
    )
    expect(screen.getByTestId("prefix")).toBeInTheDocument()
    expect(screen.getByTestId("suffix")).toBeInTheDocument()
    expect(screen.getByText("https://")).toBeInTheDocument()
    expect(screen.getByText(".com")).toBeInTheDocument()
  })

  it("clears the value via allowClear and fires onClear", async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    render(<Input aria-label="Name" allowClear defaultValue="abc" onClear={onClear} />)

    const clear = document.querySelector(
      "[data-slot='input-clear']"
    ) as HTMLElement
    expect(clear).toBeInTheDocument()

    await user.click(clear)
    expect(onClear).toHaveBeenCalledTimes(1)
    expect(screen.getByRole("textbox")).toHaveValue("")
  })

  it("shows a character count with showCount + maxLength", async () => {
    const user = userEvent.setup()
    render(<Input aria-label="Bio" showCount maxLength={10} />)

    await user.type(screen.getByRole("textbox"), "hello")
    expect(
      document.querySelector("[data-slot='input-count']")
    ).toHaveTextContent("5 / 10")
  })

  it("applies variant and status attributes", () => {
    render(<Input aria-label="Name" variant="outlined" status="error" />)
    const frame = document.querySelector("[data-slot='input']")
    expect(frame).toHaveAttribute("data-variant", "outlined")
    expect(frame).toHaveAttribute("data-status", "error")
  })

  it("exposes the compound namespace", () => {
    expect(Input.Search).toBe(InputSearch)
    expect(Input.Password).toBe(InputPassword)
    expect(Input.OTP).toBe(InputOTP)
  })
})

describe("InputSearch", () => {
  it("searches from the button and on Enter", async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<InputSearch aria-label="Search" onSearch={onSearch} />)

    await user.type(screen.getByRole("textbox"), "cats")
    await user.click(screen.getByRole("button", { name: "Search" }))
    expect(onSearch).toHaveBeenLastCalledWith("cats", expect.anything(), {
      source: "input",
    })

    await user.type(screen.getByRole("textbox"), "!{Enter}")
    expect(onSearch).toHaveBeenLastCalledWith("cats!", expect.anything(), {
      source: "input",
    })
  })

  it("does not search while loading", async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<InputSearch aria-label="Search" loading onSearch={onSearch} />)

    expect(screen.getByRole("button", { name: "Search" })).toBeDisabled()
    await user.click(screen.getByRole("button", { name: "Search" }))
    expect(onSearch).not.toHaveBeenCalled()
  })
})

describe("InputPassword", () => {
  it("toggles visibility", async () => {
    const user = userEvent.setup()
    render(<InputPassword aria-label="Password" defaultValue="secret" />)

    const field = document.querySelector(
      "[data-slot='input-field']"
    ) as HTMLInputElement
    expect(field).toHaveAttribute("type", "password")

    await user.click(screen.getByRole("button", { name: "Show password" }))
    expect(field).toHaveAttribute("type", "text")

    await user.click(screen.getByRole("button", { name: "Hide password" }))
    expect(field).toHaveAttribute("type", "password")
  })

  it("hides the toggle with visibilityToggle=false", () => {
    render(<InputPassword aria-label="Password" visibilityToggle={false} />)
    expect(
      document.querySelector("[data-slot='input-password-toggle']")
    ).not.toBeInTheDocument()
  })
})

describe("InputOTP", () => {
  it("renders the requested number of cells", () => {
    render(<InputOTP length={4} />)
    expect(
      document.querySelectorAll("[data-slot='input-otp-cell']")
    ).toHaveLength(4)
  })

  it("fills forward while typing and fires onChange when complete", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<InputOTP length={4} onChange={onChange} />)

    await user.type(
      screen.getByRole("textbox", { name: "Character 1 of 4" }),
      "1234"
    )
    expect(onChange).toHaveBeenCalledWith("1234")
  })

  it("does not fire onChange until every cell is filled", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<InputOTP length={4} onChange={onChange} />)

    await user.type(
      screen.getByRole("textbox", { name: "Character 1 of 4" }),
      "12"
    )
    expect(onChange).not.toHaveBeenCalled()
  })

  it("masks the typed characters", async () => {
    const user = userEvent.setup()
    render(<InputOTP length={4} mask />)

    const first = screen.getByRole("textbox", { name: "Character 1 of 4" })
    await user.type(first, "7")
    expect(first).toHaveValue("•")
  })

  it("exposes the joined value on a hidden input for forms", async () => {
    const user = userEvent.setup()
    render(<InputOTP length={4} name="otp" />)

    await user.type(
      screen.getByRole("textbox", { name: "Character 1 of 4" }),
      "9876"
    )
    expect(
      document.querySelector("input[type='hidden'][name='otp']")
    ).toHaveValue("9876")
  })
})

import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  Dropdown,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownLabel,
  DropdownTrigger,
  DropdownValue,
} from "@/registry/dropdown/dropdown"

const fruitItems = {
  apple: "Apple",
  banana: "Banana",
  cherry: "Cherry",
}

function renderDropdown(
  onValueChange: (value: string | null) => void = () => {}
) {
  return render(
    <Dropdown name="fruit" items={fruitItems} onValueChange={onValueChange}>
      <DropdownTrigger>
        <DropdownValue placeholder="Pick a fruit" />
      </DropdownTrigger>
      <DropdownContent>
        <DropdownGroup>
          <DropdownLabel>Fruits</DropdownLabel>
          <DropdownItem value="apple">Apple</DropdownItem>
          <DropdownItem value="banana">Banana</DropdownItem>
          <DropdownItem value="cherry" disabled>
            Cherry
          </DropdownItem>
        </DropdownGroup>
      </DropdownContent>
    </Dropdown>
  )
}

describe("Dropdown", () => {
  it("renders a closed combobox showing the placeholder", () => {
    renderDropdown()
    const trigger = screen.getByRole("combobox")
    expect(trigger).toHaveTextContent("Pick a fruit")
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
  })

  it("opens the listbox on trigger click and lists all options", async () => {
    const user = userEvent.setup()
    renderDropdown()

    await user.click(screen.getByRole("combobox"))

    expect(await screen.findByRole("listbox")).toBeInTheDocument()
    const options = screen.getAllByRole("option")
    expect(options.map((option) => option.textContent)).toEqual([
      "Apple",
      "Banana",
      "Cherry",
    ])
    expect(screen.getByText("Fruits")).toBeInTheDocument()
  })

  it("selects an option, reports the value and shows it in the trigger", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    renderDropdown(onValueChange)

    await user.click(screen.getByRole("combobox"))
    await user.click(await screen.findByRole("option", { name: "Banana" }))

    expect(onValueChange).toHaveBeenCalledWith("banana", expect.anything())
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
    })
    expect(screen.getByRole("combobox")).toHaveTextContent("Banana")
  })

  it("submits the selected value with the surrounding form", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const data = new FormData(event.currentTarget)
      return data.get("fruit")
    })
    render(
      <form onSubmit={onSubmit}>
        <Dropdown name="fruit" defaultValue="apple">
          <DropdownTrigger>
            <DropdownValue placeholder="Pick a fruit" />
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem value="apple">Apple</DropdownItem>
            <DropdownItem value="banana">Banana</DropdownItem>
          </DropdownContent>
        </Dropdown>
        <button type="submit">Submit</button>
      </form>
    )

    await user.click(screen.getByRole("button", { name: "Submit" }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveReturnedWith("apple")
  })

  it("closes the listbox with the escape key", async () => {
    const user = userEvent.setup()
    renderDropdown()

    await user.click(screen.getByRole("combobox"))
    expect(await screen.findByRole("listbox")).toBeInTheDocument()

    await user.keyboard("{Escape}")
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
    })
  })
})

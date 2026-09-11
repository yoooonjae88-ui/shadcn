import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/registry/combobox/combobox"

const items = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
]

function renderCombobox(
  rootProps: Partial<React.ComponentProps<typeof Combobox>> = {}
) {
  return render(
    <Combobox items={items} {...rootProps}>
      <ComboboxTrigger>
        <ComboboxValue placeholder="Select a framework…" />
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxInput placeholder="Search…" />
        <ComboboxEmpty>No results found.</ComboboxEmpty>
        <ComboboxList>
          {(item: (typeof items)[number]) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

describe("Combobox", () => {
  it("shows the placeholder until something is selected", () => {
    renderCombobox()
    expect(screen.getByText("Select a framework…")).toBeInTheDocument()
  })

  it("opens on trigger click and lists the options", async () => {
    const user = userEvent.setup()
    renderCombobox()

    await user.click(screen.getByText("Select a framework…"))
    expect(await screen.findByText("React")).toBeInTheDocument()
    expect(screen.getByText("Vue")).toBeInTheDocument()
    expect(screen.getByText("Svelte")).toBeInTheDocument()
  })

  it("selects an option and shows its label in the trigger", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    renderCombobox({ onValueChange })

    await user.click(screen.getByText("Select a framework…"))
    await user.click(await screen.findByText("Vue"))

    await waitFor(() =>
      expect(onValueChange).toHaveBeenCalledWith(items[1], expect.anything())
    )
    expect(screen.getByText("Vue")).toBeInTheDocument()
    expect(screen.queryByText("Select a framework…")).not.toBeInTheDocument()
  })

  it("filters options while typing and shows the empty state", async () => {
    const user = userEvent.setup()
    renderCombobox()

    await user.click(screen.getByText("Select a framework…"))
    const input = await screen.findByPlaceholderText("Search…")

    await user.type(input, "vu")
    await waitFor(() => {
      expect(screen.getByText("Vue")).toBeInTheDocument()
      expect(screen.queryByText("React")).not.toBeInTheDocument()
    })

    await user.clear(input)
    await user.type(input, "zzz")
    expect(await screen.findByText("No results found.")).toBeInTheDocument()
  })
})

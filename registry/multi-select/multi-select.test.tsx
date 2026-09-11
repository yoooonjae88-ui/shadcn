import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { MultiSelect } from "@/registry/multi-select/multi-select"

const options = [
  { value: "u1", label: "Ada", domain: "acme.com" },
  { value: "u2", label: "Bob", domain: "acme.com" },
]

function makeSearch() {
  return vi.fn(async (query: string) =>
    options.filter((o) =>
      o.label.toLowerCase().includes(query.toLowerCase())
    )
  )
}

describe("MultiSelect", () => {
  it("shows the search prompt before typing", async () => {
    const user = userEvent.setup()
    render(<MultiSelect onSearch={makeSearch()} searchDelay={0} />)

    await user.click(screen.getByPlaceholderText("Search…"))
    expect(await screen.findByText("Type to search…")).toBeInTheDocument()
  })

  it("searches (debounced) and lists the results", async () => {
    const user = userEvent.setup()
    const onSearch = makeSearch()
    render(<MultiSelect onSearch={onSearch} searchDelay={0} />)

    await user.type(screen.getByPlaceholderText("Search…"), "ad")
    await waitFor(() => expect(onSearch).toHaveBeenCalled())
    expect(await screen.findByText("Ada")).toBeInTheDocument()
    expect(screen.queryByText("Bob")).not.toBeInTheDocument()
  })

  it("selects results as chips and reports the selection", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <MultiSelect
        onSearch={makeSearch()}
        searchDelay={0}
        onValueChange={onValueChange}
      />
    )

    await user.type(screen.getByPlaceholderText("Search…"), "a")
    await user.click(await screen.findByText("Ada"))

    await waitFor(() => expect(onValueChange).toHaveBeenCalled())
    expect(onValueChange.mock.lastCall?.[0]).toEqual([options[0]])
    // Chip appears in the field.
    expect(screen.getByLabelText("Ada")).toBeInTheDocument()
  })

  it("removes a chip via its remove button", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <MultiSelect
        onSearch={makeSearch()}
        searchDelay={0}
        defaultValue={[options[0]]}
        onValueChange={onValueChange}
      />
    )

    await user.click(screen.getByLabelText("Remove Ada"))
    await waitFor(() =>
      expect(screen.queryByLabelText("Ada")).not.toBeInTheDocument()
    )
    expect(onValueChange.mock.lastCall?.[0]).toEqual([])
  })

  it("shows the error message when the search rejects", async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn().mockRejectedValue(new Error("boom"))
    render(
      <MultiSelect
        onSearch={onSearch}
        searchDelay={0}
        errorMessage="Search failed"
      />
    )

    await user.type(screen.getByPlaceholderText("Search…"), "x")
    expect(await screen.findByText("Search failed")).toBeInTheDocument()
  })

  it("submits selected values via hidden inputs when named", () => {
    render(
      <MultiSelect
        onSearch={makeSearch()}
        name="members"
        defaultValue={[options[0], options[1]]}
      />
    )
    const hidden = document.querySelectorAll("input[type='hidden'][name='members']")
    expect(Array.from(hidden).map((el) => (el as HTMLInputElement).value)).toEqual(
      ["u1", "u2"]
    )
  })
})

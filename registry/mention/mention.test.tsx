import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Mention, getMentions } from "@/registry/mention/mention"

const options = [
  { value: "ada", label: "Ada Lovelace" },
  { value: "alan", label: "Alan Turing" },
  { value: "grace", label: "Grace Hopper" },
]

describe("Mention", () => {
  it("renders a textarea and reports edits", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Mention aria-label="Comment" options={options} onChange={onChange} />)

    await user.type(screen.getByRole("textbox"), "Hello")
    expect(onChange).toHaveBeenLastCalledWith("Hello")
  })

  it("opens the suggestion popup after the prefix and filters options", async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<Mention aria-label="Comment" options={options} onSearch={onSearch} />)

    await user.type(screen.getByRole("textbox"), "@al")
    const listbox = await screen.findByRole("listbox")
    expect(onSearch).toHaveBeenLastCalledWith("al", "@")

    await waitFor(() => {
      expect(screen.getByText("Alan Turing")).toBeInTheDocument()
      expect(screen.queryByText("Ada Lovelace")).not.toBeInTheDocument()
      expect(screen.queryByText("Grace Hopper")).not.toBeInTheDocument()
    })
    expect(listbox).toBeInTheDocument()
  })

  it("inserts the selected mention into the text", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const onSelect = vi.fn()
    render(
      <Mention
        aria-label="Comment"
        options={options}
        onChange={onChange}
        onSelect={onSelect}
      />
    )

    await user.type(screen.getByRole("textbox"), "Hi @ad")
    await user.click(await screen.findByText("Ada Lovelace"))

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ value: "ada" }),
      "@"
    )
    expect(onChange).toHaveBeenLastCalledWith("Hi @ada ")
  })

  it("supports multiple prefixes", async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(
      <Mention
        aria-label="Comment"
        options={options}
        prefix={["@", "#"]}
        onSearch={onSearch}
      />
    )

    await user.type(screen.getByRole("textbox"), "#gr")
    await screen.findByRole("listbox")
    expect(onSearch).toHaveBeenLastCalledWith("gr", "#")
  })

  it("shows the not-found content when nothing matches", async () => {
    const user = userEvent.setup()
    render(
      <Mention
        aria-label="Comment"
        options={options}
        notFoundContent="No people"
      />
    )

    await user.type(screen.getByRole("textbox"), "@zzz")
    expect(await screen.findByText("No people")).toBeInTheDocument()
  })
})

describe("getMentions", () => {
  it("extracts mentioned values", () => {
    expect(getMentions("hi @ada and @alan")).toEqual([
      { prefix: "@", value: "ada" },
      { prefix: "@", value: "alan" },
    ])
  })

  it("supports custom prefixes and split", () => {
    expect(
      getMentions("#a,#b", { prefix: ["#"], split: "," })
    ).toEqual([
      { prefix: "#", value: "a" },
      { prefix: "#", value: "b" },
    ])
  })

  it("is exposed as Mention.getMentions", () => {
    expect(Mention.getMentions).toBe(getMentions)
  })
})

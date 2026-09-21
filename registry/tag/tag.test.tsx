import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Tag, TagGroup, TagInput } from "@/registry/tag/tag"

describe("Tag", () => {
  it("renders a static span when not interactive", () => {
    render(<Tag>Design</Tag>)
    const tag = screen.getByText("Design")
    expect(tag.tagName).toBe("SPAN")
    expect(tag).toHaveAttribute("data-slot", "tag")
  })

  it("becomes a button when given onClick", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Tag onClick={onClick}>Design</Tag>)

    const tag = screen.getByRole("button", { name: "Design" })
    await user.click(tag)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("shows the processing dot for the processing status", () => {
    render(<Tag status="processing">Deploying</Tag>)
    expect(
      document.querySelector("[data-slot='tag-processing-dot']")
    ).toBeInTheDocument()
  })

  it("a custom icon suppresses the processing dot", () => {
    render(
      <Tag status="processing" icon={<svg data-testid="icon" />}>
        Deploying
      </Tag>
    )
    expect(screen.getByTestId("icon")).toBeInTheDocument()
    expect(
      document.querySelector("[data-slot='tag-processing-dot']")
    ).not.toBeInTheDocument()
  })

  it("does not fire clicks while disabled", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Tag disabled onClick={onClick}>
        Design
      </Tag>
    )
    await user.click(screen.getByRole("button", { name: "Design" }))
    expect(onClick).not.toHaveBeenCalled()
  })
})

describe("TagGroup", () => {
  function renderGroup(props: React.ComponentProps<typeof TagGroup> = {}) {
    return render(
      <TagGroup {...props}>
        <Tag value="a">Alpha</Tag>
        <Tag value="b">Beta</Tag>
        <Tag value="c">Gamma</Tag>
      </TagGroup>
    )
  }

  it("makes tags with values selectable buttons", () => {
    renderGroup()
    expect(screen.getAllByRole("button")).toHaveLength(3)
    expect(screen.getByRole("button", { name: "Alpha" })).toHaveAttribute(
      "aria-pressed",
      "false"
    )
  })

  it("selects a single tag at a time by default", async () => {
    const user = userEvent.setup()
    renderGroup()

    await user.click(screen.getByRole("button", { name: "Alpha" }))
    expect(screen.getByRole("button", { name: "Alpha" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )

    await user.click(screen.getByRole("button", { name: "Beta" }))
    expect(screen.getByRole("button", { name: "Alpha" })).toHaveAttribute(
      "aria-pressed",
      "false"
    )
    expect(screen.getByRole("button", { name: "Beta" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
  })

  it("clicking a selected tag deselects it", async () => {
    const user = userEvent.setup()
    renderGroup({ defaultValue: ["a"] })

    await user.click(screen.getByRole("button", { name: "Alpha" }))
    expect(screen.getByRole("button", { name: "Alpha" })).toHaveAttribute(
      "aria-pressed",
      "false"
    )
  })

  it("allows several selections with multiple", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    renderGroup({ multiple: true, onValueChange })

    await user.click(screen.getByRole("button", { name: "Alpha" }))
    await user.click(screen.getByRole("button", { name: "Gamma" }))
    expect(onValueChange).toHaveBeenLastCalledWith(["a", "c"])
    expect(screen.getByRole("button", { name: "Alpha" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
    expect(screen.getByRole("button", { name: "Gamma" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
  })

  it("supports controlled selection", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    renderGroup({ value: ["b"], onValueChange })

    expect(screen.getByRole("button", { name: "Beta" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
    await user.click(screen.getByRole("button", { name: "Alpha" }))
    // Controlled: state doesn't move without the parent updating `value`.
    expect(screen.getByRole("button", { name: "Alpha" })).toHaveAttribute(
      "aria-pressed",
      "false"
    )
    expect(onValueChange).toHaveBeenCalledWith(["a"])
  })

  it("disables every tag in a disabled group", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    renderGroup({ disabled: true, onValueChange })

    await user.click(screen.getByRole("button", { name: "Alpha" }))
    expect(onValueChange).not.toHaveBeenCalled()
  })
})

describe("Tag closable", () => {
  it("shows no close button unless asked", () => {
    render(<Tag>Design</Tag>)
    expect(screen.queryByRole("button", { name: "Remove" })).not.toBeInTheDocument()
  })

  it("reports a close without removing itself", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Tag closable onClose={onClose}>
        Design
      </Tag>
    )

    await user.click(screen.getByRole("button", { name: "Remove" }))
    expect(onClose).toHaveBeenCalledTimes(1)
    // Whoever owns the list decides; the tag stays put on its own.
    expect(screen.getByText("Design")).toBeInTheDocument()
  })

  it("takes a close label of its own", () => {
    render(
      <Tag closable closeLabel="Remove Design">
        Design
      </Tag>
    )
    expect(screen.getByRole("button", { name: "Remove Design" })).toBeInTheDocument()
  })

  it("keeps the close button out of a selectable tag's button", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onValueChange = vi.fn()
    render(
      <TagGroup onValueChange={onValueChange}>
        <Tag value="a" closable onClose={onClose}>
          Alpha
        </Tag>
      </TagGroup>
    )

    // Nested buttons are invalid HTML, so the chip is a span holding two.
    const close = screen.getByRole("button", { name: "Remove" })
    expect(close.closest("button")).toBe(close)

    // Closing must not toggle the selection on its way out.
    await user.click(close)
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onValueChange).not.toHaveBeenCalled()

    await user.click(screen.getByRole("button", { name: "Alpha" }))
    expect(onValueChange).toHaveBeenCalledWith(["a"])
  })
})

describe("TagInput", () => {
  const field = () => screen.getByPlaceholderText("Tag name")
  const addControl = () => screen.getByRole("button", { name: /New Tag/ })

  it("adds a tag on Enter and keeps the field open", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<TagInput defaultValue={["Design"]} onValueChange={onValueChange} />)

    await user.click(addControl())
    await user.type(field(), "Research{Enter}")

    expect(onValueChange).toHaveBeenCalledWith(["Design", "Research"])
    expect(screen.getByText("Research")).toBeInTheDocument()
    // Still open, so several can be typed in a row.
    expect(field()).toHaveValue("")
    await user.type(field(), "Copy{Enter}")
    expect(onValueChange).toHaveBeenLastCalledWith(["Design", "Research", "Copy"])
  })

  it("focuses the field the moment it opens", async () => {
    const user = userEvent.setup()
    render(<TagInput />)

    await user.click(addControl())
    // Focused as the field mounts, not a frame later: anything typed straight
    // after the click has to land in it.
    expect(field()).toHaveFocus()
  })

  it("ignores blank entries and trims what it keeps", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<TagInput onValueChange={onValueChange} />)

    await user.click(addControl())
    await user.type(field(), "   {Enter}")
    expect(onValueChange).not.toHaveBeenCalled()

    await user.type(field(), "  Design  {Enter}")
    expect(onValueChange).toHaveBeenCalledWith(["Design"])
  })

  it("drops a repeat unless duplicates are allowed", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    const { unmount } = render(
      <TagInput defaultValue={["Design"]} onValueChange={onValueChange} />
    )

    await user.click(addControl())
    await user.type(field(), "Design{Enter}")
    expect(onValueChange).not.toHaveBeenCalled()
    unmount()

    const onAllow = vi.fn()
    render(
      <TagInput defaultValue={["Design"]} allowDuplicates onValueChange={onAllow} />
    )
    await user.click(addControl())
    await user.type(field(), "Design{Enter}")
    expect(onAllow).toHaveBeenCalledWith(["Design", "Design"])
  })

  it("removes a tag through its close button", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <TagInput defaultValue={["Design", "Research"]} onValueChange={onValueChange} />
    )

    await user.click(screen.getByRole("button", { name: "Remove Design" }))
    expect(onValueChange).toHaveBeenCalledWith(["Research"])
    expect(screen.queryByText("Design")).not.toBeInTheDocument()
  })

  it("takes the last tag back on Backspace in an empty field", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <TagInput defaultValue={["Design", "Research"]} onValueChange={onValueChange} />
    )

    await user.click(addControl())
    await user.type(field(), "{Backspace}")
    expect(onValueChange).toHaveBeenCalledWith(["Design"])

    // With something typed, Backspace edits the draft instead.
    onValueChange.mockClear()
    await user.type(field(), "ab{Backspace}")
    expect(onValueChange).not.toHaveBeenCalled()
    expect(field()).toHaveValue("a")
  })

  it("closes the field on Escape without adding", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<TagInput onValueChange={onValueChange} />)

    await user.click(addControl())
    await user.type(field(), "Design{Escape}")

    expect(onValueChange).not.toHaveBeenCalled()
    expect(screen.queryByPlaceholderText("Tag name")).not.toBeInTheDocument()
    expect(addControl()).toBeInTheDocument()
  })

  it("commits what is typed when the field loses focus", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<TagInput onValueChange={onValueChange} />)

    await user.click(addControl())
    await user.type(field(), "Design")
    await user.tab()

    expect(onValueChange).toHaveBeenCalledWith(["Design"])
    expect(screen.queryByPlaceholderText("Tag name")).not.toBeInTheDocument()
  })

  it("hides the add control once the list is full", async () => {
    const user = userEvent.setup()
    render(<TagInput defaultValue={["Design"]} max={2} />)

    await user.click(addControl())
    await user.type(field(), "Research{Enter}")
    expect(screen.queryByRole("button", { name: /New Tag/ })).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Remove Design" }))
    expect(screen.getByRole("button", { name: /New Tag/ })).toBeInTheDocument()
  })

  it("leaves a controlled list to its owner", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<TagInput value={["Design"]} onValueChange={onValueChange} />)

    await user.click(screen.getByRole("button", { name: "Remove Design" }))
    expect(onValueChange).toHaveBeenCalledWith([])
    expect(screen.getByText("Design")).toBeInTheDocument()
  })
})

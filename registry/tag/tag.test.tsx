import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Tag, TagGroup } from "@/registry/tag/tag"

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

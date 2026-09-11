import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  Tree,
  collectSubtreeIds,
  moveTreeNode,
  type TreeNode,
} from "@/registry/tree/tree"

const data: TreeNode[] = [
  {
    id: "src",
    name: "src",
    children: [
      { id: "index", name: "index.ts" },
      { id: "utils", name: "utils.ts" },
    ],
  },
  { id: "readme", name: "README.md" },
]

describe("Tree", () => {
  it("renders a tree with collapsed branches", () => {
    render(<Tree data={data} />)
    expect(screen.getByRole("tree")).toBeInTheDocument()
    expect(screen.getByRole("treeitem", { name: /src/ })).toHaveAttribute(
      "aria-expanded",
      "false"
    )
    expect(screen.queryByText("index.ts")).not.toBeInTheDocument()
  })

  it("expands a branch on click and shows its children", async () => {
    const user = userEvent.setup()
    const onExpandedChange = vi.fn()
    render(<Tree data={data} onExpandedChange={onExpandedChange} />)

    await user.click(screen.getByText("src"))
    expect(onExpandedChange).toHaveBeenCalledWith(["src"])
    expect(screen.getByText("index.ts")).toBeInTheDocument()
    expect(screen.getByRole("treeitem", { name: /src/ })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
  })

  it("respects defaultExpandedIds", () => {
    render(<Tree data={data} defaultExpandedIds={["src"]} />)
    expect(screen.getByText("utils.ts")).toBeInTheDocument()
  })

  it("selects a leaf in single mode", async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    render(<Tree data={data} onSelectedChange={onSelectedChange} />)

    await user.click(screen.getByText("README.md"))
    expect(onSelectedChange).toHaveBeenCalledWith(["readme"])
    expect(
      screen.getByRole("treeitem", { name: /README/ })
    ).toHaveAttribute("aria-selected", "true")
  })

  it("renders checkboxes in checkbox mode and checks whole subtrees", async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    render(
      <Tree
        data={data}
        selectionMode="checkbox"
        defaultExpandedIds={["src"]}
        onSelectedChange={onSelectedChange}
      />
    )

    const checkboxes = screen.getAllByRole("checkbox")
    expect(checkboxes.length).toBeGreaterThanOrEqual(3)

    await user.click(checkboxes[0]) // the "src" branch
    const ids = onSelectedChange.mock.lastCall?.[0] as string[]
    expect(ids).toEqual(expect.arrayContaining(["src", "index", "utils"]))
  })

  it("skips disabled nodes for interaction", async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    render(
      <Tree
        data={[{ id: "locked", name: "locked.txt", disabled: true }]}
        onSelectedChange={onSelectedChange}
      />
    )

    await user.click(screen.getByText("locked.txt"))
    expect(onSelectedChange).not.toHaveBeenCalled()
  })

  it("lazily loads children via onLoadChildren", async () => {
    const user = userEvent.setup()
    const onLoadChildren = vi
      .fn()
      .mockResolvedValue([{ id: "lazy-child", name: "lazy-child.ts" }])
    render(
      <Tree
        data={[{ id: "lazy", name: "lazy", isBranch: true }]}
        onLoadChildren={onLoadChildren}
      />
    )

    await user.click(screen.getByText("lazy"))
    expect(onLoadChildren).toHaveBeenCalledTimes(1)
    expect(await screen.findByText("lazy-child.ts")).toBeInTheDocument()
  })
})

describe("tree utilities", () => {
  it("collectSubtreeIds gathers a node and its descendants", () => {
    expect(collectSubtreeIds(data[0])).toEqual(["src", "index", "utils"])
  })

  it("moveTreeNode moves a node inside another", () => {
    const next = moveTreeNode(data, "readme", "src", "inside")
    const src = next.find((n) => n.id === "src")
    expect(src?.children?.map((c) => c.id)).toContain("readme")
    expect(next.some((n) => n.id === "readme")).toBe(false)
  })

  it("moveTreeNode reorders siblings before/after", () => {
    const next = moveTreeNode(data, "readme", "src", "before")
    expect(next.map((n) => n.id)).toEqual(["readme", "src"])
  })
})

import * as React from "react"
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/registry/context-menu/context-menu"

function Basic({ onSelect }: { onSelect?: () => void } = {}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>Right click here</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem onClick={onSelect}>
            Back
            <ContextMenuShortcut>⌘[</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem disabled>Forward</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  )
}

/** Right click the trigger and wait for the popup. */
async function openMenu(name = "Right click here") {
  fireEvent.contextMenu(screen.getByText(name))
  return await screen.findByRole("menu")
}

describe("ContextMenu", () => {
  it("stays closed until a right click", async () => {
    render(<Basic />)
    expect(screen.queryByRole("menu")).not.toBeInTheDocument()

    // A plain left click must not open it.
    await userEvent.setup().click(screen.getByText("Right click here"))
    expect(screen.queryByRole("menu")).not.toBeInTheDocument()

    await openMenu()
    expect(screen.getByRole("menuitem", { name: /Back/ })).toBeInTheDocument()
  })

  it("runs an item and closes", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<Basic onSelect={onSelect} />)

    const menu = await openMenu()
    await user.click(within(menu).getByRole("menuitem", { name: /Back/ }))

    expect(onSelect).toHaveBeenCalledTimes(1)
    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument()
    )
  })

  it("does not run a disabled item", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <ContextMenu>
        <ContextMenuTrigger>Right click here</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem disabled onClick={onSelect}>
            Forward
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    const menu = await openMenu()
    const item = within(menu).getByRole("menuitem", { name: "Forward" })
    expect(item).toHaveAttribute("data-disabled")
    await user.click(item)
    expect(onSelect).not.toHaveBeenCalled()
  })

  it("marks the destructive variant and renders a shortcut", async () => {
    render(<Basic />)
    const menu = await openMenu()

    expect(
      within(menu).getByRole("menuitem", { name: "Delete" })
    ).toHaveAttribute("data-variant", "destructive")
    expect(within(menu).getByText("⌘[")).toHaveAttribute(
      "data-slot",
      "context-menu-shortcut"
    )
    expect(
      within(menu).getByRole("separator", { hidden: true })
    ).toBeInTheDocument()
  })

  it("toggles a checkbox item", async () => {
    const user = userEvent.setup()

    function Checkboxes() {
      const [checked, setChecked] = React.useState(false)
      return (
        <ContextMenu>
          <ContextMenuTrigger>Right click here</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuCheckboxItem
              checked={checked}
              onCheckedChange={setChecked}
            >
              Show Bookmarks
            </ContextMenuCheckboxItem>
          </ContextMenuContent>
        </ContextMenu>
      )
    }

    render(<Checkboxes />)
    let menu = await openMenu()
    const item = within(menu).getByRole("menuitemcheckbox")
    expect(item).toHaveAttribute("aria-checked", "false")

    await user.click(item)
    menu = await openMenu()
    expect(within(menu).getByRole("menuitemcheckbox")).toHaveAttribute(
      "aria-checked",
      "true"
    )
  })

  it("selects one radio item at a time", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <ContextMenu>
        <ContextMenuTrigger>Right click here</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuRadioGroup value="pedro" onValueChange={onValueChange}>
            <ContextMenuLabel>People</ContextMenuLabel>
            <ContextMenuRadioItem value="pedro">
              Pedro Duarte
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    )

    const menu = await openMenu()
    expect(within(menu).getByText("People")).toBeInTheDocument()
    const [pedro, colm] = within(menu).getAllByRole("menuitemradio")
    expect(pedro).toHaveAttribute("aria-checked", "true")
    expect(colm).toHaveAttribute("aria-checked", "false")

    await user.click(colm)
    expect(onValueChange).toHaveBeenCalledWith("colm", expect.anything())
  })

  it("opens a submenu from its trigger", async () => {
    const user = userEvent.setup()
    render(
      <ContextMenu>
        <ContextMenuTrigger>Right click here</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuSub>
            <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Save Page...</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
    )

    const menu = await openMenu()
    const subTrigger = within(menu).getByRole("menuitem", { name: /More Tools/ })
    expect(subTrigger).toHaveAttribute("aria-haspopup", "menu")

    await user.click(subTrigger)
    expect(
      await screen.findByRole("menuitem", { name: "Save Page..." })
    ).toBeInTheDocument()
  })

  it("closes on Escape", async () => {
    const user = userEvent.setup()
    render(<Basic />)
    await openMenu()

    await user.keyboard("{Escape}")
    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument()
    )
  })

  it("indents an inset item to the indicator column", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Right click here</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem inset>Back</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
    const menu = await openMenu()
    expect(within(menu).getByRole("menuitem", { name: "Back" })).toHaveAttribute(
      "data-inset"
    )
  })

  it("keeps a caller's className on the content and sub-content", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Right click here</ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem>Back</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
    const menu = await openMenu()
    // Merged, not replaced: the popup keeps its own surface classes too.
    expect(menu).toHaveClass("w-48", "rounded-lg", "bg-popover")
  })
})

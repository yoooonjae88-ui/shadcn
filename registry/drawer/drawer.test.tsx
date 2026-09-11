import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/drawer/drawer"

function renderDrawer(
  props: Partial<React.ComponentProps<typeof DrawerContent>> = {}
) {
  return render(
    <Drawer defaultOpen>
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerContent {...props}>
        <DrawerHeader>
          <DrawerTitle>Panel</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>Body</DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

function content() {
  return document.querySelector('[data-slot="drawer-content"]') as HTMLElement
}

describe("Drawer", () => {
  it("renders the open panel with its title and body", () => {
    renderDrawer()
    expect(screen.getByText("Panel")).toBeInTheDocument()
    expect(screen.getByText("Body")).toBeInTheDocument()
  })

  it("defaults to the right side at the md size", () => {
    renderDrawer()
    const el = content()
    expect(el).toHaveAttribute("data-side", "right")
    expect(el).toHaveAttribute("data-size", "md")
    // md on a horizontal side caps the width at max-w-sm (the previous fixed size).
    expect(el.className).toContain("max-w-sm")
  })

  it("maps size to the width on left/right sides", () => {
    renderDrawer({ side: "left", size: "lg" })
    const el = content()
    expect(el).toHaveAttribute("data-size", "lg")
    expect(el.className).toContain("max-w-md")
    expect(el.className).not.toContain("max-w-sm")
  })

  it("maps size to the height on top/bottom sides", () => {
    renderDrawer({ side: "bottom", size: "sm" })
    const el = content()
    expect(el).toHaveAttribute("data-side", "bottom")
    expect(el.className).toContain("max-h-72")
  })

  it("removes the size cap for the full size", () => {
    renderDrawer({ side: "right", size: "full" })
    const el = content()
    // w-screen wins over the base w-3/4 clamp and the max-width cap is dropped.
    expect(el.className).toContain("w-screen")
    expect(el.className).toContain("max-w-none")
    expect(el.className).not.toContain("max-w-sm")
  })
})

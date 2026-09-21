import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Avatar, AvatarFallback } from "@/registry/avatar/avatar"
import { Button } from "@/registry/button/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/card/card"
import { Checkbox } from "@/registry/checkbox/checkbox"
import { Divider } from "@/registry/divider/divider"
import { Input } from "@/registry/input/input"
import { Masonry } from "@/registry/masonry/masonry"
import {
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverTrigger,
} from "@/registry/popover/popover"
import { Space } from "@/registry/space/space"
import { Splitter, SplitterPanel } from "@/registry/splitter/splitter"
import { Switch } from "@/registry/switch/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/tabs/tabs"
import { Tag } from "@/registry/tag/tag"

// Cross-cutting integration coverage: registry components rendered INSIDE the
// layout items (Space, Space.Compact, Divider, Masonry, Splitter) and inside
// plain Tailwind flex/grid containers, which are what the registry uses for
// ordinary layout. jsdom does no visual layout, so these tests pin down the
// structural contracts the layouts rely on (direct-child wrappers, portal
// escape) and that components stay fully interactive once nested.

describe("components inside a Tailwind flex container", () => {
  it("keeps buttons, inputs and checkboxes interactive", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <div data-testid="flex" className="flex items-center gap-4">
        <Button onClick={onClick}>Save</Button>
        <Input placeholder="Name" />
        <Checkbox aria-label="Accept" />
      </div>
    )

    await user.click(screen.getByRole("button", { name: "Save" }))
    expect(onClick).toHaveBeenCalledOnce()

    await user.type(screen.getByPlaceholderText("Name"), "Ada")
    expect(screen.getByPlaceholderText("Name")).toHaveValue("Ada")

    await user.click(screen.getByRole("checkbox", { name: "Accept" }))
    expect(screen.getByRole("checkbox", { name: "Accept" })).toBeChecked()
  })

  it("lets tabs switch panels inside a flex column", async () => {
    const user = userEvent.setup()
    render(
      <div className="flex flex-col gap-3">
        <Tag>Header</Tag>
        <Tabs defaultValue="one">
          <TabsList>
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two">Two</TabsTrigger>
          </TabsList>
          <TabsContent value="one">First panel</TabsContent>
          <TabsContent value="two">Second panel</TabsContent>
        </Tabs>
      </div>
    )

    expect(screen.getByText("First panel")).toBeInTheDocument()
    await user.click(screen.getByRole("tab", { name: "Two" }))
    expect(await screen.findByText("Second panel")).toBeInTheDocument()
    expect(screen.queryByText("First panel")).not.toBeInTheDocument()
  })

  it("lets a popover escape the flex container through a portal", async () => {
    const user = userEvent.setup()
    render(
      <div data-testid="flex" className="flex gap-2">
        <Popover>
          <PopoverTrigger>Open actions</PopoverTrigger>
          <PopoverContent>
            <PopoverItem>Duplicate</PopoverItem>
          </PopoverContent>
        </Popover>
      </div>
    )

    await user.click(screen.getByRole("button", { name: "Open actions" }))
    const item = await screen.findByText("Duplicate")
    // Portalled out: visible in the document, but not a DOM descendant of the
    // flex container, so overflow/stacking on the layout can't clip it.
    expect(screen.getByTestId("flex").contains(item)).toBe(false)
  })
})

describe("components inside a Tailwind grid container", () => {
  it("renders cards into grid columns", () => {
    render(
      <div data-testid="grid" className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>Up 12%</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Signups</CardTitle>
          </CardHeader>
          <CardContent>Up 4%</CardContent>
        </Card>
      </div>
    )

    // The cards are direct children of the grid, so the track sizing applies
    // to them rather than to a wrapper.
    const cards = screen
      .getByTestId("grid")
      .querySelectorAll(":scope > [data-slot='card']")
    expect(cards).toHaveLength(2)
    expect(screen.getByText("Revenue")).toBeInTheDocument()
    expect(screen.getByText("Signups")).toBeInTheDocument()
  })

  it("keeps controls interactive inside columns", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <Input placeholder="Search" />
        </div>
        <div className="col-span-4">
          <Button onClick={onClick}>Go</Button>
        </div>
      </div>
    )

    await user.type(screen.getByPlaceholderText("Search"), "grid")
    expect(screen.getByPlaceholderText("Search")).toHaveValue("grid")
    await user.click(screen.getByRole("button", { name: "Go" }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})

describe("components inside Space", () => {
  it("wraps each component in its own item and keeps them interactive", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Space data-testid="space" size="middle">
        <Button onClick={onClick}>Invite</Button>
        <Switch aria-label="Notifications" />
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      </Space>
    )

    const items = screen
      .getByTestId("space")
      .querySelectorAll("[data-slot='space-item']")
    expect(items).toHaveLength(3)

    await user.click(screen.getByRole("button", { name: "Invite" }))
    expect(onClick).toHaveBeenCalledOnce()

    const toggle = screen.getByRole("switch", { name: "Notifications" })
    await user.click(toggle)
    expect(toggle).toHaveAttribute("aria-checked", "true")
  })

  it("renders a vertical Divider as the split between components", () => {
    render(
      <Space data-testid="space" split={<Divider type="vertical" />}>
        <Tag>Docs</Tag>
        <Tag>API</Tag>
        <Tag>Blog</Tag>
      </Space>
    )

    const space = screen.getByTestId("space")
    expect(space.querySelectorAll("[data-slot='space-split']")).toHaveLength(2)
    const separators = space.querySelectorAll("[data-slot='divider']")
    expect(separators).toHaveLength(2)
    for (const separator of separators) {
      expect(separator).toHaveAttribute("aria-orientation", "vertical")
    }
  })

  it("stacks form fields in a vertical Space without breaking typing", async () => {
    const user = userEvent.setup()
    render(
      <Space direction="vertical" size="large">
        <Input placeholder="Email" />
        <Input.Password placeholder="Password" />
      </Space>
    )

    await user.type(screen.getByPlaceholderText("Email"), "a@b.co")
    expect(screen.getByPlaceholderText("Email")).toHaveValue("a@b.co")
    await user.type(screen.getByPlaceholderText("Password"), "hunter2")
    expect(screen.getByPlaceholderText("Password")).toHaveValue("hunter2")
  })
})

describe("components inside Space.Compact", () => {
  it("attaches input and button as direct children so corner squaring applies", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Space.Compact data-testid="compact">
        <Input placeholder="Domain" />
        <Button onClick={onClick}>Check</Button>
      </Space.Compact>
    )

    // The radius-squaring selectors ([&>*:first-child] etc.) only reach
    // DIRECT children — both controls must render their frame at the top
    // level, with no wrapper element in between.
    const compact = screen.getByTestId("compact")
    expect(compact.children).toHaveLength(2)
    expect(compact.children[0]).toHaveAttribute("data-slot", "input")
    expect(compact.children[1].tagName).toBe("BUTTON")

    await user.type(screen.getByPlaceholderText("Domain"), "example.com")
    expect(screen.getByPlaceholderText("Domain")).toHaveValue("example.com")
    await user.click(screen.getByRole("button", { name: "Check" }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})

describe("components inside Divider-separated stacks", () => {
  it("separates components with horizontal dividers in a flex column", () => {
    render(
      <div className="flex flex-col">
        <Tag>Section one</Tag>
        <Divider>Details</Divider>
        <Tag>Section two</Tag>
      </div>
    )

    const separator = screen.getByRole("separator")
    expect(separator).toHaveAttribute("aria-orientation", "horizontal")
    expect(screen.getByText("Details")).toBeInTheDocument()
    expect(screen.getByText("Section one")).toBeInTheDocument()
    expect(screen.getByText("Section two")).toBeInTheDocument()
  })
})

describe("components inside Masonry", () => {
  it("lays out cards as masonry items and keeps their buttons clickable", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Masonry columns={2} gutter={8}>
        <Card key="a">
          <CardContent>
            <Button onClick={onClick}>Open</Button>
          </CardContent>
        </Card>
        <Card key="b">
          <CardContent>Static card</CardContent>
        </Card>
      </Masonry>
    )

    expect(
      document.querySelectorAll("[data-slot='masonry-item']")
    ).toHaveLength(2)
    // Items stay visibility:hidden until their first measurement (which the
    // jsdom ResizeObserver stub never delivers) and hidden elements get no
    // accessible name — query by text instead of role.
    await user.click(screen.getByText("Open"))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("leaves clicks on form controls alone when draggable", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Masonry columns={2} draggable>
        <div key="a">
          <Button onClick={onClick}>Act</Button>
        </div>
        <div key="b">Filler</div>
      </Masonry>
    )

    // The drag gesture must not swallow interaction with buttons/inputs
    // inside items (pointerdown on interactive content is exempt). Items are
    // visibility:hidden in jsdom (never measured), so query by text.
    await user.click(screen.getByText("Act"))
    expect(onClick).toHaveBeenCalledOnce()
  })
})

describe("components inside Splitter", () => {
  it("renders components into panels and keeps them interactive", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Splitter>
        <SplitterPanel>
          <Input placeholder="Filter" />
        </SplitterPanel>
        <SplitterPanel>
          <Button onClick={onClick}>Refresh</Button>
        </SplitterPanel>
      </Splitter>
    )

    await user.type(screen.getByPlaceholderText("Filter"), "abc")
    expect(screen.getByPlaceholderText("Filter")).toHaveValue("abc")
    await user.click(screen.getByRole("button", { name: "Refresh" }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})

describe("layouts nested in layouts", () => {
  it("keeps everything working in a flex > grid > Space composition", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <div className="flex flex-col gap-6" data-testid="page">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-9">
            <Input placeholder="Query" />
          </div>
          <div className="col-span-3">
            <Space>
              <Button onClick={onClick}>Search</Button>
              <Checkbox aria-label="Exact match" />
            </Space>
          </div>
        </div>
        <Divider size="small" />
        <Space split={<Divider type="vertical" />}>
          <Tag>All</Tag>
          <Tag>Recent</Tag>
        </Space>
      </div>
    )

    // The structural chain is intact: space items inside a grid cell inside
    // the flex page.
    const page = screen.getByTestId("page")
    expect(
      page.querySelector(
        ".grid > div > [data-slot='space'] > [data-slot='space-item']"
      )
    ).not.toBeNull()

    await user.type(screen.getByPlaceholderText("Query"), "nested")
    expect(screen.getByPlaceholderText("Query")).toHaveValue("nested")
    await user.click(screen.getByRole("button", { name: "Search" }))
    expect(onClick).toHaveBeenCalledOnce()
    await user.click(screen.getByRole("checkbox", { name: "Exact match" }))
    expect(screen.getByRole("checkbox", { name: "Exact match" })).toBeChecked()
  })
})

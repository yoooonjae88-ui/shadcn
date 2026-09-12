import fs from "node:fs"

import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Accordion, AccordionItem } from "@/registry/accordion/accordion"
import { Alert, AlertIcon } from "@/registry/alert/alert"
import {
  Avatar,
  AvatarIndicator,
  AvatarStatus,
} from "@/registry/avatar/avatar"
import { Button } from "@/registry/button/button"
import { Card } from "@/registry/card/card"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogIcon,
} from "@/registry/alert-dialog/alert-dialog"
import { Checkbox } from "@/registry/checkbox/checkbox"
import { DatePicker } from "@/registry/date-picker/date-picker"
import { Drawer, DrawerContent } from "@/registry/drawer/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/registry/dropdown/dropdown"
import { Empty, EmptyMedia } from "@/registry/empty/empty"
import { Field, FieldGroup } from "@/registry/field/field"
import { Input } from "@/registry/input/input"
import { InputGroup, InputGroupAddon } from "@/registry/input-group/input-group"
import { Progress } from "@/registry/progress/progress"
import { RadioGroup, RadioGroupItem } from "@/registry/radio-group/radio-group"
import { Rating } from "@/registry/rating/rating"
import { Slider } from "@/registry/slider/slider"
import { Spinner } from "@/registry/spinner/spinner"
import { Switch } from "@/registry/switch/switch"
import { Tag } from "@/registry/tag/tag"
import { TimePicker } from "@/registry/time-picker/time-picker"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/tooltip/tooltip"

// `defaultVariants` is only doing its job if rendering a component with no
// variant props produces exactly what passing those defaults explicitly does.
// Anything that drops a default — a variant prop that reaches cva as `null`,
// a JS destructuring default that disagrees with the cva one, a cva call that
// forgets to forward a prop — shows up here as a class mismatch.
function classesOf(markup: React.ReactElement, slot: string): string {
  const { unmount } = render(markup)
  // Queried from the document, not the render container: the overlay
  // components (drawer, tooltip, dialogs) portal their content to the body.
  const el = document.querySelector(`[data-slot='${slot}']`)
  if (!el) {
    unmount()
    throw new Error(`no [data-slot='${slot}'] rendered`)
  }
  const className = el.getAttribute("class") ?? ""
  unmount()
  return className
}

/** Each case renders bare, then with that cva's defaultVariants spelled out. */
const cases: {
  name: string
  slot: string
  bare: React.ReactElement
  explicit: React.ReactElement
}[] = [
  {
    name: "accordion item (variant)",
    slot: "accordion-item",
    bare: (
      <Accordion>
        <AccordionItem value="a" title="A" />
      </Accordion>
    ),
    explicit: (
      <Accordion variant="default">
        <AccordionItem value="a" title="A" />
      </Accordion>
    ),
  },
  {
    name: "alert (variant, appearance, size)",
    slot: "alert",
    bare: <Alert>Heads up</Alert>,
    explicit: (
      <Alert variant="secondary" appearance="solid" size="md">
        Heads up
      </Alert>
    ),
  },
  {
    name: "avatar (size, shape)",
    slot: "avatar",
    bare: <Avatar />,
    explicit: <Avatar size="default" shape="circle" />,
  },
  {
    name: "avatar indicator (position)",
    slot: "avatar-indicator",
    bare: (
      <Avatar>
        <AvatarIndicator />
      </Avatar>
    ),
    explicit: (
      <Avatar>
        <AvatarIndicator position="top-end" />
      </Avatar>
    ),
  },
  {
    name: "avatar status (variant, size)",
    slot: "avatar-status",
    bare: (
      <Avatar>
        <AvatarStatus />
      </Avatar>
    ),
    explicit: (
      <Avatar>
        <AvatarStatus variant="online" size="default" />
      </Avatar>
    ),
  },
  {
    name: "button (variant, size, shape)",
    slot: "button",
    bare: <Button>Go</Button>,
    explicit: (
      <Button variant="default" size="default" shape="default">
        Go
      </Button>
    ),
  },
  {
    name: "card (variant)",
    slot: "card",
    bare: <Card>Body</Card>,
    explicit: <Card variant="default">Body</Card>,
  },
  {
    name: "checkbox (size)",
    slot: "checkbox",
    bare: <Checkbox aria-label="c" />,
    explicit: <Checkbox aria-label="c" size="default" />,
  },
  {
    name: "empty (variant)",
    slot: "empty",
    bare: <Empty />,
    explicit: <Empty variant="default" />,
  },
  {
    name: "empty media (variant)",
    slot: "empty-media",
    bare: (
      <Empty>
        <EmptyMedia />
      </Empty>
    ),
    explicit: (
      <Empty>
        <EmptyMedia variant="default" />
      </Empty>
    ),
  },
  {
    name: "field (orientation)",
    slot: "field",
    bare: <Field />,
    explicit: <Field orientation="vertical" />,
  },
  {
    name: "field group (variant)",
    slot: "field-group",
    bare: <FieldGroup />,
    explicit: <FieldGroup variant="default" />,
  },
  {
    name: "input (variant, size)",
    slot: "input",
    bare: <Input />,
    explicit: <Input variant="filled" size="middle" />,
  },
  {
    name: "input group addon (align)",
    slot: "input-group-addon",
    bare: (
      <InputGroup>
        <InputGroupAddon>@</InputGroupAddon>
      </InputGroup>
    ),
    explicit: (
      <InputGroup>
        <InputGroupAddon align="inline-start">@</InputGroupAddon>
      </InputGroup>
    ),
  },
  {
    name: "progress track (size)",
    slot: "progress-track",
    bare: <Progress value={40} />,
    explicit: <Progress value={40} size="default" />,
  },
  {
    name: "progress indicator (variant)",
    slot: "progress-indicator",
    bare: <Progress value={40} />,
    explicit: <Progress value={40} variant="primary" />,
  },
  {
    name: "radio group item (size)",
    slot: "radio-group-item",
    bare: (
      <RadioGroup>
        <RadioGroupItem value="a" aria-label="a" />
      </RadioGroup>
    ),
    explicit: (
      <RadioGroup>
        <RadioGroupItem value="a" aria-label="a" size="default" />
      </RadioGroup>
    ),
  },
  {
    name: "rating (size)",
    slot: "rating",
    bare: <Rating rating={3} />,
    explicit: <Rating rating={3} size="default" />,
  },
  {
    name: "slider track (size)",
    slot: "slider-track",
    bare: <Slider defaultValue={40} />,
    explicit: <Slider defaultValue={40} size="default" />,
  },
  {
    name: "slider thumb (size)",
    slot: "slider-thumb",
    bare: <Slider defaultValue={40} />,
    explicit: <Slider defaultValue={40} size="default" />,
  },
  {
    name: "spinner (color)",
    slot: "spinner",
    bare: <Spinner />,
    explicit: <Spinner color="default" />,
  },
  {
    name: "switch track (size, variant)",
    slot: "switch",
    bare: <Switch aria-label="s" />,
    explicit: <Switch aria-label="s" size="default" variant="primary" />,
  },
  {
    name: "switch thumb (size)",
    slot: "switch-thumb",
    bare: <Switch aria-label="s" />,
    explicit: <Switch aria-label="s" size="default" />,
  },
  {
    name: "tag (variant, status, interactive)",
    slot: "tag",
    bare: <Tag>Tag</Tag>,
    explicit: (
      <Tag variant="filled" status="default" interactive={false}>
        Tag
      </Tag>
    ),
  },
  {
    name: "drawer content (side, size)",
    slot: "drawer-content",
    bare: (
      <Drawer open>
        <DrawerContent>Body</DrawerContent>
      </Drawer>
    ),
    explicit: (
      <Drawer open>
        <DrawerContent side="right" size="md">
          Body
        </DrawerContent>
      </Drawer>
    ),
  },
  {
    name: "dropdown menu item (variant)",
    slot: "dropdown-menu-item",
    bare: (
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    explicit: (
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuItem variant="default">Edit</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  {
    name: "tooltip content (variant)",
    slot: "tooltip-content",
    bare: (
      <Tooltip open>
        <TooltipTrigger>t</TooltipTrigger>
        <TooltipContent>Hint</TooltipContent>
      </Tooltip>
    ),
    explicit: (
      <Tooltip open>
        <TooltipTrigger>t</TooltipTrigger>
        <TooltipContent variant="default">Hint</TooltipContent>
      </Tooltip>
    ),
  },
  {
    name: "alert dialog content (size)",
    slot: "alert-dialog-content",
    bare: (
      <AlertDialog open>
        <AlertDialogContent>Body</AlertDialogContent>
      </AlertDialog>
    ),
    explicit: (
      <AlertDialog open>
        <AlertDialogContent size="default">Body</AlertDialogContent>
      </AlertDialog>
    ),
  },
  {
    name: "alert dialog icon (variant)",
    slot: "alert-dialog-icon",
    bare: (
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogIcon />
        </AlertDialogContent>
      </AlertDialog>
    ),
    explicit: (
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogIcon variant="default" />
        </AlertDialogContent>
      </AlertDialog>
    ),
  },
  {
    name: "date picker field (variant, size)",
    slot: "date-picker-trigger",
    bare: <DatePicker />,
    explicit: <DatePicker variant="outlined" size="middle" />,
  },
  {
    name: "time picker field (variant, size)",
    slot: "time-picker-trigger",
    bare: <TimePicker />,
    explicit: <TimePicker variant="outlined" size="middle" />,
  },
  {
    name: "alert icon (inherits alert variant)",
    slot: "alert-icon",
    bare: (
      <Alert>
        <AlertIcon />
      </Alert>
    ),
    explicit: (
      <Alert variant="secondary" appearance="solid" size="md">
        <AlertIcon />
      </Alert>
    ),
  },
]

describe("defaultVariants reach the DOM", () => {
  for (const { name, slot, bare, explicit } of cases) {
    it(`${name} renders the same bare as with its defaults spelled out`, () => {
      expect(classesOf(bare, slot)).toBe(classesOf(explicit, slot))
    })
  }

  it("renders a non-default variant differently, so the check has teeth", () => {
    expect(classesOf(<Button>Go</Button>, "button")).not.toBe(
      classesOf(<Button variant="destructive">Go</Button>, "button")
    )
    expect(classesOf(<Input />, "input")).not.toBe(
      classesOf(<Input variant="outlined" />, "input")
    )
  })
})

// The mirror of the check above: every value a variant accepts has to reach
// the DOM as its own class string. A prop that a component forgets to forward
// to cva renders identically for every value, and shows up here as a
// duplicate.
const matrix: {
  name: string
  slot: string
  prop: string
  values: string[]
  render: (props: Record<string, unknown>) => React.ReactElement
}[] = [
  {
    name: "accordion item variant",
    slot: "accordion-item",
    prop: "variant",
    values: ["default", "solid", "outline"],
    render: (p) => (
      <Accordion {...p}>
        <AccordionItem value="a" title="A" />
      </Accordion>
    ),
  },
  {
    name: "alert variant",
    slot: "alert",
    prop: "variant",
    values: [
      "primary",
      "secondary",
      "destructive",
      "success",
      "info",
      "warning",
      "mono",
    ],
    render: (p) => <Alert {...p}>x</Alert>,
  },
  {
    name: "alert appearance",
    slot: "alert",
    prop: "appearance",
    values: ["solid", "light", "outline", "stroke"],
    // Driven with a coloured variant: `outline` and `stroke` differ by the
    // border picking up the variant's colour, which the neutral default
    // variant has none of (covered on its own below).
    render: (p) => (
      <Alert variant="primary" {...p}>
        x
      </Alert>
    ),
  },
  {
    name: "alert size",
    slot: "alert",
    prop: "size",
    values: ["sm", "md", "lg"],
    render: (p) => <Alert {...p}>x</Alert>,
  },
  {
    name: "avatar size",
    slot: "avatar",
    prop: "size",
    values: ["xs", "sm", "default", "lg", "xl"],
    render: (p) => <Avatar {...p} />,
  },
  {
    name: "avatar shape",
    slot: "avatar",
    prop: "shape",
    values: ["circle", "square"],
    render: (p) => <Avatar {...p} />,
  },
  {
    name: "avatar indicator position",
    slot: "avatar-indicator",
    prop: "position",
    values: ["top-start", "top-end", "bottom-start", "bottom-end"],
    render: (p) => (
      <Avatar>
        <AvatarIndicator {...p} />
      </Avatar>
    ),
  },
  {
    name: "avatar status variant",
    slot: "avatar-status",
    prop: "variant",
    values: ["online", "offline", "busy", "away"],
    render: (p) => (
      <Avatar>
        <AvatarStatus {...p} />
      </Avatar>
    ),
  },
  {
    name: "button variant",
    slot: "button",
    prop: "variant",
    values: [
      "default",
      "outline",
      "secondary",
      "ghost",
      "hover",
      "destructive",
      "link",
      "teal",
      "mono",
      "dim",
      "foreground",
    ],
    render: (p) => <Button {...p}>Go</Button>,
  },
  {
    name: "button size",
    slot: "button",
    prop: "size",
    values: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
    render: (p) => <Button {...p}>Go</Button>,
  },

  {
    name: "card variant",
    slot: "card",
    prop: "variant",
    values: ["default", "accent", "ghost"],
    render: (p) => <Card {...p}>x</Card>,
  },
  {
    name: "checkbox size",
    slot: "checkbox",
    prop: "size",
    values: ["sm", "default", "lg"],
    render: (p) => <Checkbox aria-label="c" {...p} />,
  },
  {
    name: "date picker variant",
    slot: "date-picker-trigger",
    prop: "variant",
    values: ["outlined", "filled", "borderless", "underlined"],
    render: (p) => <DatePicker {...p} />,
  },
  {
    name: "date picker size",
    slot: "date-picker-trigger",
    prop: "size",
    values: ["small", "middle", "large"],
    render: (p) => <DatePicker {...p} />,
  },
  {
    name: "drawer side",
    slot: "drawer-content",
    prop: "side",
    values: ["right", "left", "top", "bottom"],
    render: (p) => (
      <Drawer open>
        <DrawerContent {...p}>x</DrawerContent>
      </Drawer>
    ),
  },
  {
    name: "drawer size",
    slot: "drawer-content",
    prop: "size",
    values: ["sm", "md", "lg", "xl", "full"],
    render: (p) => (
      <Drawer open>
        <DrawerContent {...p}>x</DrawerContent>
      </Drawer>
    ),
  },
  {
    name: "dropdown menu item variant",
    slot: "dropdown-menu-item",
    prop: "variant",
    values: ["default", "destructive"],
    render: (p) => (
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuItem {...p}>Edit</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  {
    name: "empty variant",
    slot: "empty",
    prop: "variant",
    values: ["default", "outline", "background"],
    render: (p) => <Empty {...p} />,
  },
  {
    name: "empty media variant",
    slot: "empty-media",
    prop: "variant",
    values: ["default", "icon"],
    render: (p) => (
      <Empty>
        <EmptyMedia {...p} />
      </Empty>
    ),
  },
  {
    name: "field orientation",
    slot: "field",
    prop: "orientation",
    values: ["vertical", "horizontal", "responsive"],
    render: (p) => <Field {...p} />,
  },
  {
    name: "field group variant",
    slot: "field-group",
    prop: "variant",
    values: ["default", "outline"],
    render: (p) => <FieldGroup {...p} />,
  },
  {
    name: "input variant",
    slot: "input",
    prop: "variant",
    values: ["outlined", "filled", "borderless", "underlined"],
    render: (p) => <Input {...p} />,
  },
  {
    name: "input size",
    slot: "input",
    prop: "size",
    values: ["small", "middle", "large"],
    render: (p) => <Input {...p} />,
  },
  {
    name: "input group addon align",
    slot: "input-group-addon",
    prop: "align",
    values: ["inline-start", "inline-end", "block-start", "block-end"],
    render: (p) => (
      <InputGroup>
        <InputGroupAddon {...p}>@</InputGroupAddon>
      </InputGroup>
    ),
  },
  {
    name: "progress track size",
    slot: "progress-track",
    prop: "size",
    values: ["sm", "default", "lg"],
    render: (p) => <Progress value={40} {...p} />,
  },
  {
    name: "progress indicator variant",
    slot: "progress-indicator",
    prop: "variant",
    values: ["primary", "mono", "success", "warning", "destructive", "info"],
    render: (p) => <Progress value={40} {...p} />,
  },
  {
    name: "radio group item size",
    slot: "radio-group-item",
    prop: "size",
    values: ["sm", "default", "lg"],
    render: (p) => (
      <RadioGroup>
        <RadioGroupItem value="a" aria-label="a" {...p} />
      </RadioGroup>
    ),
  },
  {
    name: "rating size",
    slot: "rating",
    prop: "size",
    values: ["sm", "default", "lg"],
    render: (p) => <Rating rating={3} {...p} />,
  },
  {
    name: "slider track size",
    slot: "slider-track",
    prop: "size",
    values: ["sm", "default", "lg"],
    render: (p) => <Slider defaultValue={40} {...p} />,
  },
  {
    name: "slider thumb size",
    slot: "slider-thumb",
    prop: "size",
    values: ["sm", "default", "lg"],
    render: (p) => <Slider defaultValue={40} {...p} />,
  },
  {
    name: "spinner color",
    slot: "spinner",
    prop: "color",
    values: [
      "default",
      "primary",
      "secondary",
      "muted",
      "destructive",
      "success",
      "warning",
      "info",
    ],
    render: (p) => <Spinner {...p} />,
  },
  {
    name: "switch size",
    slot: "switch",
    prop: "size",
    values: ["sm", "default", "lg"],
    render: (p) => <Switch aria-label="s" {...p} />,
  },
  {
    name: "switch variant",
    slot: "switch",
    prop: "variant",
    values: ["primary", "mono", "success", "warning", "destructive"],
    render: (p) => <Switch aria-label="s" {...p} />,
  },
  {
    name: "tag variant",
    slot: "tag",
    prop: "variant",
    values: ["filled", "solid", "outlined"],
    render: (p) => <Tag {...p}>t</Tag>,
  },
  {
    name: "tag status",
    slot: "tag",
    prop: "status",
    values: ["default", "success", "processing", "warning", "error"],
    render: (p) => <Tag {...p}>t</Tag>,
  },
  {
    name: "time picker variant",
    slot: "time-picker-trigger",
    prop: "variant",
    values: ["outlined", "filled", "borderless", "underlined"],
    render: (p) => <TimePicker {...p} />,
  },
  {
    name: "time picker size",
    slot: "time-picker-trigger",
    prop: "size",
    values: ["small", "middle", "large"],
    render: (p) => <TimePicker {...p} />,
  },
  {
    name: "tooltip variant",
    slot: "tooltip-content",
    prop: "variant",
    values: [
      "default",
      "primary",
      "secondary",
      "destructive",
      "success",
      "warning",
      "info",
    ],
    render: (p) => (
      <Tooltip open>
        <TooltipTrigger>t</TooltipTrigger>
        <TooltipContent {...p}>Hint</TooltipContent>
      </Tooltip>
    ),
  },
  {
    name: "alert dialog content size",
    slot: "alert-dialog-content",
    prop: "size",
    values: ["sm", "default", "lg", "xl"],
    render: (p) => (
      <AlertDialog open>
        <AlertDialogContent {...p}>x</AlertDialogContent>
      </AlertDialog>
    ),
  },
  {
    name: "alert dialog icon variant",
    slot: "alert-dialog-icon",
    prop: "variant",
    values: ["default", "destructive", "success", "warning", "info"],
    render: (p) => (
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogIcon {...p} />
        </AlertDialogContent>
      </AlertDialog>
    ),
  },
]

describe("every variant value applies", () => {
  for (const { name, slot, prop, values, render: renderCase } of matrix) {
    it(`${name} renders a distinct class string for each value`, () => {
      const seen = new Map<string, string>()
      for (const value of values) {
        const classes = classesOf(renderCase({ [prop]: value }), slot)
        const clash = [...seen.entries()].find(([, c]) => c === classes)
        expect(
          clash,
          `${prop}="${value}" renders identically to ${prop}="${clash?.[0]}"`
        ).toBeUndefined()
        seen.set(value, classes)
      }
      expect(seen.size).toBe(values.length)
    })
  }
})

describe("variant values that intentionally coincide", () => {
  // circle and pill are both fully rounded; they differ in the size they are
  // meant to pair with (square icon sizes vs text sizes), not in their class.
  it("button shape: circle and pill are both fully rounded, unlike default", () => {
    const base = classesOf(<Button>Go</Button>, "button")
    const circle = classesOf(<Button shape="circle">Go</Button>, "button")
    const pill = classesOf(<Button shape="pill">Go</Button>, "button")
    expect(circle).not.toBe(base)
    expect(pill).not.toBe(base)
    expect(pill).toBe(circle)
  })

  // Every coloured variant tints its outline border and leaves stroke neutral.
  // secondary IS the neutral variant, so for it the two coincide.
  it("alert appearance: outline tints its border except on the neutral variant", () => {
    const outline = (v: string) =>
      classesOf(
        <Alert variant={v as "primary"} appearance="outline">
          x
        </Alert>,
        "alert"
      )
    const stroke = (v: string) =>
      classesOf(
        <Alert variant={v as "primary"} appearance="stroke">
          x
        </Alert>,
        "alert"
      )
    for (const v of ["primary", "destructive", "success", "info", "warning"]) {
      expect(outline(v), `${v} outline should tint its border`).not.toBe(
        stroke(v)
      )
    }
    expect(outline("secondary")).toBe(stroke("secondary"))
  })
})

// The failure mode that started this: a component destructuring its own
// `variant = "default"` shadows the cva `defaultVariants`, which then never
// fires — editing it changes nothing, silently. These two checks keep the cva
// config the single source of truth.
describe("cva defaultVariants stay authoritative", () => {
  // Read the sources the way every platform spells them: `readdirSync` hands
  // back `card\card.tsx` on Windows, and a checkout without a .gitattributes
  // gets CRLF there, which would quietly stop the patterns below from matching
  // anything at all. Both are normalised so the guards look the same everywhere.
  const sources = fs
    .readdirSync("registry", { recursive: true, encoding: "utf8" })
    .map((p) => p.replace(/\\/g, "/"))
    .filter((p) => p.endsWith(".tsx") && !p.includes(".test."))
    .map((p) => `registry/${p}`)
    .concat(
      fs
        .readdirSync("components/ui")
        .filter((p) => p.endsWith(".tsx"))
        .map((p) => `components/ui/${p}`)
    )
    .map((file) => ({
      path: file,
      src: fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n"),
    }))
    .filter(({ src }) => src.includes("cva("))

  /** Every `const xDefaults = {...} as const` paired with the cva below it. */
  function defaultsPairs(src: string) {
    return [
      ...src.matchAll(/const (\w+) = \{([^}]*)\} as const\n\nconst (\w+) = cva\(/g),
    ].map((m) => ({
      constName: m[1],
      entries: [...m[2].matchAll(/(\w+):\s*"([\w-]+)"/g)].map((e) => ({
        key: e[1],
        value: e[2],
      })),
      cvaName: m[3],
    }))
  }

  it("parses every source it scans", () => {
    // A guard that matches nothing passes for the wrong reason, so assert the
    // parse actually found things rather than naming one file that could be
    // renamed out from under it.
    expect(sources.length).toBeGreaterThan(20)
    const parsed = sources.filter(({ src }) => defaultsPairs(src).length > 0)
    expect(parsed.length).toBe(sources.length)
    expect(
      sources.filter(({ src }) => /^function \w+\(\{[\s\S]*?\n\}\n/m.test(src))
        .length
    ).toBeGreaterThan(20)
  })

  it("declares defaultVariants as a named constant, never inline", () => {
    const inline: string[] = []
    for (const { path: file, src } of sources) {
      for (const m of src.matchAll(/defaultVariants:\s*(.)/g)) {
        if (m[1] === "{") inline.push(file)
      }
    }
    expect(inline).toEqual([])
  })

  it("never re-hardcodes a default that a cva constant already defines", () => {
    const shadowed: string[] = []
    for (const { path: file, src } of sources) {
      const pairs = defaultsPairs(src)

      // Only a component that actually calls that cva can shadow its
      // defaults — a same-named prop elsewhere in the file (a forwarded
      // Button variant, a separate lookup map) is unrelated.
      // Ends on a `}` that is alone on its line: the destructure's own
      // closing brace is followed by the type annotation (`}: Props) {`).
      for (const fn of src.matchAll(/^function (\w+)\(\{[\s\S]*?\n\}\n/gm)) {
        const body = fn[0]
        for (const { constName, entries, cvaName } of pairs) {
          if (!body.includes(`${cvaName}(`)) continue
          for (const { key, value } of entries) {
            if (new RegExp(`^\\s{2}${key} = "${value}",$`, "m").test(body)) {
              shadowed.push(
                `${file} ${fn[1]}: ${key} = "${value}" (use ${constName}.${key})`
              )
            }
          }
        }
      }
    }
    expect(shadowed).toEqual([])
  })
})

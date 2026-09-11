"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { CheckIcon, ChevronDownIcon, SearchIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * A searchable select for data entry, built on Base UI Combobox.
 *
 * Composable parts (reui.io-style API):
 *
 * ```tsx
 * <Combobox items={items}>
 *   <ComboboxTrigger className="w-64">
 *     <ComboboxValue placeholder="Select a framework…" />
 *   </ComboboxTrigger>
 *   <ComboboxContent>
 *     <ComboboxInput placeholder="Search…" />
 *     <ComboboxEmpty>No results found.</ComboboxEmpty>
 *     <ComboboxList>
 *       {(item: Item) => (
 *         <ComboboxItem key={item.value} value={item}>
 *           {item.label}
 *         </ComboboxItem>
 *       )}
 *     </ComboboxList>
 *   </ComboboxContent>
 * </Combobox>
 * ```
 *
 * Items shaped `{ value, label }` are displayed by their label automatically.
 * Supports `multiple`, disabled items, grouped items, a clear button,
 * check-indicator positioning and fully custom trigger/item rendering.
 */

/** A `{ value, label }` option; extend it with your own fields (icon, etc.). */
interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

/** Groups all parts. Accepts every Base UI `Combobox.Root` prop (`items`, `multiple`, `value`, `onValueChange`, `inputValue`, `filter`, …). */
const Combobox = ComboboxPrimitive.Root

/**
 * A button that shows the current value and opens the popup.
 * Renders a trailing chevron; style the width via `className`.
 */
function ComboboxTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Trigger>) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn(
        "flex h-9 w-full min-w-0 items-center justify-between gap-2 rounded-lg bg-input-background px-3 py-2 text-sm transition-shadow outline-none select-none",
        "focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.Icon
        data-slot="combobox-trigger-icon"
        className="shrink-0 text-muted-foreground"
      >
        <ChevronDownIcon className="size-4" aria-hidden="true" />
      </ComboboxPrimitive.Icon>
    </ComboboxPrimitive.Trigger>
  )
}

/**
 * The selected value's label (or `placeholder` when nothing is selected).
 * Pass a function child to render the selection yourself — e.g. a count
 * ("3 selected") or removable badges in `multiple` mode.
 */
function ComboboxValue({
  className,
  placeholder,
  children,
}: {
  className?: string
  placeholder?: React.ReactNode
  children?: React.ComponentProps<typeof ComboboxPrimitive.Value>["children"]
}) {
  return (
    <span
      data-slot="combobox-value"
      className={cn("flex flex-1 flex-wrap items-center gap-1 truncate text-left", className)}
    >
      <ComboboxPrimitive.Value
        placeholder={
          placeholder !== undefined ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : undefined
        }
      >
        {children}
      </ComboboxPrimitive.Value>
    </span>
  )
}

/**
 * Clears the selection. Rendered as a `<span role="button">` so it can sit
 * inside the trigger button without invalid nesting; hidden while empty.
 */
function ComboboxClear({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Clear>) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      nativeButton={false}
      render={<span role="button" aria-label="Clear selection" tabIndex={-1} />}
      className={cn(
        "flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground outline-none hover:text-foreground",
        className
      )}
      {...props}
    >
      {children ?? <XIcon className="size-3.5" aria-hidden="true" />}
    </ComboboxPrimitive.Clear>
  )
}

/** The floating popup: portal + positioner + panel. Matches the trigger's width. */
function ComboboxContent({
  className,
  side,
  align,
  sideOffset = 4,
  alignOffset,
  anchor,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Popup> &
  Pick<
    React.ComponentProps<typeof ComboboxPrimitive.Positioner>,
    "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
  >) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        className="z-50 outline-none"
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        anchor={anchor}
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          className={cn(
            "flex max-h-[min(var(--available-height),24rem)] w-[var(--anchor-width)] max-w-[var(--available-width)] origin-[var(--transform-origin)] flex-col overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-lg outline-none",
            "transition-[scale,opacity] duration-100 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
            className
          )}
          {...props}
        >
          {children}
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

/**
 * The search field pinned at the top of the popup, with a leading search icon.
 * Set `showIcon={false}` to hide the icon.
 */
function ComboboxInput({
  className,
  wrapperClassName,
  showIcon = true,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Input> & {
  wrapperClassName?: string
  showIcon?: boolean
}) {
  return (
    <div data-slot="combobox-input-wrapper" className="shrink-0 p-1 pb-0">
      <div
        className={cn(
          "flex h-8 items-center gap-2 rounded-md bg-input-background px-2",
          wrapperClassName
        )}
      >
        {showIcon && (
          <SearchIcon
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        )}
        <ComboboxPrimitive.Input
          data-slot="combobox-input"
          className={cn(
            "h-full w-full flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground",
            className
          )}
          {...props}
        />
      </div>
    </div>
  )
}

/**
 * The scrollable options list. Pass a function child `(item) => <ComboboxItem …/>`
 * together with the root's `items` prop to get built-in filtering.
 */
function ComboboxList({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.List>) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "scroll-py-1 overflow-y-auto overscroll-contain p-1 data-[empty]:p-0",
        className
      )}
      {...props}
    />
  )
}

/** Shown when no option matches the search. Stays mounted (a11y); collapses when the list has results. */
function ComboboxEmpty({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Empty>) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "px-3 py-4 text-center text-sm text-muted-foreground empty:m-0 empty:p-0",
        className
      )}
      {...props}
    />
  )
}

/** Groups related items; pass the group's `items` so filtering stays scoped. */
function ComboboxGroup({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Group>) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={className}
      {...props}
    />
  )
}

/** The label above a group's items. */
function ComboboxGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.GroupLabel>) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-group-label"
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

/** Renders the nearest group's `items` via a function child. */
const ComboboxCollection = ComboboxPrimitive.Collection

/** A thin visual break between groups of items. */
function ComboboxSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      data-slot="combobox-separator"
      className={cn("my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

/**
 * A selectable option. The check indicator marks the selected option;
 * move it with `indicatorPosition` ("end" by default, "start" for a
 * leading check) or hide it with `showIndicator={false}`.
 */
function ComboboxItem({
  className,
  children,
  indicatorPosition = "end",
  showIndicator = true,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Item> & {
  indicatorPosition?: "start" | "end"
  showIndicator?: boolean
}) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-md py-1.5 text-sm outline-none select-none",
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        !showIndicator
          ? "px-2"
          : indicatorPosition === "start"
            ? "pr-2 pl-8"
            : "pr-8 pl-2",
        className
      )}
      {...props}
    >
      {children}
      {showIndicator && (
        <ComboboxPrimitive.ItemIndicator
          data-slot="combobox-item-indicator"
          className={cn(
            "absolute flex size-4 items-center justify-center",
            indicatorPosition === "start" ? "left-2" : "right-2"
          )}
        >
          <CheckIcon className="size-4" aria-hidden="true" />
        </ComboboxPrimitive.ItemIndicator>
      )}
    </ComboboxPrimitive.Item>
  )
}

/**
 * A removable badge for one selected option, for `multiple` comboboxes that
 * show their selection inside the trigger. Rendered with spans (not buttons)
 * so it nests validly inside the trigger; removal must be wired via `onRemove`.
 */
function ComboboxBadge({
  className,
  children,
  onRemove,
  removeLabel = "Remove",
  ...props
}: React.ComponentProps<"span"> & {
  onRemove?: () => void
  removeLabel?: string
}) {
  return (
    <span
      data-slot="combobox-badge"
      className={cn(
        "flex h-6 max-w-full min-w-0 items-center gap-1 rounded-md bg-background py-0 pl-2 text-xs font-medium shadow-xs",
        onRemove ? "pr-1" : "pr-2",
        className
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      {onRemove && (
        <span
          role="button"
          aria-label={removeLabel}
          className="flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={(event) => {
            // Keep the click from toggling the popup via the parent trigger.
            event.stopPropagation()
            onRemove()
          }}
        >
          <XIcon className="size-3" aria-hidden="true" />
        </span>
      )}
    </span>
  )
}

/** Chips-in-input parts, re-exported for input-anchored multi-select layouts. */
const ComboboxChips = ComboboxPrimitive.Chips
const ComboboxChip = ComboboxPrimitive.Chip
const ComboboxChipRemove = ComboboxPrimitive.ChipRemove
const ComboboxInputGroup = ComboboxPrimitive.InputGroup

export {
  Combobox,
  ComboboxTrigger,
  ComboboxValue,
  ComboboxClear,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxCollection,
  ComboboxSeparator,
  ComboboxItem,
  ComboboxBadge,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxInputGroup,
  type ComboboxOption,
}

"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Plus, X } from "lucide-react"

import { cn } from "@/lib/utils"

type TagVariant = "filled" | "solid" | "outlined"
type TagStatus = "default" | "success" | "processing" | "warning" | "error"

// Every colour below comes from a `--tag-*` token (see app/globals.css and the
// item's `cssVars` in registry.json) so the whole palette is restyleable from
// one place — no hard-coded hex / named Tailwind colours live in the component.
const tagDefaults = {
      variant: "filled",
      status: "default",
      interactive: false,
    } as const

const tagVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors [&_svg]:pointer-events-none [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        filled: "",
        solid: "border-transparent",
        outlined: "bg-transparent",
      },
      status: {
        default: "",
        success: "",
        processing: "",
        warning: "",
        error: "",
      },
      interactive: {
        true: "cursor-pointer select-none hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
        false: "",
      },
    },
    compoundVariants: [
      // ---- default (neutral, white filled chip) ----
      // Resting state is `--tag-filled` (white in light mode); when the chip is
      // interactive it turns `--tag-filled-active` (#334F4E) on hover/selected.
      {
        variant: "filled",
        status: "default",
        class:
          "border-tag-filled-border bg-tag-filled text-tag-filled-foreground",
      },
      {
        variant: "filled",
        status: "default",
        interactive: true,
        class:
          "hover:opacity-100 hover:border-tag-filled-active hover:bg-tag-filled-active hover:text-tag-filled-active-foreground data-[selected]:border-tag-filled-active data-[selected]:bg-tag-filled-active data-[selected]:text-tag-filled-active-foreground",
      },
      {
        variant: "solid",
        status: "default",
        class: "bg-foreground text-background",
      },
      {
        variant: "outlined",
        status: "default",
        class: "border-border text-foreground",
      },
      // ---- success ----
      {
        variant: "filled",
        status: "success",
        class: "border-tag-success/20 bg-tag-success/10 text-tag-success",
      },
      {
        variant: "solid",
        status: "success",
        class: "bg-tag-success text-tag-success-foreground",
      },
      {
        variant: "outlined",
        status: "success",
        class: "border-tag-success/50 text-tag-success",
      },
      // ---- processing ----
      {
        variant: "filled",
        status: "processing",
        class:
          "border-tag-processing/20 bg-tag-processing/10 text-tag-processing",
      },
      {
        variant: "solid",
        status: "processing",
        class: "bg-tag-processing text-tag-processing-foreground",
      },
      {
        variant: "outlined",
        status: "processing",
        class: "border-tag-processing/50 text-tag-processing",
      },
      // ---- warning ----
      {
        variant: "filled",
        status: "warning",
        class: "border-tag-warning/20 bg-tag-warning/10 text-tag-warning",
      },
      {
        variant: "solid",
        status: "warning",
        class: "bg-tag-warning text-tag-warning-foreground",
      },
      {
        variant: "outlined",
        status: "warning",
        class: "border-tag-warning/50 text-tag-warning",
      },
      // ---- error ----
      {
        variant: "filled",
        status: "error",
        class: "border-tag-error/20 bg-tag-error/10 text-tag-error",
      },
      {
        variant: "solid",
        status: "error",
        class: "bg-tag-error text-tag-error-foreground",
      },
      {
        variant: "outlined",
        status: "error",
        class: "border-tag-error/50 text-tag-error",
      },
    ],
    defaultVariants: tagDefaults,
  }
)

// ---------------------------------------------------------------------------
// TagGroup — manages selection for a set of selectable Tags.
// Selection is always modelled as an array of the child Tags' `value`s, so the
// same shape works for single- and multi-select. With `multiple={false}`
// (default) at most one value is held; `multiple` allows many. Clicking an
// already-selected Tag deselects it.
// ---------------------------------------------------------------------------

interface TagGroupContextValue {
  value: string[]
  toggle: (value: string) => void
  disabled: boolean
}

const TagGroupContext = React.createContext<TagGroupContextValue | null>(null)

interface TagGroupProps
  extends Omit<React.ComponentProps<"div">, "onChange"> {
  /** Allow more than one Tag to be selected at a time. */
  multiple?: boolean
  /** Controlled selection. */
  value?: string[]
  /** Uncontrolled initial selection. */
  defaultValue?: string[]
  /** Fired with the next selection whenever it changes. */
  onValueChange?: (value: string[]) => void
  /** Disables every Tag in the group. */
  disabled?: boolean
}

function TagGroup({
  multiple = false,
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled = false,
  className,
  ...props
}: TagGroupProps) {
  const isControlled = valueProp !== undefined
  const [internalValue, setInternalValue] = React.useState<string[]>(
    () => defaultValue ?? []
  )
  const value = isControlled ? valueProp : internalValue

  const toggle = React.useCallback(
    (item: string) => {
      const next = value.includes(item)
        ? value.filter((v) => v !== item) // deselect
        : multiple
          ? [...value, item]
          : [item]
      if (!isControlled) setInternalValue(next)
      onValueChange?.(next)
    },
    [value, multiple, isControlled, onValueChange]
  )

  const context = React.useMemo<TagGroupContextValue>(
    () => ({ value, toggle, disabled }),
    [value, toggle, disabled]
  )

  return (
    <TagGroupContext.Provider value={context}>
      <div
        data-slot="tag-group"
        role="group"
        className={cn("flex flex-wrap items-center gap-2", className)}
        {...props}
      />
    </TagGroupContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Tag
// ---------------------------------------------------------------------------

interface TagProps
  extends Omit<React.ComponentProps<"span">, "onClick">,
    VariantProps<typeof tagVariants> {
  /** Visual treatment. */
  variant?: TagVariant
  /** Status colour. */
  status?: TagStatus
  /** Leading icon (or any node). Overrides the auto processing dot. */
  icon?: React.ReactNode
  /** Disables the Tag (and prevents selection inside a TagGroup). */
  disabled?: boolean
  /**
   * Identifier used for selection. When a Tag has a `value` and sits inside a
   * `TagGroup`, it becomes selectable and toggles that value on click.
   */
  value?: string
  /** Controlled selected state for standalone (group-less) selectable Tags. */
  selected?: boolean
  /** Click handler; also makes a group-less Tag interactive. */
  onClick?: React.MouseEventHandler<HTMLElement>
  /** Show a close button on the chip. */
  closable?: boolean
  /** Glyph for the close button. */
  closeIcon?: React.ReactNode
  /** Accessible name for the close button. */
  closeLabel?: string
  /**
   * Fired when the close button is used. The Tag does not remove itself —
   * whoever owns the list decides, which is what lets a set of tags be added
   * to and removed from (see TagInput).
   */
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

// Pulsing dot shown for the "processing" status when no explicit icon is set.
function TagProcessingDot() {
  return (
    <span
      data-slot="tag-processing-dot"
      aria-hidden="true"
      className="relative flex size-1.5"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
      <span className="relative inline-flex size-1.5 rounded-full bg-current" />
    </span>
  )
}

function Tag({
  variant = tagDefaults.variant,
  status = tagDefaults.status,
  icon,
  disabled,
  value,
  selected: selectedProp,
  onClick,
  closable = false,
  closeIcon,
  closeLabel,
  onClose,
  className,
  children,
  ...props
}: TagProps) {
  const group = React.useContext(TagGroupContext)
  const inGroup = group != null && value != null

  const isDisabled = (disabled ?? false) || (group?.disabled ?? false)
  const interactive = inGroup || selectedProp != null || onClick != null
  const selected = inGroup
    ? group.value.includes(value)
    : (selectedProp ?? false)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isDisabled) return
    if (inGroup) group.toggle(value)
    onClick?.(event)
  }

  const content = (
    <>
      {icon ?? (status === "processing" ? <TagProcessingDot /> : null)}
      {children}
    </>
  )

  // The default filled chip signals selection with its `--tag-filled-active`
  // fill, so it doesn't need an extra ring; every other variant/status does.
  const usesFillSwap = variant === "filled" && status === "default"
  const classes = cn(
    tagVariants({ variant, status, interactive }),
    selected &&
      !usesFillSwap &&
      "ring-2 ring-ring/60 ring-offset-1 ring-offset-background",
    className
  )

  const closeButton = closable ? (
    <button
      type="button"
      data-slot="tag-close"
      aria-label={closeLabel ?? "Remove"}
      disabled={isDisabled}
      onClick={(event) => {
        // A closable Tag inside a selectable group would otherwise toggle the
        // selection on its way out.
        event.stopPropagation()
        onClose?.(event)
      }}
      className="-mr-0.5 inline-flex shrink-0 cursor-pointer items-center rounded-sm opacity-60 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none"
    >
      {closeIcon ?? <X />}
    </button>
  ) : null

  // A close button is interactive content, so it can never sit inside the
  // <button> a selectable Tag renders. A closable Tag is a <span> chip
  // instead, with its label as the button when it is also selectable.
  if (closable) {
    return (
      <span
        data-slot="tag"
        data-status={status}
        data-selected={(interactive && selected) || undefined}
        data-disabled={isDisabled || undefined}
        className={cn(classes, isDisabled && "opacity-50")}
        {...props}
      >
        {interactive ? (
          <button
            type="button"
            data-slot="tag-label"
            aria-pressed={selected}
            disabled={isDisabled}
            onClick={handleClick}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none"
          >
            {content}
          </button>
        ) : (
          content
        )}
        {closeButton}
      </span>
    )
  }

  if (interactive) {
    return (
      <button
        type="button"
        data-slot="tag"
        data-status={status}
        data-selected={selected || undefined}
        aria-pressed={selected}
        disabled={isDisabled}
        onClick={handleClick}
        className={classes}
        {...(props as React.ComponentProps<"button">)}
      >
        {content}
      </button>
    )
  }

  return (
    <span
      data-slot="tag"
      data-status={status}
      data-disabled={isDisabled || undefined}
      className={cn(classes, isDisabled && "pointer-events-none opacity-50")}
      {...props}
    >
      {content}
    </span>
  )
}


// ---------------------------------------------------------------------------
// TagInput — a set of tags that can be added to and removed from, after Ant
// Design's "Add & Remove dynamically" Tag demo.
//
// The list is the value: each entry renders as a closable Tag, and a trailing
// "New Tag" control swaps itself for an inline field. Enter commits and keeps
// the field open for the next one; Escape or clicking away closes it, and
// Backspace on an empty field takes the last tag back.
// ---------------------------------------------------------------------------

interface TagInputProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  /** Controlled list of tags. */
  value?: string[]
  /** Uncontrolled initial list. */
  defaultValue?: string[]
  /** Fired with the next list whenever a tag is added or removed. */
  onValueChange?: (value: string[]) => void
  /** Visual treatment passed to every tag. */
  variant?: TagVariant
  /** Status colour passed to every tag. */
  status?: TagStatus
  /** Label on the control that opens the field. */
  addLabel?: React.ReactNode
  /** Placeholder shown in the field. */
  placeholder?: string
  /** Most tags allowed; the add control hides once the list is full. */
  max?: number
  /** Keep tags that repeat one already in the list. */
  allowDuplicates?: boolean
  /** Disables adding and removing. */
  disabled?: boolean
}

function TagInput({
  value: valueProp,
  defaultValue,
  onValueChange,
  variant = tagDefaults.variant,
  status = tagDefaults.status,
  addLabel = "New Tag",
  placeholder = "Tag name",
  max,
  allowDuplicates = false,
  disabled = false,
  className,
  ...props
}: TagInputProps) {
  const isControlled = valueProp !== undefined
  const [internalValue, setInternalValue] = React.useState<string[]>(
    () => defaultValue ?? []
  )
  const value = isControlled ? valueProp : internalValue

  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState("")

  // Focused as it mounts rather than a frame later, so a fast typist cannot
  // land a keystroke on the page before the field takes it. The callback is
  // stable, so it runs on mount and unmount only — never stealing focus back
  // on a later render.
  const focusOnMount = React.useCallback((node: HTMLInputElement | null) => {
    node?.focus()
  }, [])

  const commitValue = (next: string[]) => {
    if (!isControlled) setInternalValue(next)
    onValueChange?.(next)
  }

  const isFull = max !== undefined && value.length >= max

  const addDraft = () => {
    const tag = draft.trim()
    setDraft("")
    if (!tag || isFull) return
    if (!allowDuplicates && value.includes(tag)) return
    commitValue([...value, tag])
  }

  const removeAt = (index: number) => {
    commitValue(value.filter((_, i) => i !== index))
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      addDraft()
    } else if (event.key === "Escape") {
      setDraft("")
      setEditing(false)
    } else if (event.key === "Backspace" && draft === "" && value.length > 0) {
      removeAt(value.length - 1)
    }
  }

  return (
    <div
      data-slot="tag-input"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    >
      {value.map((tag, index) => (
        <Tag
          key={`${tag}-${index}`}
          variant={variant}
          status={status}
          disabled={disabled}
          closable
          closeLabel={`Remove ${tag}`}
          onClose={() => removeAt(index)}
        >
          {tag}
        </Tag>
      ))}

      {editing ? (
        <input
          ref={focusOnMount}
          data-slot="tag-input-field"
          value={draft}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            addDraft()
            setEditing(false)
          }}
          // Same box as a chip — the border, padding and text of `tagVariants`
          // — so the field sits in the row at exactly the tags' height.
          className="w-24 rounded-md border border-tag-filled-border bg-tag-filled px-2 py-0.5 text-xs leading-4 text-tag-filled-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
        />
      ) : (
        !isFull && (
          <Tag
            data-slot="tag-input-add"
            variant="outlined"
            className="border-dashed"
            disabled={disabled}
            onClick={() => setEditing(true)}
          >
            <Plus />
            {addLabel}
          </Tag>
        )
      )}
    </div>
  )
}

export {
  Tag,
  TagGroup,
  TagInput,
  tagVariants,
  type TagProps,
  type TagGroupProps,
  type TagInputProps,
  type TagVariant,
  type TagStatus,
}

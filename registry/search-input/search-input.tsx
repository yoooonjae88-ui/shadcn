"use client"

import * as React from "react"
import { Search, X } from "lucide-react"

import { cn } from "@/lib/utils"

interface SearchInputProps
  extends Omit<
    React.ComponentProps<"input">,
    "value" | "defaultValue" | "onChange" | "type" | "size"
  > {
  /** Current value (controlled). */
  value?: string
  /** Initial value (uncontrolled). */
  defaultValue?: string
  /** Fired on every keystroke with the new value. */
  onValueChange?: (value: string) => void
  /** Fired when the user submits the query (Enter key). */
  onSearch?: (value: string) => void
  /** Expanded state (controlled). */
  expanded?: boolean
  /** Initial expanded state (uncontrolled). Defaults to false. */
  defaultExpanded?: boolean
  /** Fired when the expanded state changes. */
  onExpandedChange?: (expanded: boolean) => void
  /** Collapse when the field loses focus while empty. Defaults to true. */
  collapseOnBlur?: boolean
  /** Width of the expanded field. Defaults to "16rem". */
  expandedWidth?: number | string
  /**
   * Show the pill background fill and border while collapsed. When false, the
   * field is transparent when collapsed and animates a background/border in as
   * it expands. Defaults to true.
   */
  background?: boolean
  /** Accessible label for the toggle/search button. Defaults to "Search". */
  label?: string
}

function SearchInput({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSearch,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  collapseOnBlur = true,
  expandedWidth = "16rem",
  background = true,
  label = "Search",
  placeholder = "Search…",
  className,
  disabled,
  onKeyDown,
  ...props
}: SearchInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Support both controlled and uncontrolled `value`.
  const isValueControlled = valueProp !== undefined
  const [valueState, setValueState] = React.useState(defaultValue)
  const value = isValueControlled ? valueProp : valueState

  const setValue = (next: string) => {
    if (!isValueControlled) setValueState(next)
    onValueChange?.(next)
  }

  // Support both controlled and uncontrolled `expanded`.
  const isExpandedControlled = expandedProp !== undefined
  const [expandedState, setExpandedState] = React.useState(defaultExpanded)
  const expanded = isExpandedControlled ? expandedProp : expandedState

  const setExpanded = (next: boolean) => {
    if (!isExpandedControlled) setExpandedState(next)
    onExpandedChange?.(next)
  }

  const handleToggle = () => {
    if (disabled) return
    if (expanded) {
      // When already open, the icon acts as a submit affordance.
      onSearch?.(value)
      inputRef.current?.focus()
    } else {
      setExpanded(true)
      // Focus once the field has expanded enough to be interactive.
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    if (event.key === "Enter") {
      event.preventDefault()
      onSearch?.(value)
    } else if (event.key === "Escape") {
      if (value) {
        setValue("")
      } else {
        setExpanded(false)
        inputRef.current?.blur()
      }
    }
  }

  const handleBlur = () => {
    if (collapseOnBlur && !value) setExpanded(false)
  }

  const handleClear = () => {
    setValue("")
    inputRef.current?.focus()
  }

  return (
    <div
      data-slot="search-input"
      data-expanded={expanded || undefined}
      style={{
        width: expanded
          ? typeof expandedWidth === "number"
            ? `${expandedWidth}px`
            : expandedWidth
          : "2.25rem",
      }}
      className={cn(
        // Border width stays constant (1px) so only its color animates — this
        // keeps the layout from shifting when the fill fades in on expansion.
        // `transform-gpu` (translateZ(0)) promotes the pill to its own
        // compositor layer so the whole element repaints as it animates; without
        // it Chrome under-invalidates when the field collapses and leaves a faint
        // 1px ghost of the expanded box's bottom border behind.
        "group/search relative inline-flex h-9 transform-gpu items-center rounded-full bg-transparent text-sm transition-[width,background-color] duration-300 ease-out",
        (background || expanded) && "bg-input-background",
        expanded && "focus-within:ring-[3px] focus-within:ring-ring/50",
        disabled && "pointer-events-none opacity-50",
        className
      )}
    >
      {/* Search icon button. Centered when collapsed; slides to the left edge
          as the container expands because it is the first flex child. */}
      <button
        type="button"
        data-slot="search-input-trigger"
        onClick={handleToggle}
        disabled={disabled}
        aria-label={label}
        aria-expanded={expanded}
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors",
          "hover:text-foreground focus-visible:text-foreground",
          !expanded && "focus-visible:ring-[3px] focus-visible:ring-ring/50"
        )}
      >
        <Search className="size-4" aria-hidden="true" />
      </button>

      <input
        ref={inputRef}
        type="text"
        data-slot="search-input-field"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        tabIndex={expanded ? undefined : -1}
        aria-hidden={!expanded}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={cn(
          "h-full min-w-0 flex-1 bg-transparent pr-1 text-foreground outline-none placeholder:text-muted-foreground",
          // Collapse the field to zero width when closed so it can't be tabbed
          // into and doesn't reserve space.
          !expanded && "pointer-events-none w-0 flex-none opacity-0"
        )}
        {...props}
      />

      {expanded && value ? (
        <button
          type="button"
          data-slot="search-input-clear"
          onClick={handleClear}
          aria-label="Clear search"
          className={cn(
            "mr-1.5 flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors",
            "hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
          )}
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  )
}

export { SearchInput, type SearchInputProps }

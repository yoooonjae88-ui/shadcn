"use client"

import * as React from "react"
import { Combobox } from "@base-ui/react/combobox"
import { CheckIcon, LoaderCircleIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface MultiSelectOption {
  /** Unique identifier, shown in the second column (e.g. a user id). */
  value: string
  /** Primary text, shown in the first column (e.g. a name). */
  label: string
  /** Overrides `value` as the second column's text. */
  detail?: string
  /** Shown in the third column (e.g. an org or email domain). */
  domain?: string
  disabled?: boolean
}

interface MultiSelectProps<T extends MultiSelectOption> {
  /**
   * Called (debounced) whenever the user types. Fetch matching options from
   * your API here and return them; the popup list updates with the result.
   * `signal` aborts when a newer search supersedes this one — pass it to
   * `fetch` so stale responses are dropped.
   */
  onSearch: (query: string, signal: AbortSignal) => Promise<T[]>
  /** Selected options (controlled). */
  value?: T[]
  /** Initially selected options (uncontrolled). */
  defaultValue?: T[]
  /** Fired with the full option objects whenever the selection changes. */
  onValueChange?: (value: T[]) => void
  /** Debounce applied to typing before `onSearch` fires, in ms. Defaults to 300. */
  searchDelay?: number
  /** Header labels for the columns (e.g. `["Name", "User ID", "Domain"]`). Omit to hide the header row. */
  columns?: [string, string] | [string, string, string]
  /** Hide the second column entirely. */
  hideDetailColumn?: boolean
  /** Hide the third (domain) column entirely. */
  hideDomainColumn?: boolean
  /**
   * Render selected chips as "Name (userid@domain)" instead of just the name.
   * Defaults to false (name only).
   */
  chipDetail?: boolean
  /** Close the popup after selecting an item. Defaults to false so several options can be picked in a row. */
  closeOnSelect?: boolean
  /** Message shown before the user has typed anything. */
  searchPrompt?: string
  /** Message shown when a search returns no options. */
  emptyMessage?: string
  /** Message shown when `onSearch` rejects. */
  errorMessage?: string
  /** Name for hidden form inputs (submits the selected option values). */
  name?: string
  id?: string
  placeholder?: string
  disabled?: boolean
  /** Class for the field the chips and text input sit in. */
  className?: string
  /** Class for the popup. */
  popupClassName?: string
}

function MultiSelect<T extends MultiSelectOption>({
  onSearch,
  value: valueProp,
  defaultValue,
  onValueChange,
  searchDelay = 300,
  columns,
  hideDetailColumn = false,
  hideDomainColumn = false,
  chipDetail = false,
  closeOnSelect = false,
  searchPrompt = "Type to search…",
  emptyMessage = "No results found.",
  errorMessage = "Something went wrong. Try again.",
  name,
  id,
  placeholder = "Search…",
  disabled,
  className,
  popupClassName,
}: MultiSelectProps<T>) {
  // Support both controlled and uncontrolled selection.
  const isControlled = valueProp !== undefined
  const [valueState, setValueState] = React.useState<T[]>(defaultValue ?? [])
  const selected = isControlled ? valueProp : valueState

  const [results, setResults] = React.useState<T[]>([])
  const [query, setQuery] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [failed, setFailed] = React.useState(false)

  // Refs so the debounced search closure always sees the latest values
  // without re-subscribing.
  const onSearchRef = React.useRef(onSearch)
  const selectedRef = React.useRef(selected)
  React.useEffect(() => {
    onSearchRef.current = onSearch
    selectedRef.current = selected
  })

  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortRef = React.useRef<AbortController | null>(null)

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      abortRef.current?.abort()
    }
  }, [])

  const setSelected = (next: T[]) => {
    if (!isControlled) setValueState(next)
    onValueChange?.(next)
  }

  // Selected options stay in the list even when the current search no longer
  // returns them, so their checkboxes remain visible and toggleable.
  const items = React.useMemo(() => {
    const merged = [...results]
    for (const option of selected) {
      if (!results.some((result) => result.value === option.value)) {
        merged.push(option)
      }
    }
    return merged
  }, [results, selected])

  const handleInputValueChange = (
    nextQuery: string,
    details: { reason: string }
  ) => {
    setQuery(nextQuery)

    // A new keystroke supersedes any in-flight or scheduled search.
    if (timerRef.current) clearTimeout(timerRef.current)
    abortRef.current?.abort()

    // Base UI clears the input after picking an item; keep current results.
    if (details.reason === "item-press") return

    const trimmed = nextQuery.trim()
    if (trimmed === "") {
      setResults(selectedRef.current)
      setLoading(false)
      setFailed(false)
      return
    }

    setLoading(true)
    setFailed(false)

    timerRef.current = setTimeout(async () => {
      const controller = new AbortController()
      abortRef.current = controller
      try {
        const options = await onSearchRef.current(trimmed, controller.signal)
        if (controller.signal.aborted) return
        setResults(options)
        setLoading(false)
      } catch (error) {
        if (
          controller.signal.aborted ||
          (error instanceof DOMException && error.name === "AbortError")
        ) {
          return
        }
        setResults([])
        setFailed(true)
        setLoading(false)
      }
    }, searchDelay)
  }

  const trimmedQuery = query.trim()

  const status = loading ? (
    <>
      <LoaderCircleIcon className="size-3.5 animate-spin" aria-hidden="true" />
      Searching…
    </>
  ) : failed ? (
    errorMessage
  ) : items.length === 0 ? (
    trimmedQuery === "" ? (
      searchPrompt
    ) : (
      emptyMessage
    )
  ) : null

  // Fixed template so the checkbox / label / detail / domain columns line up
  // across the header row and every item.
  const textColumns =
    (hideDetailColumn ? 0 : 1) + (hideDomainColumn ? 0 : 1)
  const rowGrid =
    textColumns === 2
      ? "grid grid-cols-[1rem_minmax(0,1.25fr)_minmax(0,0.9fr)_minmax(0,1fr)] items-center gap-x-3"
      : textColumns === 1
        ? "grid grid-cols-[1rem_minmax(0,1.25fr)_minmax(0,1fr)] items-center gap-x-3"
        : "grid grid-cols-[1rem_minmax(0,1fr)] items-center gap-x-3"

  // "Name (userid@domain)" — or just "Name" — for the selected chips.
  const chipLabel = (option: T) => {
    if (!chipDetail) return option.label
    const id = option.detail ?? option.value
    return `${option.label} (${option.domain ? `${id}@${option.domain}` : id})`
  }

  return (
    <Combobox.Root
      items={items}
      multiple
      filter={null}
      disabled={disabled}
      name={name}
      value={selected}
      isItemEqualToValue={(a: T, b: T) => a.value === b.value}
      itemToStringLabel={(option: T) => option.label}
      itemToStringValue={(option: T) => option.value}
      onValueChange={(next: T[], details) => {
        // Base UI clears the entire selection when Escape is pressed while
        // the popup is closed — too destructive for a multi select, so keep
        // Escape as close/clear-text only.
        if (details.reason === "escape-key") {
          details.cancel()
          return
        }
        selectedRef.current = next
        setSelected(next)
      }}
      onInputValueChange={handleInputValueChange}
      onOpenChange={(open, details) => {
        // Base UI closes the popup after picking an item while a search
        // query is typed; keep it open so several options can be selected
        // in a row.
        if (!open && details.reason === "item-press" && !closeOnSelect) {
          details.cancel()
        }
      }}
      onOpenChangeComplete={(open) => {
        if (!open) {
          // Reopening shows the current selection instead of stale results.
          setResults(selectedRef.current)
          setLoading(false)
          setFailed(false)
        }
      }}
    >
      <Combobox.InputGroup
        data-slot="multi-select"
        className={cn(
          "flex min-h-9 w-72 cursor-text flex-wrap items-center gap-1 rounded-lg bg-input-background px-2 py-1.5 text-sm transition-shadow",
          "focus-within:ring-3 focus-within:ring-ring/50",
          disabled && "pointer-events-none opacity-50",
          className
        )}
      >
        <Combobox.Chips className="flex w-full flex-wrap items-center gap-1">
          <Combobox.Value>
            {(current: T[]) => (
              <>
                {current.map((option) => (
                  <Combobox.Chip
                    key={option.value}
                    data-slot="multi-select-chip"
                    aria-label={chipLabel(option)}
                    className="flex h-6 cursor-default items-center gap-1 rounded-md bg-background py-0 pr-1 pl-2 text-sm shadow-xs outline-none data-highlighted:bg-primary data-highlighted:text-primary-foreground"
                  >
                    {chipLabel(option)}
                    <Combobox.ChipRemove
                      aria-label={`Remove ${option.label}`}
                      className="flex size-4 items-center justify-center rounded-sm text-muted-foreground outline-none hover:bg-muted hover:text-foreground"
                    >
                      <XIcon className="size-3" aria-hidden="true" />
                    </Combobox.ChipRemove>
                  </Combobox.Chip>
                ))}
                <Combobox.Input
                  id={id}
                  data-slot="multi-select-input"
                  placeholder={current.length > 0 ? "" : placeholder}
                  className="h-6 min-w-16 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                />
              </>
            )}
          </Combobox.Value>
        </Combobox.Chips>
      </Combobox.InputGroup>

      <Combobox.Portal>
        <Combobox.Positioner className="z-50 outline-none" sideOffset={4}>
          <Combobox.Popup
            data-slot="multi-select-popup"
            aria-busy={loading || undefined}
            className={cn(
              "w-[var(--anchor-width)] max-w-[var(--available-width)] origin-[var(--transform-origin)] rounded-lg bg-popover text-popover-foreground shadow-lg outline-none",
              "transition-[scale,opacity] duration-100 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
              popupClassName
            )}
          >
            <div className="max-h-[min(var(--available-height),20rem)] scroll-py-1 overflow-y-auto overscroll-contain p-1">
              {columns ? (
                <div
                  aria-hidden="true"
                  className={cn(
                    rowGrid,
                    "px-2 py-1.5 text-xs font-medium text-muted-foreground"
                  )}
                >
                  <span />
                  <span>{columns[0]}</span>
                  {!hideDetailColumn && <span>{columns[1]}</span>}
                  {!hideDomainColumn && (
                    <span>
                      {(columns as readonly string[])[hideDetailColumn ? 1 : 2]}
                    </span>
                  )}
                </div>
              ) : null}

              <Combobox.Status>
                {status ? (
                  <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground">
                    {status}
                  </div>
                ) : null}
              </Combobox.Status>

              <Combobox.List>
                {(option: T) => (
                  <Combobox.Item
                    key={option.value}
                    value={option}
                    disabled={option.disabled}
                    data-slot="multi-select-item"
                    className={cn(
                      rowGrid,
                      "group cursor-default rounded-md px-2 py-1.5 text-sm outline-none select-none",
                      "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
                      "data-disabled:pointer-events-none data-disabled:opacity-50"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="flex size-4 items-center justify-center rounded-sm bg-input-background transition-colors group-data-[selected]:bg-primary group-data-[selected]:text-primary-foreground"
                    >
                      <CheckIcon className="size-3 opacity-0 transition-opacity group-data-[selected]:opacity-100" />
                    </span>
                    <span className="truncate">{option.label}</span>
                    {!hideDetailColumn && (
                      <span className="truncate text-xs text-muted-foreground group-data-[highlighted]:text-accent-foreground/70">
                        {option.detail ?? option.value}
                      </span>
                    )}
                    {!hideDomainColumn && (
                      <span className="truncate text-xs text-muted-foreground group-data-[highlighted]:text-accent-foreground/70">
                        {option.domain}
                      </span>
                    )}
                  </Combobox.Item>
                )}
              </Combobox.List>
            </div>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  )
}

export { MultiSelect, type MultiSelectOption, type MultiSelectProps }

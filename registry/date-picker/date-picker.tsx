"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cva, type VariantProps } from "class-variance-authority"
import { CalendarDays, X } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Calendar, type CalendarProps } from "@/components/ui/calendar"

/* -------------------------------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------------------------------*/

export type DatePickerSize = "small" | "middle" | "large"
export type DatePickerVariant =
  | "outlined"
  | "filled"
  | "borderless"
  | "underlined"
export type DatePickerStatus = "error" | "warning"
export type DatePickerPlacement =
  | "bottomLeft"
  | "bottomRight"
  | "topLeft"
  | "topRight"

/** A shortcut button rendered beside the panel. */
export interface DatePickerPreset {
  label: React.ReactNode
  value: Date
}

export interface DateRangePickerPreset {
  label: React.ReactNode
  value: [Date, Date]
}

export type RangeValue = [Date | null, Date | null]

/* -------------------------------------------------------------------------------------------------
 * Date helpers
 * ------------------------------------------------------------------------------------------------*/

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

const DEFAULT_FORMAT = "YYYY-MM-DD"

const pad = (n: number) => String(n).padStart(2, "0")

/** Strip the time part so two dates for the same day always compare equal. */
function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false
  return startOfDay(a).getTime() === startOfDay(b).getTime()
}

/** Format a Date with a dayjs-style token string (the subset the picker uses). */
function formatDate(date: Date, format: string = DEFAULT_FORMAT): string {
  const year = date.getFullYear()
  const month = date.getMonth()
  const map: Record<string, string> = {
    YYYY: String(year).padStart(4, "0"),
    YY: pad(year % 100),
    MMMM: MONTH_NAMES[month],
    MMM: MONTH_NAMES[month].slice(0, 3),
    MM: pad(month + 1),
    M: String(month + 1),
    DD: pad(date.getDate()),
    D: String(date.getDate()),
    dddd: DAY_NAMES[date.getDay()],
    ddd: DAY_NAMES[date.getDay()].slice(0, 3),
  }
  // Longest tokens first so `MMMM` isn't consumed as `MMM` + `M`.
  return format.replace(/YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|ddd/g, (t) => map[t] ?? t)
}

/**
 * The order the year / month / day fields appear in a format string, so typed
 * input can be read back in the same order the value is displayed.
 */
function fieldOrder(format: string): ("y" | "m" | "d")[] {
  const order: ("y" | "m" | "d")[] = []
  for (const char of format) {
    const field = char === "Y" ? "y" : char === "M" ? "m" : char === "D" ? "d" : null
    if (field && !order.includes(field)) order.push(field)
  }
  return order.length > 0 ? order : ["y", "m", "d"]
}

/**
 * Leniently parse a typed string into a Date, reading the numbers in the order
 * the format declares and falling back to `base` for fields left out. Returns
 * null when the text can't be read as a real date.
 */
function parseDateString(
  raw: string,
  opts: { format: string; base: Date | null }
): Date | null {
  const str = raw.trim()
  if (!str) return null

  const order = fieldOrder(opts.format)
  const fallback = opts.base ?? new Date()

  // A month spelled out (`Mar`, `March`) is taken out of the running before the
  // remaining numbers are assigned, so `12 March 2026` reads correctly.
  const lower = str.toLowerCase()
  const namedMonth = MONTH_NAMES.findIndex((name) =>
    lower.includes(name.slice(0, 3).toLowerCase())
  )

  const numbers = str.match(/\d+/g)?.map(Number) ?? []
  const remaining = namedMonth >= 0 ? order.filter((f) => f !== "m") : order
  if (numbers.length === 0) return null

  const fields: Partial<Record<"y" | "m" | "d", number>> = {}
  if (namedMonth >= 0) fields.m = namedMonth
  remaining.forEach((field, index) => {
    const n = numbers[index]
    if (n === undefined) return
    fields[field] = field === "m" ? n - 1 : n
  })

  const typedYear = fields.y
  const year =
    typedYear === undefined
      ? fallback.getFullYear()
      : // A two-digit year is read as 20xx, matching what people type.
        typedYear < 100
        ? typedYear + 2000
        : typedYear
  const month = fields.m ?? fallback.getMonth()
  const day = fields.d ?? fallback.getDate()

  const parsed = new Date(year, month, day)
  parsed.setHours(0, 0, 0, 0)
  // Reject overflow (e.g. 31 February rolling into March).
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month ||
    parsed.getDate() !== day
  ) {
    return null
  }
  return parsed
}

function placementToSide(placement: DatePickerPlacement): {
  side: "top" | "bottom"
  align: "start" | "end"
} {
  switch (placement) {
    case "bottomRight":
      return { side: "bottom", align: "end" }
    case "topLeft":
      return { side: "top", align: "start" }
    case "topRight":
      return { side: "top", align: "end" }
    case "bottomLeft":
    default:
      return { side: "bottom", align: "start" }
  }
}

/**
 * Combine `disabledDate` / `minDate` / `maxDate` into the single predicate
 * DayPicker takes for its `disabled` matcher.
 */
function useDisabledMatcher(
  disabledDate: ((date: Date) => boolean) | undefined,
  minDate: Date | undefined,
  maxDate: Date | undefined
) {
  const minTime = minDate ? startOfDay(minDate).getTime() : null
  const maxTime = maxDate ? startOfDay(maxDate).getTime() : null

  return React.useCallback(
    (date: Date) => {
      const time = startOfDay(date).getTime()
      if (minTime !== null && time < minTime) return true
      if (maxTime !== null && time > maxTime) return true
      return disabledDate?.(date) ?? false
    },
    [disabledDate, minTime, maxTime]
  )
}

/* -------------------------------------------------------------------------------------------------
 * Input frame (shared with the range picker)
 * ------------------------------------------------------------------------------------------------*/

const fieldFrameVariants = cva(
  "relative inline-flex min-w-0 cursor-text items-center gap-1.5 border border-transparent bg-clip-padding text-foreground transition-[color,background-color,border-color,box-shadow] outline-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        outlined:
          "border-input hover:border-ring/70 data-open:border-ring data-open:ring-3 data-open:ring-ring/50",
        filled:
          "bg-input-background data-open:border-ring data-open:ring-3 data-open:ring-ring/50",
        borderless: "bg-transparent",
        underlined:
          "border-b-input hover:border-b-ring/70 data-open:border-b-ring rounded-none px-0",
      },
      size: {
        small:
          "h-6 gap-1 rounded-md px-2 text-sm [&_svg:not([class*='size-'])]:size-3.5",
        middle:
          "h-8 rounded-lg px-2.5 text-sm [&_svg:not([class*='size-'])]:size-4",
        large:
          "h-10 rounded-lg px-3 text-base [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: { variant: "outlined", size: "middle" },
  }
)

function statusClasses(
  variant: DatePickerVariant,
  status?: DatePickerStatus
): string | null {
  if (!status) return null
  const error = status === "error"
  switch (variant) {
    case "outlined":
      return error
        ? "border-destructive hover:border-destructive data-open:border-destructive data-open:ring-destructive/20"
        : "border-input-warning hover:border-input-warning data-open:border-input-warning data-open:ring-input-warning/20"
    case "filled":
      return error
        ? "bg-destructive/10 data-open:border-destructive data-open:ring-destructive/20"
        : "bg-input-warning/10 data-open:border-input-warning data-open:ring-input-warning/20"
    case "underlined":
      return error
        ? "border-b-destructive hover:border-b-destructive data-open:border-b-destructive"
        : "border-b-input-warning hover:border-b-input-warning data-open:border-b-input-warning"
    case "borderless":
      return error ? "text-destructive" : "text-input-warning"
  }
}

const fieldInputClasses =
  "h-full w-full min-w-0 flex-1 bg-transparent text-inherit outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"

// Trailing adornment shared by both pickers: the clear button when there is
// something to clear, otherwise the (customisable) calendar icon.
function FieldSuffix({
  showClear,
  clearIcon,
  suffixIcon,
  onClear,
}: {
  showClear: boolean
  clearIcon: React.ReactNode
  suffixIcon: React.ReactNode
  onClear: (e: React.MouseEvent) => void
}) {
  return showClear ? (
    <button
      type="button"
      tabIndex={-1}
      aria-label="Clear"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={onClear}
      className="flex shrink-0 items-center text-muted-foreground transition-colors hover:text-foreground"
    >
      {clearIcon ?? <X />}
    </button>
  ) : (
    <span className="flex shrink-0 items-center text-muted-foreground">
      {suffixIcon ?? <CalendarDays />}
    </span>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Panel chrome
 * ------------------------------------------------------------------------------------------------*/

const popupClasses =
  "z-50 origin-[var(--transform-origin)] overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md outline-none transition-[transform,opacity] data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0"

function PresetList({
  presets,
  isActive,
  onPick,
}: {
  presets: { label: React.ReactNode }[]
  isActive: (index: number) => boolean
  onPick: (index: number) => void
}) {
  return (
    <div className="flex max-h-80 w-32 shrink-0 flex-col gap-0.5 overflow-y-auto bg-muted/40 p-2">
      {presets.map((preset, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onPick(index)}
          className={cn(
            "rounded-md px-2 py-1 text-left text-sm transition-colors",
            isActive(index)
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {preset.label}
        </button>
      ))}
    </div>
  )
}

function PanelFooter({
  shortcutLabel,
  onShortcut,
  extra,
}: {
  shortcutLabel?: string
  onShortcut?: () => void
  extra?: React.ReactNode
}) {
  if (!shortcutLabel && extra == null) return null
  return (
    <>
      {extra != null && (
        <>
          <div className="h-px bg-border" />
          <div className="px-3 py-2 text-sm">{extra}</div>
        </>
      )}
      {shortcutLabel && (
        <>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-center px-3 py-2">
            <button
              type="button"
              onClick={onShortcut}
              className="text-sm text-primary transition-colors hover:text-primary/80"
            >
              {shortcutLabel}
            </button>
          </div>
        </>
      )}
    </>
  )
}

/* -------------------------------------------------------------------------------------------------
 * DatePicker (single)
 * ------------------------------------------------------------------------------------------------*/

/** Panel props both pickers hand straight through to the calendar. */
interface SharedPanelProps {
  /** `label` (default) or `dropdown` month & year selects in the panel header. */
  captionLayout?: CalendarProps["captionLayout"]
  /** Show the ISO week number column. */
  showWeekNumber?: boolean
  /** Months shown side by side. Defaults to 1 (2 for the range picker). */
  numberOfMonths?: number
  /** Dates that cannot be picked. */
  disabledDate?: (date: Date) => boolean
  /** Earliest selectable date (inclusive). */
  minDate?: Date
  /** Latest selectable date (inclusive). */
  maxDate?: Date
}

export interface DatePickerProps
  extends SharedPanelProps,
    VariantProps<typeof fieldFrameVariants> {
  /** Controlled value. */
  value?: Date | null
  /** Uncontrolled initial value. */
  defaultValue?: Date | null
  /** Fires with the new value and its formatted string. */
  onChange?: (value: Date | null, dateString: string) => void
  /** Fires when the clear button is pressed. */
  onClear?: () => void
  /** dayjs-style token string. Defaults to `YYYY-MM-DD`. */
  format?: string
  disabled?: boolean
  /** `true`, or `{ clearIcon }` to customise. `false` hides the clear button. */
  allowClear?: boolean | { clearIcon?: React.ReactNode }
  placeholder?: string
  /** Controlled open state. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Where the panel pops up relative to the input. */
  placement?: DatePickerPlacement
  /** Validation status colouring. */
  status?: DatePickerStatus
  /** Node rendered at the start of the input. */
  prefix?: React.ReactNode
  /** Replaces the trailing calendar icon. */
  suffixIcon?: React.ReactNode
  /** Make the input non-typeable (panel selection only). */
  inputReadOnly?: boolean
  /** Shortcut buttons listed beside the panel. */
  presets?: DatePickerPreset[]
  /** Show the "Today" shortcut in the footer. Defaults to `true`. */
  showToday?: boolean
  /** Render extra content in the panel footer. */
  renderExtraFooter?: () => React.ReactNode
  autoFocus?: boolean
  /** Submitted with the enclosing form (formatted string). */
  name?: string
  id?: string
  className?: string
  /** Class applied to the popup panel. */
  popupClassName?: string
  todayText?: string
}

function DatePicker({
  value: valueProp,
  defaultValue = null,
  onChange,
  onClear,
  format = DEFAULT_FORMAT,
  disabledDate,
  minDate,
  maxDate,
  disabled,
  allowClear = true,
  placeholder = "Select date",
  open: openProp,
  onOpenChange,
  placement = "bottomLeft",
  status,
  prefix,
  suffixIcon,
  inputReadOnly,
  captionLayout = "label",
  showWeekNumber,
  numberOfMonths = 1,
  presets,
  showToday = true,
  renderExtraFooter,
  autoFocus,
  name,
  id,
  variant = "outlined",
  size = "middle",
  className,
  popupClassName,
  todayText = "Today",
}: DatePickerProps) {
  // Controlled / uncontrolled value.
  const [valueState, setValueState] = React.useState<Date | null>(defaultValue)
  const value = valueProp !== undefined ? valueProp : valueState

  // Controlled / uncontrolled open.
  const [openState, setOpenState] = React.useState(false)
  const open = openProp !== undefined ? openProp : openState
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOpenState(next)
      onOpenChange?.(next)
    },
    [openProp, onOpenChange]
  )

  const inputRef = React.useRef<HTMLInputElement>(null)
  const typingRef = React.useRef(false)
  const [text, setText] = React.useState("")
  const [month, setMonth] = React.useState<Date>(value ?? new Date())

  // Re-seed the visible month from the committed value whenever the panel
  // opens. Done as a render-time state adjustment (not an effect) so it applies
  // before paint without a cascading render — the "reset on prop change" pattern.
  const [prevOpen, setPrevOpen] = React.useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open && value) setMonth(value)
  }

  // Keep the input text in sync with the value unless the user is typing.
  React.useEffect(() => {
    if (typingRef.current) return
    setText(value ? formatDate(value, format) : "")
  }, [value, format])

  React.useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  const isDisabledDate = useDisabledMatcher(disabledDate, minDate, maxDate)

  const commit = React.useCallback(
    (next: Date | null) => {
      typingRef.current = false
      if (valueProp === undefined) setValueState(next)
      onChange?.(next, next ? formatDate(next, format) : "")
    },
    [valueProp, onChange, format]
  )

  function handleOpenChange(next: boolean) {
    if (disabled) return
    setOpen(next)
  }

  function handleSelect(next: Date | undefined) {
    if (!next) return
    commit(startOfDay(next))
    setOpen(false)
  }

  function handleToday() {
    const today = startOfDay(new Date())
    setMonth(today)
    if (isDisabledDate(today)) return
    commit(today)
    setOpen(false)
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation()
    commit(null)
    onClear?.()
  }

  function commitText() {
    const parsed = parseDateString(text, { format, base: value })
    if (parsed && !isDisabledDate(parsed)) {
      setMonth(parsed)
      commit(parsed)
    } else if (text.trim() === "") {
      commit(null)
    } else {
      // Unparseable or disabled — revert to the current value.
      typingRef.current = false
      setText(value ? formatDate(value, format) : "")
    }
  }

  const clearIcon =
    allowClear && typeof allowClear === "object" ? allowClear.clearIcon : null
  const showClear = Boolean(allowClear) && Boolean(value) && !disabled
  const { side, align } = placementToSide(placement)
  const extra = renderExtraFooter?.()

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger
        data-slot="date-picker-trigger"
        disabled={disabled}
        nativeButton={false}
        render={
          <div
            data-disabled={disabled ? "" : undefined}
            className={cn(
              fieldFrameVariants({ variant, size }),
              statusClasses(variant ?? "outlined", status),
              "w-44",
              disabled && "cursor-not-allowed opacity-60",
              className
            )}
          >
            {prefix != null && (
              <span className="flex shrink-0 items-center text-muted-foreground">
                {prefix}
              </span>
            )}
            <input
              ref={inputRef}
              id={id}
              type="text"
              disabled={disabled}
              readOnly={inputReadOnly}
              placeholder={placeholder}
              value={text}
              aria-label={placeholder}
              className={fieldInputClasses}
              onPointerDown={(e) => {
                // Open on pointer-down rather than focus: closing the panel
                // restores focus to this field, and a focus-based open would
                // immediately reopen it after picking a day or clicking away.
                e.stopPropagation()
                if (!disabled) setOpen(true)
              }}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                typingRef.current = true
                setText(e.target.value)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  commitText()
                  setOpen(false)
                } else if (
                  !open &&
                  (e.key === "ArrowDown" || e.key === "ArrowUp")
                ) {
                  setOpen(true)
                }
              }}
              onBlur={() => {
                if (typingRef.current) commitText()
              }}
            />
            <FieldSuffix
              showClear={showClear}
              clearIcon={clearIcon}
              suffixIcon={suffixIcon}
              onClear={handleClear}
            />
            {name && (
              <input
                type="hidden"
                name={name}
                value={value ? formatDate(value, format) : ""}
              />
            )}
          </div>
        }
      />
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          side={side}
          align={align}
          sideOffset={6}
          className="z-50"
        >
          <PopoverPrimitive.Popup
            data-slot="date-picker-content"
            // Keep focus in the input on a pointer open so typing keeps working;
            // a keyboard open hands focus to the calendar for arrow navigation.
            initialFocus={(openType) => openType === "keyboard"}
            className={cn(popupClasses, popupClassName)}
          >
            <div className="flex">
              {presets && presets.length > 0 && (
                <PresetList
                  presets={presets}
                  isActive={(index) => isSameDay(presets[index].value, value)}
                  onPick={(index) => {
                    const picked = startOfDay(presets[index].value)
                    setMonth(picked)
                    commit(picked)
                    setOpen(false)
                  }}
                />
              )}
              <div className="flex flex-col">
                <Calendar
                  mode="single"
                  selected={value ?? undefined}
                  onSelect={handleSelect}
                  month={month}
                  onMonthChange={setMonth}
                  disabled={isDisabledDate}
                  captionLayout={captionLayout}
                  showWeekNumber={showWeekNumber}
                  numberOfMonths={numberOfMonths}
                  startMonth={minDate}
                  endMonth={maxDate}
                />
                <PanelFooter
                  shortcutLabel={showToday ? todayText : undefined}
                  onShortcut={handleToday}
                  extra={extra}
                />
              </div>
            </div>
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

/* -------------------------------------------------------------------------------------------------
 * RangePicker
 * ------------------------------------------------------------------------------------------------*/

export interface DateRangePickerProps
  extends SharedPanelProps,
    VariantProps<typeof fieldFrameVariants> {
  value?: RangeValue
  defaultValue?: RangeValue
  onChange?: (value: RangeValue, dateStrings: [string, string]) => void
  onClear?: () => void
  format?: string
  disabled?: boolean
  allowClear?: boolean | { clearIcon?: React.ReactNode }
  /** `[start, end]` placeholders. */
  placeholder?: [string, string]
  open?: boolean
  onOpenChange?: (open: boolean) => void
  placement?: DatePickerPlacement
  status?: DatePickerStatus
  suffixIcon?: React.ReactNode
  inputReadOnly?: boolean
  /** Shortcut buttons listed beside the panel. */
  presets?: DateRangePickerPreset[]
  renderExtraFooter?: () => React.ReactNode
  /** Sort the two ends so start <= end on commit. Defaults to `true`. */
  order?: boolean
  /** Node placed between the two inputs. */
  separator?: React.ReactNode
  name?: string
  id?: string
  className?: string
  popupClassName?: string
}

function DateRangePicker({
  value: valueProp,
  defaultValue = [null, null],
  onChange,
  onClear,
  format = DEFAULT_FORMAT,
  disabledDate,
  minDate,
  maxDate,
  disabled,
  allowClear = true,
  placeholder = ["Start date", "End date"],
  open: openProp,
  onOpenChange,
  placement = "bottomLeft",
  status,
  suffixIcon,
  inputReadOnly,
  captionLayout = "label",
  showWeekNumber,
  numberOfMonths = 2,
  presets,
  renderExtraFooter,
  order = true,
  separator,
  name,
  id,
  variant = "outlined",
  size = "middle",
  className,
  popupClassName,
}: DateRangePickerProps) {
  const [valueState, setValueState] = React.useState<RangeValue>(defaultValue)
  const value = valueProp !== undefined ? valueProp : valueState

  const [openState, setOpenState] = React.useState(false)
  const open = openProp !== undefined ? openProp : openState
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOpenState(next)
      onOpenChange?.(next)
    },
    [openProp, onOpenChange]
  )

  // The range being built while the panel is open. It only becomes the value
  // once both ends are picked, so a half-finished range never escapes.
  const [pending, setPending] = React.useState<RangeValue>(value)
  const [active, setActive] = React.useState<0 | 1>(0)
  const [hovered, setHovered] = React.useState<Date | null>(null)
  const typingRef = React.useRef(false)
  const [texts, setTexts] = React.useState<[string, string]>(["", ""])
  const [month, setMonth] = React.useState<Date>(value[0] ?? new Date())

  // Re-seed the pending range and visible month from the committed value
  // whenever the panel opens (a render-time state adjustment, as above), and
  // drop the hover preview when it closes.
  const [prevOpen, setPrevOpen] = React.useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      setPending(value)
      if (value[0]) setMonth(value[0])
    } else {
      setHovered(null)
    }
  }

  // While the panel is open the inputs preview the pending range; closed, they
  // show the committed value. Skipped mid-typing so we don't fight the user.
  React.useEffect(() => {
    if (typingRef.current) return
    const src = open ? pending : value
    setTexts([
      src[0] ? formatDate(src[0], format) : "",
      src[1] ? formatDate(src[1], format) : "",
    ])
  }, [value, pending, open, format])

  const isDisabledDate = useDisabledMatcher(disabledDate, minDate, maxDate)

  const commit = React.useCallback(
    (next: RangeValue) => {
      typingRef.current = false
      const ordered: RangeValue =
        order && next[0] && next[1] && next[0].getTime() > next[1].getTime()
          ? [next[1], next[0]]
          : next
      if (valueProp === undefined) setValueState(ordered)
      onChange?.(ordered, [
        ordered[0] ? formatDate(ordered[0], format) : "",
        ordered[1] ? formatDate(ordered[1], format) : "",
      ])
    },
    [valueProp, onChange, format, order]
  )

  function handleOpenChange(next: boolean) {
    if (disabled) return
    setOpen(next)
  }

  // Selection is driven from `onDayClick` rather than DayPicker's own range
  // logic so the click lands on whichever end the user focused. The no-op
  // `onSelect` is what makes DayPicker treat `selected` as controlled — without
  // it the calendar keeps its own copy and ignores ours.
  function handleDayClick(day: Date) {
    const picked = startOfDay(day)
    typingRef.current = false
    setHovered(null)

    if (active === 0) {
      // Picking a start after the current end restarts the range.
      const end = pending[1] && pending[1]! >= picked ? pending[1] : null
      setPending([picked, end])
      if (end) {
        commit([picked, end])
        setOpen(false)
      } else {
        setActive(1)
      }
      return
    }

    const start = pending[0]
    if (!start || picked < startOfDay(start)) {
      // An end before the start is treated as the start of a fresh range.
      setPending([picked, null])
      setActive(1)
      return
    }
    setPending([start, picked])
    commit([start, picked])
    setOpen(false)
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation()
    setPending([null, null])
    setActive(0)
    commit([null, null])
    onClear?.()
  }

  function commitText(index: 0 | 1) {
    const parsed = parseDateString(texts[index], {
      format,
      base: value[index],
    })
    const next: RangeValue = [...pending] as RangeValue

    if (parsed && !isDisabledDate(parsed)) {
      next[index] = parsed
      setMonth(parsed)
    } else if (texts[index].trim() === "") {
      next[index] = null
    } else {
      typingRef.current = false
      setTexts((prev) => {
        const copy = [...prev] as [string, string]
        const current = value[index]
        copy[index] = current ? formatDate(current, format) : ""
        return copy
      })
      return
    }

    setPending(next)
    commit(next)
  }

  // The range handed to the calendar: the pending selection, extended to the
  // hovered day so the user sees the span they're about to pick.
  const [pendingStart, pendingEnd] = pending
  const preview: DateRange | undefined = React.useMemo(() => {
    if (!pendingStart && !pendingEnd) return undefined
    if (pendingStart && !pendingEnd && hovered && hovered > pendingStart) {
      return { from: pendingStart, to: hovered }
    }
    return { from: pendingStart ?? undefined, to: pendingEnd ?? undefined }
  }, [pendingStart, pendingEnd, hovered])

  const showClear =
    Boolean(allowClear) && Boolean(value[0] || value[1]) && !disabled
  const clearIcon =
    allowClear && typeof allowClear === "object" ? allowClear.clearIcon : null
  const { side, align } = placementToSide(placement)
  const extra = renderExtraFooter?.()

  const renderField = (index: 0 | 1) => (
    <span className="relative flex h-full min-w-0 flex-1 items-center">
      <input
        id={index === 0 ? id : undefined}
        type="text"
        disabled={disabled}
        readOnly={inputReadOnly}
        placeholder={placeholder[index]}
        value={texts[index]}
        aria-label={placeholder[index]}
        className={cn(fieldInputClasses, "text-center")}
        onPointerDown={(e) => {
          // Open on pointer-down (not focus) so restoring focus on close doesn't
          // immediately reopen the panel. Pointer-down also selects which end
          // (start / end) the next day click fills in.
          e.stopPropagation()
          if (disabled) return
          setActive(index)
          setOpen(true)
        }}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          typingRef.current = true
          setTexts((prev) => {
            const copy = [...prev] as [string, string]
            copy[index] = e.target.value
            return copy
          })
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            commitText(index)
          } else if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
            setActive(index)
            setOpen(true)
          }
        }}
        onBlur={() => {
          if (typingRef.current) commitText(index)
        }}
      />
      {open && active === index && (
        <span className="pointer-events-none absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />
      )}
    </span>
  )

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger
        data-slot="date-range-picker-trigger"
        disabled={disabled}
        nativeButton={false}
        render={
          <div
            data-disabled={disabled ? "" : undefined}
            className={cn(
              fieldFrameVariants({ variant, size }),
              statusClasses(variant ?? "outlined", status),
              "w-72",
              disabled && "cursor-not-allowed opacity-60",
              className
            )}
          >
            {renderField(0)}
            <span className="shrink-0 px-1 text-muted-foreground">
              {separator ?? "→"}
            </span>
            {renderField(1)}
            <FieldSuffix
              showClear={showClear}
              clearIcon={clearIcon}
              suffixIcon={suffixIcon}
              onClear={handleClear}
            />
            {name && (
              <>
                <input
                  type="hidden"
                  name={`${name}-start`}
                  value={value[0] ? formatDate(value[0], format) : ""}
                />
                <input
                  type="hidden"
                  name={`${name}-end`}
                  value={value[1] ? formatDate(value[1], format) : ""}
                />
              </>
            )}
          </div>
        }
      />
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          side={side}
          align={align}
          sideOffset={6}
          className="z-50"
        >
          <PopoverPrimitive.Popup
            data-slot="date-range-picker-content"
            // Keep focus in the inputs on a pointer open so typing keeps working;
            // a keyboard open hands focus to the calendar for arrow navigation.
            initialFocus={(openType) => openType === "keyboard"}
            className={cn(popupClasses, popupClassName)}
          >
            <div className="flex">
              {presets && presets.length > 0 && (
                <PresetList
                  presets={presets}
                  isActive={(index) =>
                    isSameDay(presets[index].value[0], value[0]) &&
                    isSameDay(presets[index].value[1], value[1])
                  }
                  onPick={(index) => {
                    const [from, to] = presets[index].value
                    const picked: RangeValue = [startOfDay(from), startOfDay(to)]
                    setPending(picked)
                    setMonth(picked[0]!)
                    commit(picked)
                    setOpen(false)
                  }}
                />
              )}
              <div className="flex flex-col">
                <Calendar
                  mode="range"
                  selected={preview}
                  onSelect={() => {}}
                  onDayClick={handleDayClick}
                  onDayMouseEnter={(day) => setHovered(startOfDay(day))}
                  onDayMouseLeave={() => setHovered(null)}
                  month={month}
                  onMonthChange={setMonth}
                  disabled={isDisabledDate}
                  captionLayout={captionLayout}
                  showWeekNumber={showWeekNumber}
                  numberOfMonths={numberOfMonths}
                  startMonth={minDate}
                  endMonth={maxDate}
                />
                <PanelFooter extra={extra} />
              </div>
            </div>
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

DatePicker.RangePicker = DateRangePicker

export { DatePicker, DateRangePicker, formatDate, parseDateString }

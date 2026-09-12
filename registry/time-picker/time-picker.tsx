"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cva, type VariantProps } from "class-variance-authority"
import { Clock, X } from "lucide-react"

import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------------------------------*/

export type TimePickerSize = "small" | "middle" | "large"
export type TimePickerVariant =
  | "outlined"
  | "filled"
  | "borderless"
  | "underlined"
export type TimePickerStatus = "error" | "warning"
export type TimePickerPlacement =
  | "bottomLeft"
  | "bottomRight"
  | "topLeft"
  | "topRight"

/** Times that cannot be selected, evaluated against the value being edited. */
export interface DisabledTimes {
  disabledHours?: () => number[]
  disabledMinutes?: (selectedHour: number) => number[]
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[]
}
export type DisabledTime = (now: Date | null) => DisabledTimes
/** For the range picker, `type` says which end is being edited. */
export type RangeDisabledTime = (
  now: Date | null,
  type: "start" | "end"
) => DisabledTimes

type CellSubType = "hour" | "minute" | "second" | "meridiem"
export interface CellRenderInfo {
  /** The default node the picker would render for this cell. */
  originNode: React.ReactNode
  /** Which column this cell belongs to. */
  subType: CellSubType
  /** The underlying numeric value (or "AM"/"PM" for the meridiem column). */
  value: number | string
}
export type CellRender = (
  value: number | string,
  info: CellRenderInfo
) => React.ReactNode

/* -------------------------------------------------------------------------------------------------
 * Time helpers
 * ------------------------------------------------------------------------------------------------*/

const pad = (n: number) => String(n).padStart(2, "0")

function zeroToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

/** Resolve the effective format string given `format` / `use12Hours`. */
function resolveFormat(format: string | undefined, use12: boolean): string {
  if (format) return format
  return use12 ? "h:mm:ss A" : "HH:mm:ss"
}

/** Whether the picker runs in 12-hour mode, inferred from props + format. */
function resolve12Hours(
  use12Hours: boolean | undefined,
  format: string | undefined
): boolean {
  if (use12Hours !== undefined) return use12Hours
  if (!format) return false
  return /[aA]/.test(format) || /h/.test(format)
}

function getShowUnits(format: string) {
  return {
    hour: /[hH]/.test(format),
    minute: /m/.test(format),
    second: /s/.test(format),
  }
}

/** Format a Date with a dayjs-style token string (the subset the panel uses). */
function formatTime(date: Date, format: string): string {
  const h24 = date.getHours()
  const m = date.getMinutes()
  const s = date.getSeconds()
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  const map: Record<string, string> = {
    HH: pad(h24),
    H: String(h24),
    hh: pad(h12),
    h: String(h12),
    mm: pad(m),
    m: String(m),
    ss: pad(s),
    s: String(s),
    A: h24 < 12 ? "AM" : "PM",
    a: h24 < 12 ? "am" : "pm",
  }
  return format.replace(/HH|H|hh|h|mm|m|ss|s|A|a/g, (t) => map[t] ?? t)
}

/**
 * Leniently parse a typed string back into a Date, using the previous value's
 * date part. Returns null when nothing usable can be read.
 */
function parseTimeString(
  raw: string,
  opts: { is12: boolean; base: Date | null }
): Date | null {
  const str = raw.trim()
  if (!str) return null
  const nums = str.match(/\d+/g)
  if (!nums) return null
  let [h, m = 0, s = 0] = nums.slice(0, 3).map(Number)
  if (Number.isNaN(h)) return null
  const isPM = /p/i.test(str)
  const isAM = /a/i.test(str)
  if (opts.is12 || isPM || isAM) {
    h = h % 12
    if (isPM) h += 12
  }
  h = Math.min(23, Math.max(0, h))
  m = Math.min(59, Math.max(0, m || 0))
  s = Math.min(59, Math.max(0, s || 0))
  const d = opts.base ? new Date(opts.base) : zeroToday()
  d.setHours(h, m, s, 0)
  return d
}

/** Convert a displayed 12-hour value + meridiem into a 24-hour hour. */
function to24(displayHour: number, ampm: "AM" | "PM"): number {
  const h = displayHour % 12
  return ampm === "PM" ? h + 12 : h
}

function applyUnit(
  base: Date | null,
  unit: Partial<{ h24: number; m: number; s: number }>
): Date {
  const d = base ? new Date(base) : zeroToday()
  if (unit.h24 !== undefined) d.setHours(unit.h24)
  if (unit.m !== undefined) d.setMinutes(unit.m)
  if (unit.s !== undefined) d.setSeconds(unit.s)
  d.setMilliseconds(0)
  return d
}

function hourOptions(is12: boolean, step: number): number[] {
  const out: number[] = []
  if (is12) {
    for (let i = 0; i < 12; i += step) out.push(i === 0 ? 12 : i)
    return out
  }
  for (let i = 0; i < 24; i += step) out.push(i)
  return out
}

function unitOptions(step: number): number[] {
  const out: number[] = []
  for (let i = 0; i < 60; i += step) out.push(i)
  return out
}

function placementToSide(placement: TimePickerPlacement): {
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

/* -------------------------------------------------------------------------------------------------
 * Input frame (shared with the range picker)
 * ------------------------------------------------------------------------------------------------*/

const fieldFrameDefaults = { variant: "outlined", size: "middle" } as const

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
    defaultVariants: fieldFrameDefaults,
  }
)

function statusClasses(
  variant: TimePickerVariant,
  status?: TimePickerStatus
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

/* -------------------------------------------------------------------------------------------------
 * Panel columns
 * ------------------------------------------------------------------------------------------------*/

const ITEM_HEIGHT = 28 // px — must match the h-7 on each cell
const COLUMN_HEIGHT = 224 // px — 8 visible rows

interface ColumnOption {
  key: string
  value: number | string
  label: string
  disabled: boolean
}

function TimeColumn({
  options,
  selected,
  onSelect,
  changeOnScroll,
  subType,
  cellRender,
}: {
  options: ColumnOption[]
  selected: number | string | null
  onSelect: (value: number | string) => void
  changeOnScroll?: boolean
  subType: CellSubType
  cellRender?: CellRender
}) {
  const listRef = React.useRef<HTMLDivElement>(null)
  const programmaticRef = React.useRef(false)
  const scrollTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Bring the selected cell to the top of its column when it changes.
  React.useEffect(() => {
    if (selected == null) return
    const index = options.findIndex((o) => o.value === selected)
    if (index < 0) return
    const el = listRef.current
    if (!el) return
    programmaticRef.current = true
    el.scrollTo({ top: index * ITEM_HEIGHT, behavior: "smooth" })
    const t = setTimeout(() => {
      programmaticRef.current = false
    }, 250)
    return () => clearTimeout(t)
  }, [selected, options])

  function handleScroll() {
    if (!changeOnScroll || programmaticRef.current) return
    if (scrollTimer.current) clearTimeout(scrollTimer.current)
    scrollTimer.current = setTimeout(() => {
      const el = listRef.current
      if (!el) return
      const index = Math.round(el.scrollTop / ITEM_HEIGHT)
      const option = options[Math.min(index, options.length - 1)]
      if (option && !option.disabled && option.value !== selected) {
        onSelect(option.value)
      }
    }, 140)
  }

  return (
    <div
      ref={listRef}
      onScroll={handleScroll}
      className="w-14 overflow-y-auto overscroll-contain [scrollbar-width:thin]"
      style={{ height: COLUMN_HEIGHT }}
      role="listbox"
      aria-label={subType}
    >
      <div style={{ paddingBottom: COLUMN_HEIGHT - ITEM_HEIGHT }}>
        {options.map((option) => {
          const isSelected = option.value === selected
          const node: React.ReactNode = (
            <span className="tabular-nums">{option.label}</span>
          )
          return (
            <button
              key={option.key}
              type="button"
              role="option"
              // Not tab-focusable: on open Base UI moves focus into the popup,
              // and if it landed on a cell the browser would scroll that cell's
              // column to the top, overriding the scroll-to-selected. Cells are
              // still clickable; the columns aren't arrow-key navigable.
              tabIndex={-1}
              aria-selected={isSelected}
              disabled={option.disabled}
              onClick={() => onSelect(option.value)}
              className={cn(
                "flex h-7 w-full items-center justify-center rounded-md text-sm transition-colors select-none",
                "hover:bg-muted",
                isSelected &&
                  "bg-primary font-medium text-primary-foreground hover:bg-primary",
                option.disabled &&
                  "cursor-not-allowed text-muted-foreground/40 hover:bg-transparent"
              )}
            >
              {cellRender
                ? cellRender(option.value, {
                    originNode: node,
                    subType,
                    value: option.value,
                  })
                : node}
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface PanelHandlers {
  onPickHour: (displayHour: number) => void
  onPickMinute: (m: number) => void
  onPickSecond: (s: number) => void
  onPickMeridiem: (ampm: "AM" | "PM") => void
}

/**
 * Column-pick handlers shared by the single and range pickers: apply the
 * picked unit to `base` (the staged value, or the active end of the range)
 * and hand the result to `update`.
 */
function usePanelHandlers(
  is12: boolean,
  base: Date | null,
  update: (next: Date) => void
): PanelHandlers {
  const currentAmPm: "AM" | "PM" = base && base.getHours() >= 12 ? "PM" : "AM"
  return {
    onPickHour: (displayHour) => {
      const h24 = is12 ? to24(displayHour, currentAmPm) : displayHour
      update(applyUnit(base, { h24 }))
    },
    onPickMinute: (m) => update(applyUnit(base, { m })),
    onPickSecond: (s) => update(applyUnit(base, { s })),
    onPickMeridiem: (ampm) => {
      const h = (base ? base.getHours() : 0) % 12
      update(applyUnit(base, { h24: ampm === "PM" ? h + 12 : h }))
    },
  }
}

function PanelColumns({
  value,
  is12,
  show,
  hourStep,
  minuteStep,
  secondStep,
  disabled,
  hideDisabledOptions,
  changeOnScroll,
  meridiemLabels,
  cellRender,
  handlers,
}: {
  value: Date | null
  is12: boolean
  show: { hour: boolean; minute: boolean; second: boolean }
  hourStep: number
  minuteStep: number
  secondStep: number
  disabled: DisabledTimes
  hideDisabledOptions?: boolean
  changeOnScroll?: boolean
  meridiemLabels: { am: string; pm: string }
  cellRender?: CellRender
  handlers: PanelHandlers
}) {
  const h24 = value ? value.getHours() : null
  const selectedMinute = value ? value.getMinutes() : null
  const selectedSecond = value ? value.getSeconds() : null
  const selectedHourDisplay =
    h24 == null ? null : is12 ? (h24 % 12 === 0 ? 12 : h24 % 12) : h24
  const selectedAmPm: "AM" | "PM" | null =
    h24 == null ? null : h24 < 12 ? "AM" : "PM"

  const disabledHours = disabled.disabledHours?.() ?? []
  const disabledMinutes = disabled.disabledMinutes?.(h24 ?? -1) ?? []
  const disabledSeconds =
    disabled.disabledSeconds?.(h24 ?? -1, selectedMinute ?? -1) ?? []

  const hourCells: ColumnOption[] = hourOptions(is12, hourStep)
    .map((display) => {
      const hour24 = is12 ? to24(display, selectedAmPm ?? "AM") : display
      return {
        key: `h-${display}`,
        value: display,
        label: pad(display),
        disabled: disabledHours.includes(hour24),
      }
    })
    .filter((o) => !hideDisabledOptions || !o.disabled)

  const minuteCells: ColumnOption[] = unitOptions(minuteStep)
    .map((m) => ({
      key: `m-${m}`,
      value: m,
      label: pad(m),
      disabled: disabledMinutes.includes(m),
    }))
    .filter((o) => !hideDisabledOptions || !o.disabled)

  const secondCells: ColumnOption[] = unitOptions(secondStep)
    .map((s) => ({
      key: `s-${s}`,
      value: s,
      label: pad(s),
      disabled: disabledSeconds.includes(s),
    }))
    .filter((o) => !hideDisabledOptions || !o.disabled)

  const meridiemCells: ColumnOption[] = [
    { key: "am", value: "AM", label: meridiemLabels.am, disabled: false },
    { key: "pm", value: "PM", label: meridiemLabels.pm, disabled: false },
  ]

  return (
    <div className="flex p-1">
      {show.hour && (
        <TimeColumn
          options={hourCells}
          selected={selectedHourDisplay}
          onSelect={(v) => handlers.onPickHour(v as number)}
          changeOnScroll={changeOnScroll}
          subType="hour"
          cellRender={cellRender}
        />
      )}
      {show.minute && (
        <TimeColumn
          options={minuteCells}
          selected={selectedMinute}
          onSelect={(v) => handlers.onPickMinute(v as number)}
          changeOnScroll={changeOnScroll}
          subType="minute"
          cellRender={cellRender}
        />
      )}
      {show.second && (
        <TimeColumn
          options={secondCells}
          selected={selectedSecond}
          onSelect={(v) => handlers.onPickSecond(v as number)}
          changeOnScroll={changeOnScroll}
          subType="second"
          cellRender={cellRender}
        />
      )}
      {is12 && (
        <TimeColumn
          options={meridiemCells}
          selected={selectedAmPm}
          onSelect={(v) => handlers.onPickMeridiem(v as "AM" | "PM")}
          changeOnScroll={changeOnScroll}
          subType="meridiem"
          cellRender={cellRender}
        />
      )}
    </div>
  )
}

function PanelFooter({
  showNow,
  nowLabel,
  okLabel,
  onNow,
  onOk,
  extra,
}: {
  showNow?: boolean
  nowLabel: string
  okLabel: string
  onNow: () => void
  onOk: () => void
  extra?: React.ReactNode
}) {
  return (
    <>
      {extra != null && (
        <>
          <div className="h-px bg-border" />
          <div className="px-3 py-2 text-sm">{extra}</div>
        </>
      )}
      <div className="h-px bg-border" />
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        {showNow ? (
          <button
            type="button"
            onClick={onNow}
            className="text-sm text-primary transition-colors hover:text-primary/80"
          >
            {nowLabel}
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={onOk}
          className="rounded-md bg-primary px-3 py-1 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {okLabel}
        </button>
      </div>
    </>
  )
}

// Trailing adornment shared by both pickers: the clear button when there is
// something to clear, otherwise the (customisable) clock icon.
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
      {suffixIcon ?? <Clock />}
    </span>
  )
}

const popupClasses =
  "z-50 origin-[var(--transform-origin)] overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md outline-none transition-[transform,opacity] data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0"

/* -------------------------------------------------------------------------------------------------
 * TimePicker (single)
 * ------------------------------------------------------------------------------------------------*/

export interface TimePickerProps
  extends VariantProps<typeof fieldFrameVariants> {
  /** Controlled value. */
  value?: Date | null
  /** Uncontrolled initial value. */
  defaultValue?: Date | null
  /** Fires with the new value and its formatted string. */
  onChange?: (value: Date | null, timeString: string) => void
  /** Fires when the clear button is pressed. */
  onClear?: () => void
  /** dayjs-style token string. Defaults to `HH:mm:ss` (or `h:mm:ss A` in 12h). */
  format?: string
  /** Display and select in 12-hour AM/PM mode. */
  use12Hours?: boolean
  hourStep?: number
  minuteStep?: number
  secondStep?: number
  /** Times that cannot be selected. */
  disabledTime?: DisabledTime
  /** Hide (instead of disable) options that can't be selected. */
  hideDisabledOptions?: boolean
  disabled?: boolean
  /** `true`, or `{ clearIcon }` to customise. `false` hides the clear button. */
  allowClear?: boolean | { clearIcon?: React.ReactNode }
  placeholder?: string
  /** Controlled open state. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Where the panel pops up relative to the input. */
  placement?: TimePickerPlacement
  /** Validation status colouring. */
  status?: TimePickerStatus
  /** Node rendered at the start of the input. */
  prefix?: React.ReactNode
  /** Replaces the trailing clock icon. */
  suffixIcon?: React.ReactNode
  /** Make the input non-typeable (panel selection only). */
  inputReadOnly?: boolean
  /** Update the value while scrolling a column. */
  changeOnScroll?: boolean
  /** Require the OK button before `onChange` fires. Defaults to `true`. */
  needConfirm?: boolean
  /** Show the "Now" shortcut in the footer. Defaults to `true`. */
  showNow?: boolean
  /** Render extra content in the panel footer. */
  renderExtraFooter?: () => React.ReactNode
  /** Customise the rendering of a single panel cell. */
  cellRender?: CellRender
  autoFocus?: boolean
  /** Submitted with the enclosing form (formatted string). */
  name?: string
  id?: string
  className?: string
  /** Class applied to the popup panel. */
  popupClassName?: string
  okText?: string
  nowText?: string
  meridiemLabels?: { am: string; pm: string }
}

function TimePicker({
  value: valueProp,
  defaultValue = null,
  onChange,
  onClear,
  format,
  use12Hours,
  hourStep = 1,
  minuteStep = 1,
  secondStep = 1,
  disabledTime,
  hideDisabledOptions,
  disabled,
  allowClear = true,
  placeholder = "Select time",
  open: openProp,
  onOpenChange,
  placement = "bottomLeft",
  status,
  prefix,
  suffixIcon,
  inputReadOnly,
  changeOnScroll,
  needConfirm = true,
  showNow = true,
  renderExtraFooter,
  cellRender,
  autoFocus,
  name,
  id,
  variant = fieldFrameDefaults.variant,
  size = fieldFrameDefaults.size,
  className,
  popupClassName,
  okText = "OK",
  nowText = "Now",
  meridiemLabels = { am: "AM", pm: "PM" },
}: TimePickerProps) {
  const is12 = resolve12Hours(use12Hours, format)
  const fmt = resolveFormat(format, is12)
  const show = getShowUnits(fmt)

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

  // The value staged in the panel while it's open (may differ from `value`
  // until the user confirms when `needConfirm` is set).
  const [pending, setPending] = React.useState<Date | null>(value)

  const inputRef = React.useRef<HTMLInputElement>(null)
  const typingRef = React.useRef(false)
  const [text, setText] = React.useState("")

  // Re-seed the pending value from the committed value whenever the panel
  // opens. Done as a render-time state adjustment (not an effect) so it applies
  // before paint without a cascading render — the "reset on prop change"
  // pattern. When the panel is closed the input falls back to `value`, so a
  // staged-but-unconfirmed pending value is simply dropped on the next open.
  const [prevOpen, setPrevOpen] = React.useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) setPending(value)
  }

  // Keep the input text in sync with the value/pending unless the user is typing.
  React.useEffect(() => {
    if (typingRef.current) return
    const display = open ? pending : value
    setText(display ? formatTime(display, fmt) : "")
  }, [value, pending, open, fmt])

  React.useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  const commit = React.useCallback(
    (next: Date | null) => {
      if (valueProp === undefined) setValueState(next)
      onChange?.(next, next ? formatTime(next, fmt) : "")
    },
    [valueProp, onChange, fmt]
  )

  const update = React.useCallback(
    (next: Date) => {
      typingRef.current = false
      setPending(next)
      if (!needConfirm) commit(next)
    },
    [needConfirm, commit]
  )

  const handlers = usePanelHandlers(is12, pending, update)

  function handleOpenChange(next: boolean) {
    if (disabled) return
    setOpen(next)
  }

  function handleOk() {
    commit(pending)
    setOpen(false)
  }

  function handleNow() {
    const now = new Date()
    now.setMilliseconds(0)
    setPending(now)
    commit(now)
    setOpen(false)
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation()
    typingRef.current = false
    setPending(null)
    commit(null)
    onClear?.()
  }

  function commitText() {
    typingRef.current = false
    const parsed = parseTimeString(text, { is12, base: value })
    if (parsed) {
      setPending(parsed)
      commit(parsed)
    } else if (text.trim() === "") {
      setPending(null)
      commit(null)
    } else {
      // Unparseable — revert to the current value.
      const display = value ? formatTime(value, fmt) : ""
      setText(display)
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
        data-slot="time-picker-trigger"
        disabled={disabled}
        nativeButton={false}
        render={
          <div
            data-disabled={disabled ? "" : undefined}
            className={cn(
              fieldFrameVariants({ variant, size }),
              statusClasses(variant ?? "outlined", status),
              "w-40",
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
              inputMode="numeric"
              disabled={disabled}
              readOnly={inputReadOnly}
              placeholder={placeholder}
              value={text}
              aria-label={placeholder}
              className={fieldInputClasses}
              onPointerDown={(e) => {
                // Open on pointer-down rather than focus: closing the panel
                // restores focus to this input, and a focus-based open would
                // immediately reopen it after OK / click-away.
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
                value={value ? formatTime(value, fmt) : ""}
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
            data-slot="time-picker-content"
            className={cn(popupClasses, popupClassName)}
          >
            <PanelColumns
              value={pending}
              is12={is12}
              show={show}
              hourStep={hourStep}
              minuteStep={minuteStep}
              secondStep={secondStep}
              disabled={disabledTime?.(pending) ?? {}}
              hideDisabledOptions={hideDisabledOptions}
              changeOnScroll={changeOnScroll}
              meridiemLabels={meridiemLabels}
              cellRender={cellRender}
              handlers={handlers}
            />
            <PanelFooter
              showNow={showNow}
              nowLabel={nowText}
              okLabel={okText}
              onNow={handleNow}
              onOk={handleOk}
              extra={extra}
            />
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

/* -------------------------------------------------------------------------------------------------
 * RangePicker
 * ------------------------------------------------------------------------------------------------*/

type RangeValue = [Date | null, Date | null]

export interface TimeRangePickerProps
  extends VariantProps<typeof fieldFrameVariants> {
  value?: RangeValue
  defaultValue?: RangeValue
  onChange?: (value: RangeValue, timeStrings: [string, string]) => void
  onClear?: () => void
  format?: string
  use12Hours?: boolean
  hourStep?: number
  minuteStep?: number
  secondStep?: number
  /** Disabled times, evaluated per end via the `type` argument. */
  disabledTime?: RangeDisabledTime
  hideDisabledOptions?: boolean
  disabled?: boolean
  allowClear?: boolean | { clearIcon?: React.ReactNode }
  /** `[start, end]` placeholders. */
  placeholder?: [string, string]
  open?: boolean
  onOpenChange?: (open: boolean) => void
  placement?: TimePickerPlacement
  status?: TimePickerStatus
  suffixIcon?: React.ReactNode
  inputReadOnly?: boolean
  changeOnScroll?: boolean
  needConfirm?: boolean
  showNow?: boolean
  renderExtraFooter?: () => React.ReactNode
  cellRender?: CellRender
  /** Sort the two ends so start <= end on confirm. Defaults to `true`. */
  order?: boolean
  /** Node placed between the two inputs. */
  separator?: React.ReactNode
  className?: string
  popupClassName?: string
  okText?: string
  nowText?: string
  meridiemLabels?: { am: string; pm: string }
}

function TimeRangePicker({
  value: valueProp,
  defaultValue = [null, null],
  onChange,
  onClear,
  format,
  use12Hours,
  hourStep = 1,
  minuteStep = 1,
  secondStep = 1,
  disabledTime,
  hideDisabledOptions,
  disabled,
  allowClear = true,
  placeholder = ["Start time", "End time"],
  open: openProp,
  onOpenChange,
  placement = "bottomLeft",
  status,
  suffixIcon,
  inputReadOnly,
  changeOnScroll,
  needConfirm = true,
  showNow = true,
  renderExtraFooter,
  cellRender,
  order = true,
  separator,
  variant = fieldFrameDefaults.variant,
  size = fieldFrameDefaults.size,
  className,
  popupClassName,
  okText = "OK",
  nowText = "Now",
  meridiemLabels = { am: "AM", pm: "PM" },
}: TimeRangePickerProps) {
  const is12 = resolve12Hours(use12Hours, format)
  const fmt = resolveFormat(format, is12)
  const show = getShowUnits(fmt)

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

  const [pending, setPending] = React.useState<RangeValue>(value)
  const [active, setActive] = React.useState<0 | 1>(0)
  const typingRef = React.useRef(false)
  const [texts, setTexts] = React.useState<[string, string]>(["", ""])

  // Re-seed the pending value from the committed value whenever the panel
  // opens. Done as a render-time state adjustment (not an effect) so it applies
  // before paint without a cascading render — the "reset on prop change"
  // pattern. When the panel is closed the input falls back to `value`, so a
  // staged-but-unconfirmed pending value is simply dropped on the next open.
  const [prevOpen, setPrevOpen] = React.useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) setPending(value)
  }

  React.useEffect(() => {
    if (typingRef.current) return
    const src = open ? pending : value
    setTexts([
      src[0] ? formatTime(src[0], fmt) : "",
      src[1] ? formatTime(src[1], fmt) : "",
    ])
  }, [value, pending, open, fmt])

  function orderValue(v: RangeValue): RangeValue {
    if (order && v[0] && v[1] && v[0].getTime() > v[1].getTime()) {
      return [v[1], v[0]]
    }
    return v
  }

  const commit = React.useCallback(
    (next: RangeValue) => {
      const ordered = orderValue(next)
      if (valueProp === undefined) setValueState(ordered)
      onChange?.(ordered, [
        ordered[0] ? formatTime(ordered[0], fmt) : "",
        ordered[1] ? formatTime(ordered[1], fmt) : "",
      ])
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [valueProp, onChange, fmt, order]
  )

  const activeValue = pending[active]

  function updateActive(next: Date) {
    typingRef.current = false
    const nextRange: RangeValue =
      active === 0 ? [next, pending[1]] : [pending[0], next]
    setPending(nextRange)
    if (!needConfirm) commit(nextRange)
  }

  const handlers = usePanelHandlers(is12, activeValue, updateActive)

  function handleOpenChange(next: boolean) {
    if (disabled) return
    setOpen(next)
  }

  function handleOk() {
    commit(pending)
    setOpen(false)
  }

  function handleNow() {
    const now = new Date()
    now.setMilliseconds(0)
    const nextRange: RangeValue =
      active === 0 ? [now, pending[1]] : [pending[0], now]
    setPending(nextRange)
    if (active === 0) {
      // Advance to the end field so the range can be completed.
      setActive(1)
    } else {
      commit(nextRange)
      setOpen(false)
    }
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation()
    typingRef.current = false
    setPending([null, null])
    commit([null, null])
    onClear?.()
  }

  function commitText(index: 0 | 1) {
    typingRef.current = false
    const parsed = parseTimeString(texts[index], {
      is12,
      base: value[index],
    })
    const nextRange: RangeValue = [...pending] as RangeValue
    if (parsed) {
      nextRange[index] = parsed
    } else if (texts[index].trim() === "") {
      nextRange[index] = null
    } else {
      setTexts((prev) => {
        const copy = [...prev] as [string, string]
        copy[index] = value[index] ? formatTime(value[index]!, fmt) : ""
        return copy
      })
      return
    }
    setPending(nextRange)
    commit(nextRange)
  }

  const showClear =
    Boolean(allowClear) && Boolean(value[0] || value[1]) && !disabled
  const clearIcon =
    allowClear && typeof allowClear === "object" ? allowClear.clearIcon : null
  const { side, align } = placementToSide(placement)
  const extra = renderExtraFooter?.()

  const renderField = (index: 0 | 1) => (
    <input
      type="text"
      inputMode="numeric"
      disabled={disabled}
      readOnly={inputReadOnly}
      placeholder={placeholder[index]}
      value={texts[index]}
      aria-label={placeholder[index]}
      className={cn(
        fieldInputClasses,
        "w-full text-center",
        active === index && open && "text-foreground"
      )}
      onPointerDown={(e) => {
        // Open on pointer-down (not focus) so restoring focus on close doesn't
        // immediately reopen the panel. Pointer-down also selects which end
        // (start / end) the shared panel edits.
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
  )

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger
        data-slot="time-range-picker-trigger"
        disabled={disabled}
        nativeButton={false}
        render={
          <div
            data-disabled={disabled ? "" : undefined}
            className={cn(
              fieldFrameVariants({ variant, size }),
              statusClasses(variant ?? "outlined", status),
              "w-64",
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
            data-slot="time-range-picker-content"
            className={cn(popupClasses, popupClassName)}
          >
            <PanelColumns
              value={activeValue}
              is12={is12}
              show={show}
              hourStep={hourStep}
              minuteStep={minuteStep}
              secondStep={secondStep}
              disabled={
                disabledTime?.(activeValue, active === 0 ? "start" : "end") ?? {}
              }
              hideDisabledOptions={hideDisabledOptions}
              changeOnScroll={changeOnScroll}
              meridiemLabels={meridiemLabels}
              cellRender={cellRender}
              handlers={handlers}
            />
            <PanelFooter
              showNow={showNow}
              nowLabel={nowText}
              okLabel={okText}
              onNow={handleNow}
              onOk={handleOk}
              extra={extra}
            />
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

TimePicker.RangePicker = TimeRangePicker

export { TimePicker, TimeRangePicker, formatTime }

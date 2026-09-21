"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

type CalendarEventStatus = "busy" | "out-of-office"

type CalendarViewMode = "month" | "week"

interface CalendarEvent {
  id: string
  title: string
  /**
   * Start of the event: a `Date` or ISO string. A date-only value
   * ("2026-07-05") makes an all-day event; include a time
   * ("2026-07-05T10:00") for a timed event shown on the week view's
   * time grid.
   */
  start: Date | string
  /**
   * End of the event. All-day events: the last day, inclusive. Timed
   * events: the end time (defaults to one hour after start).
   */
  end?: Date | string
  /** Force all-day rendering even when start/end carry times. */
  allDay?: boolean
  /** Drives the chip tint and the stripe on the left edge. Defaults to "busy". */
  status?: CalendarEventStatus
}

// Status → theme-token utilities. `chip` tints the whole bar, `stripe` is the
// solid status marker on the left edge. Both resolve from --calendar-* tokens
// so consumers can restyle (or re-map) every status from their globals.css.
const statusStyles: Record<
  CalendarEventStatus,
  { chip: string; stripe: string }
> = {
  busy: {
    chip: "bg-calendar-busy-surface text-calendar-busy-surface-foreground",
    stripe: "bg-calendar-busy",
  },
  "out-of-office": {
    chip: "bg-calendar-ooo-surface text-calendar-ooo-surface-foreground",
    stripe: "bg-calendar-ooo",
  },
}

/* ---------------------------------- dates --------------------------------- */

const DAY_MS = 86_400_000

// The time grid's natural density: one hour is this tall in px when nothing
// stretches the calendar. It is a floor, not a fixed size — given a taller
// parent the grid grows and the hours spread out across it.
const HOUR_HEIGHT = 48

const MINUTES_PER_DAY = 1440

// An event shorter than this has no room for the times under its title at the
// grid's natural density.
const MIN_MINUTES_FOR_TIMES = 50

/** A fraction of the day (0-1) as a CSS percentage. */
const dayPercent = (fraction: number) => `${fraction * 100}%`

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

// Parses ISO strings as *local* time. A bare "2026-07-05" via `new Date()`
// would be UTC midnight, which shifts to the previous day in negative-offset
// timezones; "2026-07-05T10:00" (no zone suffix) already parses as local.
function toLocalDateTime(value: Date | string): Date {
  if (value instanceof Date) return new Date(value.getTime())
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return new Date(value)
}

function hasTimeComponent(value: Date | string): boolean {
  return value instanceof Date
    ? value.getHours() !== 0 ||
        value.getMinutes() !== 0 ||
        value.getSeconds() !== 0
    : value.includes("T")
}

function addDays(d: Date, days: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days)
}

// Whole days from a to b; rounding absorbs DST hour shifts.
function diffDays(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / DAY_MS)
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

// The 7 days of the week containing `date`.
function getWeek(date: Date, weekStartsOn: 0 | 1): Date[] {
  const day = startOfDay(date)
  const lead = (day.getDay() - weekStartsOn + 7) % 7
  const weekStart = addDays(day, -lead)
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
}

// All weeks (rows of 7 days) needed to display `month`, padded with leading
// and trailing days from the adjacent months.
function getMonthGrid(month: Date, weekStartsOn: 0 | 1): Date[][] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0
  ).getDate()
  const lead = (first.getDay() - weekStartsOn + 7) % 7
  const gridStart = addDays(first, -lead)
  const weekCount = Math.ceil((lead + daysInMonth) / 7)

  return Array.from({ length: weekCount }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => addDays(gridStart, w * 7 + d))
  )
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
}

/* --------------------------------- layout --------------------------------- */

interface NormalizedEvent {
  event: CalendarEvent
  /** Day span (local midnights, inclusive) used by the month/all-day layout. */
  start: Date
  end: Date
  /** Exact times used by the week view's time grid. */
  startTime: Date
  endTime: Date
  allDay: boolean
}

interface WeekSegment {
  event: CalendarEvent
  allDay: boolean
  startTime: Date
  /** 0-6 column within the week. */
  startCol: number
  endCol: number
  /** False when the event started before this week (continues from the left). */
  isStart: boolean
  /** False when the event ends after this week (continues to the right). */
  isEnd: boolean
  lane: number
}

// One event produces at most one segment per week, spanning all its columns —
// this is what keeps a multi-day event a single continuous bar instead of a
// repeated chip on every date. Overlapping segments are packed into lanes
// (stacked rows) greedily: each segment takes the first lane that is free at
// its starting column.
function layoutWeek(
  weekStart: Date,
  events: NormalizedEvent[]
): { segments: WeekSegment[]; laneCount: number } {
  const weekEnd = addDays(weekStart, 6)

  const segments: WeekSegment[] = events
    .filter((e) => e.start <= weekEnd && e.end >= weekStart)
    .map((e) => ({
      event: e.event,
      allDay: e.allDay,
      startTime: e.startTime,
      startCol: e.start < weekStart ? 0 : diffDays(weekStart, e.start),
      endCol: e.end > weekEnd ? 6 : diffDays(weekStart, e.end),
      isStart: e.start >= weekStart,
      isEnd: e.end <= weekEnd,
      lane: 0,
    }))

  // Earlier starts first; among equal starts the longer event wins the upper
  // lane, so spanning bars sit above the single-day chips they overlap.
  segments.sort(
    (a, b) =>
      a.startCol - b.startCol ||
      b.endCol - b.startCol - (a.endCol - a.startCol)
  )

  const laneEnds: number[] = []
  for (const seg of segments) {
    let lane = laneEnds.findIndex((end) => end < seg.startCol)
    if (lane === -1) {
      lane = laneEnds.length
      laneEnds.push(seg.endCol)
    } else {
      laneEnds[lane] = seg.endCol
    }
    seg.lane = lane
  }

  return { segments, laneCount: laneEnds.length }
}

interface TimedBlock {
  event: CalendarEvent
  startTime: Date
  endTime: Date
  /** Offset from midnight as a fraction of the day (0-1), not pixels, so the
   *  block keeps its place when the time grid stretches to fill its parent. */
  top: number
  /** Displayed length as a fraction of the day. */
  height: number
  /** Displayed length in minutes — decides whether the times fit in the chip. */
  durationMin: number
  col: number
  cols: number
}

// Positions one day's timed events on the time grid. Overlapping events are
// grouped into clusters and split into equal-width side-by-side columns, the
// way Outlook/Google render concurrent meetings. Packing uses the displayed
// extent (with a 30-minute floor for readability) so chips never overlap
// visually either.
function layoutTimedDay(events: NormalizedEvent[]): TimedBlock[] {
  const sorted = [...events].sort(
    (a, b) =>
      a.startTime.getTime() - b.startTime.getTime() ||
      b.endTime.getTime() - a.endTime.getTime()
  )

  const blocks: TimedBlock[] = []
  let cluster: TimedBlock[] = []
  let colEnds: number[] = []
  let clusterEnd = -1

  const flushCluster = () => {
    for (const block of cluster) block.cols = colEnds.length
    cluster = []
    colEnds = []
  }

  for (const e of sorted) {
    const dayStart = e.start.getTime()
    const startMin = (e.startTime.getTime() - dayStart) / 60_000
    const endMin = Math.min((e.endTime.getTime() - dayStart) / 60_000, 1440)
    const displayEnd = Math.max(endMin, startMin + 30)

    if (startMin >= clusterEnd) flushCluster()
    clusterEnd = Math.max(clusterEnd, displayEnd)

    let col = colEnds.findIndex((end) => end <= startMin)
    if (col === -1) {
      col = colEnds.length
      colEnds.push(displayEnd)
    } else {
      colEnds[col] = displayEnd
    }

    const block: TimedBlock = {
      event: e.event,
      startTime: e.startTime,
      endTime: e.endTime,
      top: startMin / MINUTES_PER_DAY,
      height: (displayEnd - startMin) / MINUTES_PER_DAY,
      durationMin: displayEnd - startMin,
      col,
      cols: 0,
    }
    cluster.push(block)
    blocks.push(block)
  }
  flushCluster()

  return blocks
}

/* --------------------------------- context --------------------------------- */

interface CalendarViewContextValue {
  /** The focused date: the month view shows its month, the week view its week. */
  cursor: Date
  view: CalendarViewMode
  /** The date the user clicked, or null when nothing is selected. */
  selected: Date | null
  weekStartsOn: 0 | 1
  setCursor: (date: Date) => void
  setView: (view: CalendarViewMode) => void
  select: (date: Date | null) => void
  /**
   * Week-view time grids register their scroll element here so all grids
   * under one provider scroll together behind a single visible scrollbar.
   */
  scrollAreas: HTMLDivElement[]
  registerScrollArea: (el: HTMLDivElement) => () => void
  syncScroll: (source: HTMLDivElement) => void
}

const CalendarViewContext =
  React.createContext<CalendarViewContextValue | null>(null)

// Mirrors one grid's scrollTop onto its siblings. Assigning an equal
// scrollTop fires no scroll event, so the mirroring can't loop.
function mirrorScrollTop(areas: HTMLDivElement[], source: HTMLDivElement) {
  for (const el of areas) {
    if (el !== source && el.scrollTop !== source.scrollTop) {
      el.scrollTop = source.scrollTop
    }
  }
}

/**
 * State shared between `CalendarViewControls` and every `CalendarViewGrid`
 * under the same `CalendarViewProvider`. Also usable from consumer code to
 * build custom controls.
 */
function useCalendarView(): CalendarViewContextValue {
  const context = React.useContext(CalendarViewContext)
  if (!context) {
    throw new Error(
      "useCalendarView must be used within a <CalendarViewProvider> (or <CalendarView>)."
    )
  }
  return context
}

interface CalendarViewProviderProps {
  /**
   * Controlled focused date: the month view shows its month, the week view
   * shows its week.
   */
  month?: Date
  /** Initial focused date for uncontrolled usage. Defaults to today. */
  defaultMonth?: Date
  /** Fires with the new focused date on any navigation (arrows, Today, the
   * month/year selects, a week step, or a view switch that refocuses). */
  onMonthChange?: (month: Date) => void
  /** Controlled view mode. */
  view?: CalendarViewMode
  /** Initial view mode for uncontrolled usage. Defaults to "month". */
  defaultView?: CalendarViewMode
  onViewChange?: (view: CalendarViewMode) => void
  /**
   * Controlled selected date; pass `null` for "controlled, nothing
   * selected". Omit the prop entirely for uncontrolled selection.
   */
  selected?: Date | null
  /** Initial selected date for uncontrolled usage. */
  defaultSelected?: Date
  /** Fires with the clicked date, or null when the selection is cleared
   * (clicking the selected date again toggles it off). */
  onSelect?: (date: Date | null) => void
  /** 0 = Sunday (default), 1 = Monday. */
  weekStartsOn?: 0 | 1
  children: React.ReactNode
}

/**
 * Owns the calendar state (focused date, view mode, selection) without
 * rendering any DOM. Put one at the outer layer, render one
 * `CalendarViewControls` plus any number of `CalendarViewGrid`s inside it,
 * and the single control drives every grid.
 */
function CalendarViewProvider({
  month: monthProp,
  defaultMonth,
  onMonthChange,
  view: viewProp,
  defaultView = "month",
  onViewChange,
  selected: selectedProp,
  defaultSelected,
  onSelect,
  weekStartsOn = 0,
  children,
}: CalendarViewProviderProps) {
  const [uncontrolledCursor, setUncontrolledCursor] = React.useState(
    () => defaultMonth ?? new Date()
  )
  const cursor = monthProp ?? uncontrolledCursor

  const [uncontrolledView, setUncontrolledView] = React.useState(defaultView)
  const view = viewProp ?? uncontrolledView

  const [uncontrolledSelected, setUncontrolledSelected] =
    React.useState<Date | null>(defaultSelected ?? null)
  const selected =
    selectedProp === undefined ? uncontrolledSelected : selectedProp

  const setCursor = (next: Date) => {
    if (monthProp === undefined) setUncontrolledCursor(next)
    onMonthChange?.(next)
  }

  const select = (next: Date | null) => {
    if (selectedProp === undefined) setUncontrolledSelected(next)
    onSelect?.(next)
  }

  // Switching to the week view refocuses on the selected date's week when
  // there is a selection, otherwise on today's week.
  const setView = (next: CalendarViewMode) => {
    if (next !== view && next === "week") {
      setCursor(startOfDay(selected ?? new Date()))
    }
    if (viewProp === undefined) setUncontrolledView(next)
    onViewChange?.(next)
  }

  // Week-view time grids, in mount (= DOM) order. The ref is the live list
  // used for scroll mirroring; the state mirror re-renders grids when
  // siblings appear so they can tell who owns the visible scrollbar.
  const scrollAreasRef = React.useRef<HTMLDivElement[]>([])
  const [scrollAreas, setScrollAreas] = React.useState<HTMLDivElement[]>([])

  const registerScrollArea = React.useCallback((el: HTMLDivElement) => {
    scrollAreasRef.current = [...scrollAreasRef.current, el]
    setScrollAreas(scrollAreasRef.current)
    return () => {
      scrollAreasRef.current = scrollAreasRef.current.filter(
        (area) => area !== el
      )
      setScrollAreas(scrollAreasRef.current)
    }
  }, [])

  const syncScroll = React.useCallback(
    (source: HTMLDivElement) => mirrorScrollTop(scrollAreasRef.current, source),
    []
  )

  return (
    <CalendarViewContext.Provider
      value={{
        cursor,
        view,
        selected,
        weekStartsOn,
        setCursor,
        setView,
        select,
        scrollAreas,
        registerScrollArea,
        syncScroll,
      }}
    >
      {children}
    </CalendarViewContext.Provider>
  )
}

/* --------------------------------- controls -------------------------------- */

type CalendarViewControlsProps = React.ComponentProps<"div">

/**
 * The header — month/year selects, Month/Week toggle, prev/Today/next — as
 * its own element. Renders anywhere inside a `CalendarViewProvider` and
 * drives every `CalendarViewGrid` under the same provider.
 */
function CalendarViewControls({
  className,
  ...props
}: CalendarViewControlsProps) {
  const { cursor, view, weekStartsOn, setCursor, setView } = useCalendarView()

  // Prev/next steps a month or a week depending on the view.
  const navigate = (offset: number) =>
    setCursor(
      view === "month"
        ? new Date(cursor.getFullYear(), cursor.getMonth() + offset, 1)
        : addDays(cursor, offset * 7)
    )

  // Jump from the month/year selects, keeping the day-of-month (clamped to
  // the target month's length) so the week view stays near the same week.
  const jumpTo = (year: number, monthIndex: number) => {
    const daysInTarget = new Date(year, monthIndex + 1, 0).getDate()
    setCursor(
      new Date(year, monthIndex, Math.min(cursor.getDate(), daysInTarget))
    )
  }

  // Year options for the year select, centered on the focused year.
  const cursorYear = cursor.getFullYear()
  const years = Array.from({ length: 21 }, (_, i) => cursorYear - 10 + i)
  const monthNames = Array.from({ length: 12 }, (_, m) =>
    new Date(2000, m, 1).toLocaleDateString(undefined, { month: "long" })
  )

  const weekDays = getWeek(cursor, weekStartsOn)
  const weekLabel = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).formatRange(weekDays[0], weekDays[6])

  // scheme-* keeps the native dropdown list (and its hover highlight) in
  // sync with the app theme — without it the browser paints a light popup
  // in dark mode. The app's stylesheet must ALSO set color-scheme on
  // :root/.dark: Chromium paints the popup's initial frame from the select's
  // scheme but hover repaints from the DOCUMENT's, so the two must agree or
  // the list flips light mid-hover.
  const selectClassName =
    "scheme-light dark:scheme-dark cursor-pointer rounded-md bg-transparent px-1.5 py-1 text-sm font-semibold transition-colors hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"

  // Belt and suspenders for the popup rows: option background/color are
  // honored inside the native list, so they stay readable even where a
  // browser paints the popup chrome with the wrong scheme.
  const optionClassName = "bg-background text-foreground"

  return (
    <div
      data-slot="calendar-view-controls"
      className={cn(
        "flex flex-wrap items-center justify-between gap-2 px-1",
        className
      )}
      {...props}
    >
      <div
        data-slot="calendar-view-title"
        className="flex items-center gap-0.5"
      >
        <select
          data-slot="calendar-view-month-select"
          aria-label="Month"
          value={cursor.getMonth()}
          onChange={(e) => jumpTo(cursorYear, Number(e.target.value))}
          className={selectClassName}
        >
          {monthNames.map((name, m) => (
            <option key={m} value={m} className={optionClassName}>
              {name}
            </option>
          ))}
        </select>
        <select
          data-slot="calendar-view-year-select"
          aria-label="Year"
          value={cursorYear}
          onChange={(e) => jumpTo(Number(e.target.value), cursor.getMonth())}
          className={selectClassName}
        >
          {years.map((year) => (
            <option key={year} value={year} className={optionClassName}>
              {year}
            </option>
          ))}
        </select>
        {view === "week" && (
          <span className="ml-1 text-xs text-muted-foreground">
            {weekLabel}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Month / Week segmented toggle */}
        <div
          data-slot="calendar-view-toggle"
          role="group"
          aria-label="Calendar view"
          className="flex gap-0.5 rounded-md bg-muted p-0.5"
        >
          {(["month", "week"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setView(mode)}
              aria-pressed={view === mode}
              className={cn(
                "rounded-[calc(var(--radius-md)-2px)] px-2 py-0.5 text-xs font-medium capitalize transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                view === mode
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label={view === "month" ? "Previous month" : "Previous week"}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setCursor(new Date())}
            className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => navigate(1)}
            aria-label={view === "month" ? "Next month" : "Next week"}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------- event bars -------------------------------- */

// One spanning event bar in a week's lane grid — shared by the month view and
// the week view's all-day row. `colOffset`/`rowOffset` map the segment onto
// the surrounding grid (the week view has a leading hour-label column and no
// date-number row); `showTime` prefixes timed events with their start time.
function EventBarSegment({
  seg,
  colOffset,
  rowOffset,
  showTime,
  onEventClick,
}: {
  seg: WeekSegment
  colOffset: number
  rowOffset: number
  showTime?: boolean
  onEventClick?: (event: CalendarEvent) => void
}) {
  const status = seg.event.status ?? "busy"
  const styles = statusStyles[status]
  return (
    <button
      type="button"
      data-slot="calendar-view-event"
      data-status={status}
      title={seg.event.title}
      onClick={() => onEventClick?.(seg.event)}
      className={cn(
        "pointer-events-auto flex min-w-0 items-center gap-1.5 rounded-md px-1.5 py-0.5 text-left text-xs font-medium transition-opacity hover:opacity-80 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        styles.chip,
        // Squared, edge-flush ends signal that the bar continues into the
        // previous / next week instead of starting or ending here.
        seg.isStart ? "ml-0.5" : "rounded-l-none",
        seg.isEnd ? "mr-0.5" : "rounded-r-none"
      )}
      style={{
        gridColumn: `${seg.startCol + colOffset} / span ${
          seg.endCol - seg.startCol + 1
        }`,
        gridRow: seg.lane + rowOffset,
      }}
    >
      {/* Status stripe — only on the segment where the event actually
          starts, so a continued bar reads as one event. */}
      {seg.isStart && (
        <span
          aria-hidden="true"
          className={cn("h-3.5 w-1 shrink-0 rounded-full", styles.stripe)}
        />
      )}
      {showTime && seg.isStart && !seg.allDay && (
        <span className="shrink-0 text-[10px] tabular-nums opacity-70">
          {seg.startTime.toLocaleTimeString(undefined, { hour: "numeric" })}
        </span>
      )}
      <span className="truncate">{seg.event.title}</span>
    </button>
  )
}

/* -------------------------------- week view -------------------------------- */

// Outlook-style week: day headings, a lane row for all-day/multi-day bars,
// then a scrollable 24-hour grid where timed events are positioned and sized
// by their times, with a "now" indicator on today's column.
function CalendarViewWeek({
  events,
  onEventClick,
  fitDay,
}: {
  events: NormalizedEvent[]
  onEventClick?: (event: CalendarEvent) => void
  fitDay?: boolean
}) {
  const {
    cursor,
    weekStartsOn,
    selected,
    select,
    scrollAreas,
    registerScrollArea,
    syncScroll,
  } = useCalendarView()
  const days = getWeek(cursor, weekStartsOn)

  const [now, setNow] = React.useState(() => new Date())
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  // The scroll element lives in state (via callback ref) so render can
  // compare it against the provider's scroll-area list.
  const [scrollEl, setScrollEl] = React.useState<HTMLDivElement | null>(null)

  // Open the grid scrolled to the start of the working day.
  React.useEffect(() => {
    // 7.30am as a share of the grid's height, whatever that height is now.
    scrollEl?.scrollTo({ top: scrollEl.scrollHeight * (7.5 / 24) })
  }, [scrollEl])

  // Share one scrollbar across sibling grids: every time grid registers
  // with the provider, scrolling any of them mirrors to the rest, and all
  // but the last (right/bottom-most) grid hide their own scrollbar.
  React.useEffect(() => {
    if (!scrollEl) return
    return registerScrollArea(scrollEl)
  }, [scrollEl, registerScrollArea])
  const hideScrollbar =
    scrollEl !== null &&
    scrollAreas.length > 1 &&
    scrollAreas.includes(scrollEl) &&
    scrollAreas[scrollAreas.length - 1] !== scrollEl

  const today = startOfDay(now)

  // All-day and multi-day events live in the spanning lanes on top; timed
  // single-day events go on the time grid below.
  const allDayEvents = events.filter((e) => e.allDay || e.end > e.start)
  const timedEvents = events.filter((e) => !e.allDay && !(e.end > e.start))
  const { segments } = layoutWeek(days[0], allDayEvents)

  const todayCol = days.findIndex((d) => isSameDay(d, today))
  const nowTop = dayPercent(
    (now.getTime() - today.getTime()) / (MINUTES_PER_DAY * 60_000)
  )
  const hours = Array.from({ length: 23 }, (_, i) => i + 1)

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col")}>
      {/* Day headings */}
      <div className="grid grid-cols-[3rem_repeat(7,minmax(0,1fr))]">
        <div />
        {days.map((day) => {
          const isToday = isSameDay(day, today)
          const isSelected = selected !== null && isSameDay(day, selected)
          return (
            // The whole heading cell selects/deselects its day. Stacks
            // weekday over date in narrow containers (e.g. several grids
            // side by side) so the headings can't overlap.
            <button
              key={day.getTime()}
              type="button"
              data-slot="calendar-view-day"
              aria-label={day.toLocaleDateString(undefined, {
                dateStyle: "long",
              })}
              aria-pressed={isSelected}
              onClick={() => select(isSelected ? null : day)}
              className={cn(
                "flex min-w-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-xs transition-colors hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none @xl:flex-row @xl:gap-1.5",
                isSelected && "ring-2 ring-primary ring-inset"
              )}
            >
              <span className="truncate font-medium text-muted-foreground">
                {day.toLocaleDateString(undefined, { weekday: "short" })}
              </span>
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full tabular-nums",
                  isToday
                    ? "bg-primary font-semibold text-primary-foreground"
                    : "text-foreground"
                )}
              >
                {day.getDate()}
              </span>
            </button>
          )
        })}
      </div>

      {/* All-day / multi-day lanes */}
      {segments.length > 0 && (
        <div className="grid grid-cols-[3rem_repeat(7,minmax(0,1fr))] gap-y-0.5 pb-1">
          {segments.map((seg) => (
            <EventBarSegment
              key={seg.event.id}
              seg={seg}
              colOffset={2}
              rowOffset={1}
              onEventClick={onEventClick}
            />
          ))}
        </div>
      )}

      {/* Time grid */}
      <div
        ref={setScrollEl}
        data-slot="calendar-view-scroll"
        onScroll={(e) => syncScroll(e.currentTarget)}
        className={cn(
          "overflow-y-auto rounded-lg bg-muted/40",
          // 26rem is a flex basis, not a cap: with nothing constraining the
          // calendar the grid settles there (24h of rows would otherwise be
          // 1536px tall), and inside a sized parent it grows or shrinks to
          // take exactly the height left over.
          "h-[26rem] min-h-0 flex-auto",
          hideScrollbar &&
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        )}
      >
        <div
          className="relative grid grid-cols-[3rem_repeat(7,minmax(0,1fr))]"
          // Fills the scroller when there is room, and falls back to the
          // natural 24 x HOUR_HEIGHT density when there is not — at which
          // point the scroller takes over.
          style={{
            height: "100%",
            // Without fitDay the grid never gets denser than HOUR_HEIGHT, so a
            // short viewport scrolls instead of squeezing the day illegibly.
            minHeight: fitDay ? undefined : 24 * HOUR_HEIGHT,
          }}
        >
          {/* Hour labels */}
          <div className="relative">
            {hours.map((h) => (
              <span
                key={h}
                className="absolute right-2 -translate-y-1/2 text-[10px] text-muted-foreground tabular-nums"
                style={{ top: dayPercent(h / 24) }}
              >
                {new Date(2000, 0, 1, h).toLocaleTimeString(undefined, {
                  hour: "numeric",
                })}
              </span>
            ))}
          </div>

          {/* Hour hairlines across the day columns */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 left-12"
          >
            {hours.map((h) => (
              <div
                key={h}
                className="absolute inset-x-0 h-px bg-border"
                style={{ top: dayPercent(h / 24) }}
              />
            ))}
          </div>

          {/* Day columns with timed events */}
          {days.map((day, i) => {
            const blocks = layoutTimedDay(
              timedEvents.filter((e) => isSameDay(e.start, day))
            )
            return (
              <div key={day.getTime()} className="relative">
                {i > 0 && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-px bg-border"
                  />
                )}
                {blocks.map((block) => {
                  const status = block.event.status ?? "busy"
                  const styles = statusStyles[status]
                  return (
                    <button
                      key={block.event.id}
                      type="button"
                      data-slot="calendar-view-event"
                      data-status={status}
                      title={`${block.event.title} (${formatTime(
                        block.startTime
                      )} – ${formatTime(block.endTime)})`}
                      onClick={() => onEventClick?.(block.event)}
                      className={cn(
                        "absolute z-10 flex flex-col overflow-hidden rounded-md py-1 pr-1.5 pl-2.5 text-left text-xs transition-opacity hover:opacity-80 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                        styles.chip
                      )}
                      style={{
                        top: `calc(${dayPercent(block.top)} + 1px)`,
                        height: `calc(${dayPercent(block.height)} - 2px)`,
                        left: `calc(${(block.col * 100) / block.cols}% + 2px)`,
                        width: `calc(${100 / block.cols}% - 4px)`,
                      }}
                    >
                      {/* Full-height status stripe on the left edge */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-y-0 left-0 w-1",
                          styles.stripe
                        )}
                      />
                      <span className="truncate font-medium">
                        {block.event.title}
                      </span>
                      {block.durationMin >= MIN_MINUTES_FOR_TIMES && (
                        <span className="truncate text-[10px] tabular-nums opacity-75">
                          {formatTime(block.startTime)} –{" "}
                          {formatTime(block.endTime)}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )
          })}

          {/* Current-time indicator */}
          {todayCol !== -1 && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-0 left-12 z-20"
              style={{ top: nowTop }}
            >
              <div className="h-0.5 -translate-y-1/2 bg-primary/60" />
              <div
                className="absolute top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
                style={{ left: `${(todayCol * 100) / 7}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------- month view ------------------------------- */

function CalendarViewMonth({
  events,
  onEventClick,
  maxVisibleLanes,
  onMoreClick,
}: {
  events: NormalizedEvent[]
  onEventClick?: (event: CalendarEvent) => void
  maxVisibleLanes: number
  onMoreClick?: (date: Date, events: CalendarEvent[]) => void
}) {
  const { cursor, weekStartsOn, selected, select } = useCalendarView()

  const maxLanes = Math.max(1, maxVisibleLanes)

  // Weeks the user expanded via "+N more", keyed by week-start timestamp.
  // Stale keys from other months are harmless — they simply never match.
  const [expandedWeeks, setExpandedWeeks] = React.useState<Set<number>>(
    () => new Set()
  )

  const today = startOfDay(new Date())
  const monthWeeks = getMonthGrid(cursor, weekStartsOn)
  const label = cursor.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  })

  return (
    <>
      {/* Weekday header, labelled from the first grid row so it follows
          both the locale and `weekStartsOn`. */}
      <div className="grid grid-cols-7 gap-px">
        {monthWeeks[0].map((day) => (
          <div
            key={day.getDay()}
            className="py-1 text-center text-xs font-medium text-muted-foreground"
          >
            {day.toLocaleDateString(undefined, { weekday: "short" })}
          </div>
        ))}
      </div>

      {/* Week rows */}
      <div
        className={cn(
          "flex flex-col gap-1",
          // Rows share the leftover height, but never shrink past their
          // min-h-24 floor — so a container too short for six legible weeks
          // scrolls instead of letting the rows spill out of it.
          "min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]"
        )}
        role="grid"
        aria-label={label}
      >
        {monthWeeks.map((week) => {
          const { segments, laneCount } = layoutWeek(week[0], events)

          const weekKey = week[0].getTime()
          const overflows = laneCount > maxLanes
          const collapsed = overflows && !expandedWeeks.has(weekKey)
          const visibleSegments = collapsed
            ? segments.filter((seg) => seg.lane < maxLanes)
            : segments

          // Hidden events per day: a hidden multi-day segment counts once
          // on every day it covers, so each cell's "+N more" is that
          // day's truth.
          let moreCounts: number[] | null = null
          if (collapsed) {
            moreCounts = Array(7).fill(0)
            for (const seg of segments) {
              if (seg.lane < maxLanes) continue
              for (let col = seg.startCol; col <= seg.endCol; col++) {
                moreCounts[col]++
              }
            }
          }

          const handleMoreClick = (day: Date) => {
            if (onMoreClick) {
              onMoreClick(
                day,
                events
                  .filter((e) => e.start <= day && e.end >= day)
                  .map((e) => e.event)
              )
              return
            }
            setExpandedWeeks((prev) => new Set(prev).add(weekKey))
          }

          // Lane rows plus one extra row for "+N more" (collapsed) or
          // "Show less" (expanded).
          const laneRows = collapsed
            ? maxLanes + 1
            : laneCount + (overflows ? 1 : 0)

          return (
            <div
              key={weekKey}
              // 6rem is a flex basis, not a fixed height: with nothing
              // constraining the calendar every week row settles there, and
              // inside a sized parent the rows divide the height between them
              // — growing past 6rem when there is room, and shrinking toward
              // the floor (then scrolling) when there is not.
              className="relative h-24 min-h-12 flex-auto"
            >
              {/* Background layer: one clickable box per day — clicking
                  anywhere in the box (except an event or "+N more") selects
                  or deselects that date. */}
              <div className="absolute inset-0 grid grid-cols-7 gap-px">
                {week.map((day) => {
                  const isSelected =
                    selected !== null && isSameDay(day, selected)
                  return (
                    <button
                      key={day.getTime()}
                      type="button"
                      data-slot="calendar-view-day"
                      aria-label={day.toLocaleDateString(undefined, {
                        dateStyle: "long",
                      })}
                      aria-pressed={isSelected}
                      onClick={() => select(isSelected ? null : day)}
                      className={cn(
                        "cursor-pointer rounded-lg transition-colors hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                        day.getMonth() === cursor.getMonth()
                          ? "bg-muted/40"
                          : "bg-muted/15",
                        isSelected && "ring-2 ring-primary ring-inset"
                      )}
                    />
                  )
                })}
              </div>

              {/* Content layer: date numbers in row 1, event lanes below.
                  A multi-day segment spans its columns with grid-column,
                  so the bar runs continuously across the day cells. It
                  ignores pointer events so clicks fall through to the day
                  boxes; the event / "+N more" buttons opt back in. */}
              <div
                className="pointer-events-none relative grid grid-cols-7 gap-x-px gap-y-0.5"
                style={{
                  gridTemplateRows: `auto repeat(${Math.max(
                    laneRows,
                    1
                  )}, minmax(0, min-content))`,
                }}
              >
                {week.map((day, col) => {
                  const isToday = isSameDay(day, today)
                  const inMonth = day.getMonth() === cursor.getMonth()
                  return (
                    <div
                      key={day.getTime()}
                      role="gridcell"
                      aria-label={day.toLocaleDateString(undefined, {
                        dateStyle: "long",
                      })}
                      className="flex justify-end px-1.5 pt-1.5 pb-0.5"
                      style={{ gridColumn: col + 1, gridRow: 1 }}
                    >
                      <span
                        className={cn(
                          "flex size-6 items-center justify-center rounded-full text-xs tabular-nums",
                          isToday &&
                            "bg-primary font-semibold text-primary-foreground",
                          !isToday && !inMonth && "text-muted-foreground/60",
                          !isToday && inMonth && "text-foreground"
                        )}
                      >
                        {day.getDate()}
                      </span>
                    </div>
                  )
                })}

                {visibleSegments.map((seg) => (
                  <EventBarSegment
                    key={seg.event.id}
                    seg={seg}
                    colOffset={1}
                    rowOffset={2}
                    showTime
                    onEventClick={onEventClick}
                  />
                ))}

                {moreCounts?.map((count, col) =>
                  count > 0 ? (
                    <button
                      key={col}
                      type="button"
                      data-slot="calendar-view-more"
                      onClick={() => handleMoreClick(week[col])}
                      aria-label={`${count} more ${
                        count === 1 ? "event" : "events"
                      } on ${week[col].toLocaleDateString(undefined, {
                        dateStyle: "long",
                      })}`}
                      className="pointer-events-auto mx-0.5 rounded-md px-1.5 py-0.5 text-left text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                      style={{ gridColumn: col + 1, gridRow: maxLanes + 2 }}
                    >
                      +{count} more
                    </button>
                  ) : null
                )}

                {overflows && !collapsed && (
                  <button
                    type="button"
                    data-slot="calendar-view-less"
                    onClick={() =>
                      setExpandedWeeks((prev) => {
                        const next = new Set(prev)
                        next.delete(weekKey)
                        return next
                      })
                    }
                    className="pointer-events-auto mx-0.5 rounded-md py-0.5 text-center text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                    style={{ gridColumn: "1 / -1", gridRow: laneCount + 2 }}
                  >
                    Show less
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

/* ---------------------------------- grid ----------------------------------- */

interface CalendarViewGridProps extends React.ComponentProps<"div"> {
  events?: CalendarEvent[]
  onEventClick?: (event: CalendarEvent) => void
  /**
   * Month view only: max stacked event rows per week before the rest
   * collapse into per-day "+N more" buttons. Defaults to 3.
   */
  maxVisibleLanes?: number
  /**
   * Called when a "+N more" button is clicked, with that day and all of the
   * day's events (visible and hidden). When provided it replaces the built-in
   * behaviour of expanding the week inline — use it to open your own popover
   * or day detail.
   */
  onMoreClick?: (date: Date, events: CalendarEvent[]) => void
  /**
   * Week view: spread all 24 hours across the available height instead of
   * keeping one hour at its natural height and scrolling. Use it when the
   * calendar has been given a height and the whole day should be visible at
   * once; leave it off in a page flow, where fitting a day into the grid's
   * natural 26rem would squeeze an hour down to a few pixels.
   *
   * The month view fills its height either way.
   */
  fitDay?: boolean
}

/**
 * One calendar body (month grid or week time grid) for one set of events.
 * Must live inside a `CalendarViewProvider`; several grids under one provider
 * — e.g. one per user — follow the same controls in lockstep.
 */
function CalendarViewGrid({
  events = [],
  onEventClick,
  maxVisibleLanes = 3,
  onMoreClick,
  fitDay = false,
  className,
  ...props
}: CalendarViewGridProps) {
  const { view } = useCalendarView()

  const normalized = React.useMemo<NormalizedEvent[]>(
    () =>
      events.map((event) => {
        let startTime = toLocalDateTime(event.start)
        let endTime = toLocalDateTime(event.end ?? event.start)
        if (endTime < startTime) {
          ;[startTime, endTime] = [endTime, startTime]
        }
        const allDay =
          event.allDay ??
          !(
            hasTimeComponent(event.start) ||
            (event.end != null && hasTimeComponent(event.end))
          )
        if (!allDay && event.end == null) {
          endTime = new Date(startTime.getTime() + 3_600_000)
        }
        const start = startOfDay(startTime)
        // For timed events the day span ends the day the event ends *in* —
        // an event ending exactly at midnight still belongs to the day before.
        const end = allDay
          ? startOfDay(endTime)
          : startOfDay(
              new Date(Math.max(endTime.getTime() - 1, startTime.getTime()))
            )
        return { event, start, end, startTime, endTime, allDay }
      }),
    [events]
  )

  return (
    <div
      data-slot="calendar-view-grid"
      className={cn(
        "@container flex min-h-0 w-full flex-1 flex-col gap-2",
        className
      )}
      {...props}
    >
      {view === "week" ? (
        <CalendarViewWeek
          events={normalized}
          onEventClick={onEventClick}
          fitDay={fitDay}
        />
      ) : (
        <CalendarViewMonth
          events={normalized}
          onEventClick={onEventClick}
          maxVisibleLanes={maxVisibleLanes}
          onMoreClick={onMoreClick}
        />
      )}
    </div>
  )
}

/* ------------------------------- calendar view ----------------------------- */

interface CalendarViewProps
  extends Omit<React.ComponentProps<"div">, "onSelect">,
    Omit<CalendarViewProviderProps, "children">,
    Pick<
      CalendarViewGridProps,
      | "events"
      | "onEventClick"
      | "maxVisibleLanes"
      | "onMoreClick"
      | "fitDay"
    > {}

/**
 * The all-in-one calendar: provider + controls + a single grid. For several
 * calendars sharing one set of controls, compose `CalendarViewProvider`,
 * `CalendarViewControls`, and multiple `CalendarViewGrid`s instead.
 *
 * Takes the full width and height of its parent. When the parent has no height
 * of its own the calendar falls back to its natural size — week rows at 6rem,
 * the week view's time grid at 26rem — so it drops into a page flow unchanged;
 * give the parent a height and the rows divide it instead.
 */
function CalendarView({
  events,
  onEventClick,
  maxVisibleLanes,
  onMoreClick,
  fitDay,
  month,
  defaultMonth,
  onMonthChange,
  view,
  defaultView,
  onViewChange,
  selected,
  defaultSelected,
  onSelect,
  weekStartsOn,
  className,
  ...props
}: CalendarViewProps) {
  return (
    <CalendarViewProvider
      month={month}
      defaultMonth={defaultMonth}
      onMonthChange={onMonthChange}
      view={view}
      defaultView={defaultView}
      onViewChange={onViewChange}
      selected={selected}
      defaultSelected={defaultSelected}
      onSelect={onSelect}
      weekStartsOn={weekStartsOn}
    >
      <div
        data-slot="calendar-view"
        className={cn("flex h-full min-h-0 w-full flex-col gap-2", className)}
        {...props}
      >
        <CalendarViewControls />
        <CalendarViewGrid
          events={events}
          onEventClick={onEventClick}
          maxVisibleLanes={maxVisibleLanes}
          onMoreClick={onMoreClick}
          fitDay={fitDay}
        />
      </div>
    </CalendarViewProvider>
  )
}

export {
  CalendarView,
  CalendarViewProvider,
  CalendarViewControls,
  CalendarViewGrid,
  useCalendarView,
  type CalendarViewProps,
  type CalendarViewProviderProps,
  type CalendarViewControlsProps,
  type CalendarViewGridProps,
  type CalendarViewMode,
  type CalendarEvent,
  type CalendarEventStatus,
}

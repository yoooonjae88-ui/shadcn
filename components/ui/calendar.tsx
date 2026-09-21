"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"
import type { VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  /** Variant of the previous/next month navigation buttons. */
  buttonVariant?: VariantProps<typeof buttonVariants>["variant"]
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: CalendarProps) {
  // DayPicker memoises its formatters / class names / components on the
  // identity of these props, and rebuilds the whole calendar when any of them
  // changes. Passing fresh object literals every render would therefore remount
  // every day cell on each render — losing focus and dropping clicks that land
  // mid-render — so the merged objects are memoised and the custom components
  // are declared at module scope.
  const mergedFormatters = React.useMemo(
    () => ({
      formatMonthDropdown: (date: Date) =>
        date.toLocaleString("default", { month: "short" }),
      ...formatters,
    }),
    [formatters]
  )

  const mergedComponents = React.useMemo(
    () => ({
      Root: CalendarRoot,
      Chevron: CalendarChevron,
      DayButton: CalendarDayButton,
      WeekNumber: CalendarWeekNumber,
      ...components,
    }),
    [components]
  )

  const mergedClassNames = React.useMemo(() => {
    const defaultClassNames = getDefaultClassNames()
    return {
      root: cn("w-fit", defaultClassNames.root),
      months: cn(
        "relative flex flex-col gap-4 md:flex-row",
        defaultClassNames.months
      ),
      month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
      nav: cn(
        "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
        defaultClassNames.nav
      ),
      button_previous: cn(
        buttonVariants({ variant: buttonVariant }),
        "size-(--cell-size) select-none p-0 aria-disabled:opacity-50",
        defaultClassNames.button_previous
      ),
      button_next: cn(
        buttonVariants({ variant: buttonVariant }),
        "size-(--cell-size) select-none p-0 aria-disabled:opacity-50",
        defaultClassNames.button_next
      ),
      month_caption: cn(
        "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
        defaultClassNames.month_caption
      ),
      dropdowns: cn(
        "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
        defaultClassNames.dropdowns
      ),
      dropdown_root: cn(
        "bg-input-background has-focus:ring-ring/50 relative rounded-lg has-focus:ring-3",
        defaultClassNames.dropdown_root
      ),
      dropdown: cn(
        "bg-popover absolute inset-0 opacity-0",
        defaultClassNames.dropdown
      ),
      caption_label: cn(
        "select-none font-medium",
        captionLayout === "label"
          ? "text-sm"
          : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-lg pr-1 pl-2 text-sm [&>svg]:size-3.5",
        defaultClassNames.caption_label
      ),
      month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
      weekdays: cn("flex", defaultClassNames.weekdays),
      weekday: cn(
        "text-muted-foreground flex-1 rounded-lg text-[0.8rem] font-normal select-none",
        defaultClassNames.weekday
      ),
      week: cn("mt-2 flex w-full", defaultClassNames.week),
      week_number_header: cn(
        "w-(--cell-size) select-none",
        defaultClassNames.week_number_header
      ),
      week_number: cn(
        "text-muted-foreground text-[0.8rem] font-normal select-none",
        defaultClassNames.week_number
      ),
      day: cn(
        "group/day relative aspect-square h-full w-full p-0 text-center select-none [&:first-child[data-selected=true]_button]:rounded-l-lg [&:last-child[data-selected=true]_button]:rounded-r-lg",
        defaultClassNames.day
      ),
      range_start: cn(
        "bg-accent rounded-l-lg",
        defaultClassNames.range_start
      ),
      range_middle: cn("rounded-none", defaultClassNames.range_middle),
      range_end: cn("bg-accent rounded-r-lg", defaultClassNames.range_end),
      today: cn(
        "bg-accent text-accent-foreground rounded-lg data-[selected=true]:rounded-none",
        defaultClassNames.today
      ),
      outside: cn(
        "text-muted-foreground aria-selected:text-muted-foreground",
        defaultClassNames.outside
      ),
      disabled: cn(
        "text-muted-foreground opacity-50",
        defaultClassNames.disabled
      ),
      hidden: cn("invisible", defaultClassNames.hidden),
      ...classNames,
    }
  }, [classNames, captionLayout, buttonVariant])

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      className={cn(
        "group/calendar bg-background w-fit p-3 [--cell-size:--spacing(8)]",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      formatters={mergedFormatters}
      classNames={mergedClassNames}
      components={mergedComponents}
      {...props}
    />
  )
}

function CalendarRoot({
  className,
  rootRef,
  ...props
}: React.ComponentProps<"div"> & {
  rootRef?: React.Ref<HTMLDivElement>
}) {
  return (
    <div data-slot="calendar" ref={rootRef} className={className} {...props} />
  )
}

function CalendarChevron({
  className,
  orientation,
  ...props
}: React.ComponentProps<"svg"> & {
  orientation?: "left" | "right" | "up" | "down"
}) {
  if (orientation === "left") {
    return <ChevronLeftIcon className={cn("size-4", className)} {...props} />
  }
  if (orientation === "right") {
    return <ChevronRightIcon className={cn("size-4", className)} {...props} />
  }
  return <ChevronDownIcon className={cn("size-4", className)} {...props} />
}

function CalendarWeekNumber({
  children,
  ...props
}: React.ComponentProps<"th">) {
  return (
    <th {...props}>
      <div className="flex size-(--cell-size) items-center justify-center text-center">
        {children}
      </div>
    </th>
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <button
      ref={ref}
      type="button"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 rounded-lg leading-none font-normal",
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[selected-single=true]:hover:bg-primary data-[selected-single=true]:hover:text-primary-foreground",
        "data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-start=true]:hover:bg-primary data-[range-start=true]:hover:text-primary-foreground data-[range-start=true]:rounded-lg data-[range-start=true]:rounded-l-lg",
        "data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-end=true]:hover:bg-primary data-[range-end=true]:hover:text-primary-foreground data-[range-end=true]:rounded-lg data-[range-end=true]:rounded-r-lg",
        "data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-middle=true]:hover:bg-accent data-[range-middle=true]:hover:text-accent-foreground data-[range-middle=true]:rounded-none",
        "group-data-[focused=true]/day:ring-ring/50 group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-3",
        "[&>span]:text-xs [&>span]:opacity-70",
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }

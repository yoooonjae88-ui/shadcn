"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

type SliderSize = "sm" | "default" | "lg"

/* Size flows down from the composed <Slider> (or a bare <SliderControl>) so the
   track thickness and thumb diameter stay in step across the composable parts. */
const SliderSizeContext = React.createContext<SliderSize>("default")

// ---------------------------------------------------------------------------
// Primitives — thin wrappers over Base UI so items can be fully composed.
// ---------------------------------------------------------------------------

const sliderControlVariants = cva(
  "relative flex touch-none items-center select-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[orientation=horizontal]:w-full data-[orientation=horizontal]:min-h-5 data-[orientation=vertical]:h-40 data-[orientation=vertical]:w-5 data-[orientation=vertical]:flex-col"
)

interface SliderControlProps extends SliderPrimitive.Control.Props {
  size?: SliderSize
}

function SliderControl({ className, size, ...props }: SliderControlProps) {
  const groupSize = React.useContext(SliderSizeContext)
  const resolvedSize = size ?? groupSize
  return (
    <SliderSizeContext.Provider value={resolvedSize}>
      <SliderPrimitive.Control
        data-slot="slider-control"
        className={cn(sliderControlVariants(), className)}
        {...props}
      />
    </SliderSizeContext.Provider>
  )
}

const sliderDefaults = { size: "default" } as const

const sliderTrackVariants = cva(
  "relative grow rounded-full bg-slider-track select-none",
  {
    variants: {
      size: {
        sm: "data-[orientation=horizontal]:h-1 data-[orientation=vertical]:w-1",
        default:
          "data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:w-1.5",
        lg: "data-[orientation=horizontal]:h-2 data-[orientation=vertical]:w-2",
      },
    },
    defaultVariants: sliderDefaults,
  }
)

interface SliderTrackProps extends SliderPrimitive.Track.Props {
  size?: SliderSize
}

function SliderTrack({ className, size, ...props }: SliderTrackProps) {
  const groupSize = React.useContext(SliderSizeContext)
  const resolvedSize = size ?? groupSize
  return (
    <SliderPrimitive.Track
      data-slot="slider-track"
      className={cn(sliderTrackVariants({ size: resolvedSize }), className)}
      {...props}
    />
  )
}

function SliderIndicator({
  className,
  ...props
}: SliderPrimitive.Indicator.Props) {
  return (
    <SliderPrimitive.Indicator
      data-slot="slider-indicator"
      className={cn("rounded-full bg-slider-range select-none", className)}
      {...props}
    />
  )
}

const sliderThumbDefaults = { size: "default" } as const

const sliderThumbVariants = cva(
  "group/slider-thumb rounded-full bg-slider-thumb shadow-sm ring-2 ring-slider-thumb-ring outline-none transition-[box-shadow,transform] select-none hover:ring-[3px] focus-visible:ring-[3px] data-dragging:ring-[3px] data-dragging:scale-110 data-disabled:pointer-events-none data-disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "size-3.5",
        default: "size-4",
        lg: "size-5",
      },
    },
    defaultVariants: sliderThumbDefaults,
  }
)

interface SliderThumbProps extends SliderPrimitive.Thumb.Props {
  size?: SliderSize
  /** Optional content shown in a floating tooltip while hovering/dragging. */
  tooltip?: React.ReactNode
}

function SliderThumb({
  className,
  size,
  tooltip,
  children,
  ...props
}: SliderThumbProps) {
  const groupSize = React.useContext(SliderSizeContext)
  const resolvedSize = size ?? groupSize
  return (
    <SliderPrimitive.Thumb
      data-slot="slider-thumb"
      className={cn(sliderThumbVariants({ size: resolvedSize }), className)}
      {...props}
    >
      {children}
      {tooltip != null ? (
        <span
          data-slot="slider-tooltip"
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute z-10 rounded-md bg-primary px-2 py-1 text-xs font-medium whitespace-nowrap text-primary-foreground opacity-0 shadow-md transition-opacity duration-150",
            "group-hover/slider-thumb:opacity-100 group-focus-visible/slider-thumb:opacity-100 group-data-dragging/slider-thumb:opacity-100",
            // Horizontal: float above the thumb. Vertical: float to the right.
            "group-data-[orientation=horizontal]/slider-thumb:bottom-full group-data-[orientation=horizontal]/slider-thumb:left-1/2 group-data-[orientation=horizontal]/slider-thumb:mb-2 group-data-[orientation=horizontal]/slider-thumb:-translate-x-1/2",
            "group-data-[orientation=vertical]/slider-thumb:left-full group-data-[orientation=vertical]/slider-thumb:top-1/2 group-data-[orientation=vertical]/slider-thumb:ml-2 group-data-[orientation=vertical]/slider-thumb:-translate-y-1/2"
          )}
        >
          {tooltip}
        </span>
      ) : null}
    </SliderPrimitive.Thumb>
  )
}

function SliderValue({ className, ...props }: SliderPrimitive.Value.Props) {
  return (
    <SliderPrimitive.Value
      data-slot="slider-value"
      className={cn("text-sm font-medium tabular-nums", className)}
      {...props}
    />
  )
}

// ---------------------------------------------------------------------------
// Marks — optional tick dots (and labels) laid over the track.
// ---------------------------------------------------------------------------

interface SliderMark {
  value: number
  label?: React.ReactNode
}

interface SliderMarksProps extends React.ComponentProps<"div"> {
  marks: SliderMark[]
  min?: number
  max?: number
  orientation?: "horizontal" | "vertical"
}

function markOffset(value: number, min: number, max: number) {
  const span = max - min
  if (span <= 0) return 0
  return ((value - min) / span) * 100
}

/** Tick dots sitting on the track — render inside <SliderControl>. */
function SliderMarks({
  className,
  marks,
  min = 0,
  max = 100,
  orientation = "horizontal",
  ...props
}: SliderMarksProps) {
  const vertical = orientation === "vertical"
  return (
    <div
      data-slot="slider-marks"
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
      {...props}
    >
      {marks.map((mark) => {
        const offset = markOffset(mark.value, min, max)
        return (
          <span
            key={mark.value}
            className="absolute block size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slider-mark"
            style={
              vertical
                ? { bottom: `${offset}%`, left: "50%" }
                : { left: `${offset}%`, top: "50%" }
            }
          />
        )
      })}
    </div>
  )
}

/** Value labels aligned under (or beside) the ticks — render outside the Control. */
function SliderMarkLabels({
  className,
  marks,
  min = 0,
  max = 100,
  orientation = "horizontal",
  ...props
}: SliderMarksProps) {
  const vertical = orientation === "vertical"
  return (
    <div
      data-slot="slider-mark-labels"
      className={cn(
        "relative text-xs text-muted-foreground",
        vertical ? "h-full w-8" : "h-4 w-full",
        className
      )}
      {...props}
    >
      {marks
        .filter((mark) => mark.label != null)
        .map((mark) => {
          const offset = markOffset(mark.value, min, max)
          return (
            <span
              key={mark.value}
              className={cn(
                "absolute whitespace-nowrap",
                vertical ? "left-0 -translate-y-1/2" : "-translate-x-1/2"
              )}
              style={
                vertical ? { bottom: `${offset}%` } : { left: `${offset}%` }
              }
            >
              {mark.label}
            </span>
          )
        })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Composed convenience component.
// ---------------------------------------------------------------------------

type SliderValueType = number | readonly number[]

function toArray(value: SliderValueType | undefined): readonly number[] {
  if (value == null) return [0]
  return Array.isArray(value) ? value : [value as number]
}

interface SliderProps
  extends Omit<
    SliderPrimitive.Root.Props,
    "value" | "defaultValue" | "onValueChange" | "render" | "children"
  > {
  value?: SliderValueType
  defaultValue?: SliderValueType
  onValueChange?: (
    value: SliderValueType,
    eventDetails: SliderPrimitive.Root.ChangeEventDetails
  ) => void
  /** Control thickness / thumb diameter. */
  size?: SliderSize
  /** Show a floating value tooltip on each thumb. Pass a function to format. */
  tooltip?: boolean | ((value: number) => React.ReactNode)
  /** Tick marks. `true` derives them from `step`; pass an array for labels. */
  marks?: boolean | SliderMark[]
}

function Slider({
  className,
  size = sliderDefaults.size,
  orientation = "horizontal",
  tooltip = false,
  marks,
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  ...props
}: SliderProps) {
  // Track uncontrolled values locally so thumb tooltips can show the live
  // number; when controlled, `value` is the source of truth.
  const [internalValues, setInternalValues] = React.useState<readonly number[]>(
    () => toArray(value ?? defaultValue)
  )
  const displayValues = value !== undefined ? toArray(value) : internalValues

  const thumbCount = toArray(value ?? defaultValue).length

  const resolvedMarks: SliderMark[] | undefined = React.useMemo(() => {
    if (!marks) return undefined
    if (Array.isArray(marks)) return marks
    const out: SliderMark[] = []
    for (let v = min; v <= max; v += step) out.push({ value: v })
    return out
  }, [marks, min, max, step])

  const formatTooltip = (v: number) =>
    typeof tooltip === "function" ? tooltip(v) : v

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      orientation={orientation}
      min={min}
      max={max}
      step={step}
      value={value as never}
      defaultValue={defaultValue as never}
      onValueChange={(next, details) => {
        setInternalValues(toArray(next))
        onValueChange?.(next, details)
      }}
      className={cn(
        "relative flex touch-none select-none data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:gap-2 data-[orientation=vertical]:h-full data-[orientation=vertical]:flex-row data-[orientation=vertical]:gap-2",
        className
      )}
      {...props}
    >
      <SliderSizeContext.Provider value={size}>
        <SliderControl>
          <SliderTrack>
            <SliderIndicator />
            {resolvedMarks ? (
              <SliderMarks
                marks={resolvedMarks}
                min={min}
                max={max}
                orientation={orientation}
              />
            ) : null}
            {Array.from({ length: thumbCount }).map((_, index) => (
              <SliderThumb
                key={index}
                index={index}
                tooltip={
                  tooltip
                    ? formatTooltip(displayValues[index] ?? min)
                    : undefined
                }
              />
            ))}
          </SliderTrack>
        </SliderControl>
        {resolvedMarks?.some((mark) => mark.label != null) ? (
          <SliderMarkLabels
            marks={resolvedMarks}
            min={min}
            max={max}
            orientation={orientation}
          />
        ) : null}
      </SliderSizeContext.Provider>
    </SliderPrimitive.Root>
  )
}

export {
  Slider,
  SliderControl,
  SliderTrack,
  SliderIndicator,
  SliderThumb,
  SliderValue,
  SliderMarks,
  SliderMarkLabels,
  sliderControlVariants,
  sliderTrackVariants,
  sliderThumbVariants,
}
export { SliderPrimitive }
export type {
  SliderProps,
  SliderControlProps,
  SliderTrackProps,
  SliderThumbProps,
  SliderMark,
  SliderMarksProps,
  SliderSize,
}

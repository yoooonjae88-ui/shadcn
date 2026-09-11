"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// A Segmented control modelled on Ant Design's Segmented
// (https://ant.design/components/segmented). Every colour comes from a
// `--segmented-*` token (see app/globals.css and the item's `cssVars` in
// registry.json) so the whole control is restyleable from one place — no
// hard-coded hex / named Tailwind colours live in the component.

type SegmentedValue = string | number

type SegmentedSize = "large" | "middle" | "small"

type SegmentedShape = "default" | "round"

interface SegmentedOption {
  /** Display content. Falls back to `value` when neither label nor icon is set. */
  label?: React.ReactNode
  /** The value stored / reported on selection. */
  value: SegmentedValue
  /** Leading icon (or any node) rendered before the label. */
  icon?: React.ReactNode
  /** Disable just this segment. */
  disabled?: boolean
  /** Extra class names for this segment. */
  className?: string
  /** Native tooltip shown on hover. */
  title?: string
}

/** Options may be bare strings/numbers or full option objects. */
type SegmentedRawOption = SegmentedValue | SegmentedOption

interface SegmentedProps
  extends Omit<
    React.ComponentProps<"div">,
    "onChange" | "defaultValue" | "children"
  > {
  /** The available segments. */
  options: SegmentedRawOption[]
  /** Controlled selected value. */
  value?: SegmentedValue
  /** Uncontrolled initial value (defaults to the first enabled option). */
  defaultValue?: SegmentedValue
  /** Fired with the next value whenever the selection changes. */
  onChange?: (value: SegmentedValue) => void
  /** Disable the whole control. */
  disabled?: boolean
  /** Control height/typography preset. */
  size?: SegmentedSize
  /** Stretch the control to fill its parent, splitting segments evenly. */
  block?: boolean
  /** Stack the segments vertically instead of in a row. */
  vertical?: boolean
  /** Segment corner shape. */
  shape?: SegmentedShape
  /** `name` for the underlying radio inputs (auto-generated if omitted). */
  name?: string
}

interface NormalizedOption {
  label: React.ReactNode
  value: SegmentedValue
  icon?: React.ReactNode
  disabled: boolean
  className?: string
  title?: string
}

function normalizeOptions(options: SegmentedRawOption[]): NormalizedOption[] {
  return options.map((option) => {
    if (typeof option === "object" && option !== null) {
      // Icon-only options deliberately leave `label` undefined; otherwise fall
      // back to the value so bare `{ value }` objects still render something.
      const label =
        option.label !== undefined
          ? option.label
          : option.icon !== undefined
            ? undefined
            : option.value
      return {
        label,
        value: option.value,
        icon: option.icon,
        disabled: option.disabled ?? false,
        className: option.className,
        title: option.title,
      }
    }
    return { label: option, value: option, disabled: false }
  })
}

// Nearest enabled option to `start`, searching outward and preferring the
// previous (lower-index) side — used to keep a selection when the current one
// is removed from a dynamic `options` list.
function findNearestEnabledIndex(
  items: NormalizedOption[],
  start: number
): number {
  if (items[start] && !items[start].disabled) return start
  for (let distance = 1; distance < items.length; distance += 1) {
    const prev = start - distance
    if (items[prev] && !items[prev].disabled) return prev
    const next = start + distance
    if (items[next] && !items[next].disabled) return next
  }
  return -1
}

// Height / typography / spacing per size preset.
const sizeClasses: Record<SegmentedSize, string> = {
  small: "min-h-6 gap-1 px-2 text-xs [&_svg]:size-3.5",
  middle: "min-h-7 gap-1.5 px-2.5 text-sm [&_svg]:size-4",
  large: "min-h-9 gap-2 px-3 text-base [&_svg]:size-4.5",
}

function Segmented({
  options,
  value: valueProp,
  defaultValue,
  onChange,
  disabled = false,
  size = "middle",
  block = false,
  vertical = false,
  shape = "default",
  name,
  className,
  ...props
}: SegmentedProps) {
  const items = React.useMemo(() => normalizeOptions(options), [options])

  const generatedName = React.useId()
  const groupName = name ?? generatedName

  const firstEnabled = items.find((item) => !item.disabled)?.value
  const isControlled = valueProp !== undefined
  const [internalValue, setInternalValue] = React.useState<
    SegmentedValue | undefined
  >(() => defaultValue ?? firstEnabled)
  const value = isControlled ? valueProp : internalValue

  // Remembers where the selection last sat so that, when a dynamic `options`
  // list drops the selected item, we can fall back to the option now nearest
  // that slot (the previous one when the tail is removed).
  const [lastValidIndex, setLastValidIndex] = React.useState(0)
  let selectedIndex = items.findIndex((item) => item.value === value)

  if (!isControlled && selectedIndex === -1 && items.length > 0) {
    const fallback = findNearestEnabledIndex(
      items,
      Math.min(lastValidIndex, items.length - 1)
    )
    if (fallback !== -1) {
      selectedIndex = fallback
      // Commit the fallback during render (a supported, guarded React bail-out)
      // so the removed value can't resurrect if that option is re-added later.
      setInternalValue(items[fallback].value)
    }
  }

  if (selectedIndex >= 0 && selectedIndex !== lastValidIndex) {
    setLastValidIndex(selectedIndex)
  }

  const handleChange = React.useCallback(
    (next: SegmentedValue) => {
      if (disabled) return
      if (!isControlled) setInternalValue(next)
      onChange?.(next)
    },
    [disabled, isControlled, onChange]
  )

  // ---- Sliding thumb ------------------------------------------------------
  // The selected pill is a single absolutely-positioned element that slides to
  // sit behind the active segment, measured from that segment's box.
  const containerRef = React.useRef<HTMLDivElement>(null)
  const itemRefs = React.useRef<(HTMLLabelElement | null)[]>([])
  const [thumbStyle, setThumbStyle] = React.useState<React.CSSProperties>({
    opacity: 0,
  })
  // Skip the transition on the very first measure so the thumb doesn't slide in
  // from the corner on mount.
  const [ready, setReady] = React.useState(false)

  const measure = React.useCallback(() => {
    const el = itemRefs.current[selectedIndex]
    if (!el) {
      setThumbStyle({ opacity: 0 })
      return
    }
    setThumbStyle(
      vertical
        ? {
            width: el.offsetWidth,
            height: el.offsetHeight,
            transform: `translateY(${el.offsetTop}px)`,
            opacity: 1,
          }
        : {
            width: el.offsetWidth,
            height: el.offsetHeight,
            transform: `translateX(${el.offsetLeft}px)`,
            opacity: 1,
          }
    )
  }, [selectedIndex, vertical])

  React.useLayoutEffect(() => {
    measure()
  }, [measure, items, size, block, shape])

  React.useEffect(() => {
    // Enable the slide transition only after the first paint (in a rAF, so the
    // initial position is set without animating in from the corner).
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  React.useEffect(() => {
    const node = containerRef.current
    if (!node || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(() => measure())
    observer.observe(node)
    return () => observer.disconnect()
  }, [measure])

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      data-slot="segmented"
      data-disabled={disabled || undefined}
      className={cn(
        "relative isolate inline-flex p-0.5 text-segmented-foreground",
        "bg-segmented-track",
        shape === "round" ? "rounded-full" : "rounded-lg",
        vertical ? "flex-col" : "flex-row",
        block && "flex w-full",
        disabled && "cursor-not-allowed opacity-60",
        className
      )}
      {...props}
    >
      {/* Sliding selected pill */}
      <span
        aria-hidden="true"
        data-slot="segmented-thumb"
        className={cn(
          "pointer-events-none absolute left-0.5 top-0.5 z-0 bg-segmented-thumb shadow-sm",
          shape === "round" ? "rounded-full" : "rounded-md",
          ready && "transition-all duration-300 ease-out"
        )}
        style={thumbStyle}
      />

      {items.map((item, index) => {
        const selected = index === selectedIndex
        const itemDisabled = disabled || item.disabled

        return (
          <label
            key={String(item.value)}
            ref={(node) => {
              itemRefs.current[index] = node
            }}
            title={item.title}
            data-slot="segmented-item"
            data-selected={selected || undefined}
            data-disabled={itemDisabled || undefined}
            className={cn(
              "relative z-[1] inline-flex select-none items-center justify-center rounded-md text-center transition-colors",
              "[&_svg]:pointer-events-none [&_svg]:shrink-0",
              sizeClasses[size],
              shape === "round" && "rounded-full",
              vertical && "w-full",
              block && !vertical && "min-w-0 flex-1",
              itemDisabled
                ? "cursor-not-allowed opacity-40"
                : "cursor-pointer",
              selected
                ? "text-segmented-thumb-foreground"
                : !itemDisabled &&
                    "hover:bg-segmented-item-hover hover:text-segmented-foreground-hover",
              item.className
            )}
          >
            <input
              type="radio"
              name={groupName}
              value={String(item.value)}
              checked={selected}
              disabled={itemDisabled}
              onChange={() => handleChange(item.value)}
              className="peer sr-only"
            />
            <span className="inline-flex items-center justify-center gap-[inherit] rounded-[inherit] px-0.5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring">
              {item.icon != null && (
                <span className="inline-flex shrink-0 items-center">
                  {item.icon}
                </span>
              )}
              {item.label != null && (
                <span className="truncate">{item.label}</span>
              )}
            </span>
          </label>
        )
      })}
    </div>
  )
}

export {
  Segmented,
  type SegmentedProps,
  type SegmentedOption,
  type SegmentedValue,
  type SegmentedSize,
  type SegmentedShape,
}

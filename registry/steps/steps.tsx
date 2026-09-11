"use client"

import * as React from "react"
import { Check, LoaderCircle, X } from "lucide-react"

import { cn } from "@/lib/utils"

// "error" and the loading flag are additive on top of the original
// complete/active/upcoming model, so existing consumers that never set the new
// props keep the exact same three-state behaviour.
type StepState = "complete" | "active" | "upcoming" | "error"
type StepsOrientation = "horizontal" | "vertical"
// "progress" renders each indicator as a full-width bar instead of a circle,
// for progress-bar / segmented steppers. Height and rounding stay overridable
// via className (they merge cleanly, unlike the circle's `size-*`).
type StepsVariant = "default" | "dot" | "progress"

// Optional per-state indicator overrides supplied on the root <Steps>. They take
// priority over an item's own indicator children, which in turn fall back to the
// built-in number/check/dot/spinner/cross. Mirrors ReUI's `indicators` prop.
type StepsIndicators = {
  complete?: React.ReactNode
  active?: React.ReactNode
  upcoming?: React.ReactNode
  loading?: React.ReactNode
  error?: React.ReactNode
}

const StepsContext = React.createContext<{
  value: number
  setValue: (step: number) => void
  orientation: StepsOrientation
  variant: StepsVariant
  indicators?: StepsIndicators
  // Trigger registry powers roving-focus keyboard navigation between the
  // clickable <StepsTrigger> buttons. Unused when steps aren't interactive.
  registerTrigger: (node: HTMLButtonElement | null) => void
  triggerNodes: HTMLButtonElement[]
  focusNext: (currentIdx: number) => void
  focusPrev: (currentIdx: number) => void
  focusFirst: () => void
  focusLast: () => void
}>({
  value: 1,
  setValue: () => {},
  orientation: "horizontal",
  variant: "default",
  registerTrigger: () => {},
  triggerNodes: [],
  focusNext: () => {},
  focusPrev: () => {},
  focusFirst: () => {},
  focusLast: () => {},
})

const StepsItemContext = React.createContext<{
  step: number
  state: StepState
  loading: boolean
  disabled: boolean
}>({ step: 1, state: "upcoming", loading: false, disabled: false })

function useStepsContext() {
  return React.useContext(StepsContext)
}

function useStepsItem() {
  return React.useContext(StepsItemContext)
}

function Steps({
  value,
  defaultValue = 1,
  onValueChange,
  orientation = "horizontal",
  variant = "default",
  indicators,
  className,
  ...props
}: React.ComponentProps<"ol"> & {
  /** Controlled active step (1-based). Omit to run uncontrolled. */
  value?: number
  /** Initial active step when uncontrolled. */
  defaultValue?: number
  /** Called with the next step when a trigger is activated. */
  onValueChange?: (value: number) => void
  orientation?: StepsOrientation
  variant?: StepsVariant
  /** Per-state indicator overrides applied to every step. */
  indicators?: StepsIndicators
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const setValue = React.useCallback(
    (step: number) => {
      if (!isControlled) setInternalValue(step)
      onValueChange?.(step)
    },
    [isControlled, onValueChange]
  )

  const [triggerNodes, setTriggerNodes] = React.useState<HTMLButtonElement[]>(
    []
  )
  const registerTrigger = React.useCallback(
    (node: HTMLButtonElement | null) => {
      setTriggerNodes((prev) => {
        if (node && !prev.includes(node)) return [...prev, node]
        if (!node) return prev.filter((n) => n.isConnected)
        return prev
      })
    },
    []
  )

  const focusTrigger = React.useCallback(
    (idx: number) => {
      const nodes = triggerNodes.filter((n) => !n.disabled)
      if (nodes.length) nodes[(idx + nodes.length) % nodes.length]?.focus()
    },
    [triggerNodes]
  )
  const focusNext = React.useCallback(
    (i: number) => focusTrigger(i + 1),
    [focusTrigger]
  )
  const focusPrev = React.useCallback(
    (i: number) => focusTrigger(i - 1),
    [focusTrigger]
  )
  const focusFirst = React.useCallback(() => focusTrigger(0), [focusTrigger])
  const focusLast = React.useCallback(
    () => focusTrigger(triggerNodes.length - 1),
    [focusTrigger, triggerNodes.length]
  )

  const contextValue = React.useMemo(
    () => ({
      value: currentValue,
      setValue,
      orientation,
      variant,
      indicators,
      registerTrigger,
      triggerNodes,
      focusNext,
      focusPrev,
      focusFirst,
      focusLast,
    }),
    [
      currentValue,
      setValue,
      orientation,
      variant,
      indicators,
      registerTrigger,
      triggerNodes,
      focusNext,
      focusPrev,
      focusFirst,
      focusLast,
    ]
  )

  return (
    <StepsContext.Provider value={contextValue}>
      <ol
        data-slot="steps"
        data-orientation={orientation}
        className={cn(
          "flex w-full",
          orientation === "horizontal" ? "items-start" : "flex-col",
          className
        )}
        {...props}
      />
    </StepsContext.Provider>
  )
}

function StepsItem({
  step,
  completed = false,
  loading = false,
  error = false,
  disabled = false,
  className,
  ...props
}: React.ComponentProps<"li"> & {
  step: number
  /** Force the completed state regardless of the current value. */
  completed?: boolean
  /** Show a spinner while this step (when active) is doing async work. */
  loading?: boolean
  /** Mark the step as failed. */
  error?: boolean
  /** Disable the step's trigger. */
  disabled?: boolean
}) {
  const { value, orientation } = React.useContext(StepsContext)
  const state: StepState = error
    ? "error"
    : completed || step < value
      ? "complete"
      : step === value
        ? "active"
        : "upcoming"

  // Loading only reads while the step is the active one and hasn't errored.
  const isLoading = loading && step === value && !error

  return (
    <StepsItemContext.Provider
      value={{ step, state, loading: isLoading, disabled }}
    >
      <li
        data-slot="steps-item"
        data-state={state}
        data-orientation={orientation}
        data-loading={isLoading || undefined}
        aria-current={state === "active" ? "step" : undefined}
        className={cn(
          "group/step",
          // Horizontal: indicator, content and connector sit on one row, each
          // step sized to its content so the connector keeps a fixed length
          // (rather than absorbing leftover space and varying per step).
          // Vertical: a two-column grid. The indicator sits in row 1, the
          // connector in row 2 of the gutter, and the content spans both rows
          // so it never stretches the indicator's row — keeping the connector
          // centered between this step's indicator and the next one's.
          orientation === "horizontal"
            ? "flex items-start gap-3"
            : "grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-x-3",
          className
        )}
        {...props}
      />
    </StepsItemContext.Provider>
  )
}

// Resolves the root-level `indicators` override for the current step state.
function pickIndicator(
  indicators: StepsIndicators | undefined,
  state: StepState,
  isLoading: boolean
): React.ReactNode {
  if (!indicators) return undefined
  return isLoading ? indicators.loading : indicators[state]
}

function StepsIndicator({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { variant, indicators } = React.useContext(StepsContext)
  const { step, state, loading } = React.useContext(StepsItemContext)

  // A custom icon (e.g. a clock for a timeline) is passed as children and
  // replaces the default number/check/dot for every state. Icons are sized
  // via `[&_svg]:size-4` so consumers can drop in an unsized lucide icon.
  // Priority: root `indicators` override → per-item children → built-in.
  const override = pickIndicator(indicators, state, loading) ?? children

  if (variant === "dot") {
    return (
      <div
        data-slot="steps-indicator"
        data-state={state}
        data-variant="dot"
        className={cn(
          "flex size-7 shrink-0 items-center justify-center [&_svg]:size-4",
          className
        )}
        {...props}
      >
        {override ? (
          <span
            aria-hidden
            className={cn(
              "flex items-center justify-center transition-colors",
              state === "error"
                ? "text-steps-dot-error"
                : state === "upcoming"
                  ? "text-steps-dot-icon-upcoming"
                  : "text-steps-dot-icon"
            )}
          >
            {override}
          </span>
        ) : loading ? (
          <LoaderCircle
            aria-hidden
            className="size-4 animate-spin text-steps-dot-icon"
          />
        ) : (
          <span
            aria-hidden
            className={cn(
              "rounded-full transition-all",
              state === "complete" && "size-2.5 bg-steps-dot-complete",
              state === "active" &&
                "size-3 bg-steps-dot-active ring-4 ring-steps-dot-active-ring",
              state === "upcoming" && "size-2.5 bg-steps-dot-upcoming",
              state === "error" && "size-2.5 bg-steps-dot-error"
            )}
          />
        )}
      </div>
    )
  }

  if (variant === "progress") {
    // A bar whose fill comes from the connector tokens: the track uses the
    // resting connector colour, active/complete use the "passed" colour, and
    // error uses the dot-error colour. Consumers usually pass an sr-only step
    // number as children; height/rounding are overridable via className.
    return (
      <div
        data-slot="steps-indicator"
        data-state={state}
        data-variant="progress"
        className={cn(
          "flex h-2 w-full shrink-0 items-center justify-center rounded-full transition-colors",
          state === "error"
            ? "bg-steps-dot-error"
            : state === "complete" || state === "active"
              ? "bg-steps-connector-complete"
              : "bg-steps-connector",
          className
        )}
        {...props}
      >
        {override ?? <span className="sr-only">{step}</span>}
      </div>
    )
  }

  return (
    <div
      data-slot="steps-indicator"
      data-state={state}
      data-variant="default"
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors [&_svg]:size-4",
        state === "complete" &&
          "bg-steps-indicator-complete text-steps-indicator-complete-foreground",
        state === "active" &&
          "bg-steps-indicator-active text-steps-indicator-active-foreground",
        state === "upcoming" &&
          "bg-steps-indicator-upcoming text-steps-indicator-upcoming-foreground",
        state === "error" &&
          "bg-steps-indicator-error text-steps-indicator-error-foreground",
        className
      )}
      {...props}
    >
      {override ??
        (loading ? (
          <LoaderCircle aria-hidden className="animate-spin" />
        ) : state === "error" ? (
          <X aria-hidden />
        ) : state === "complete" ? (
          <Check aria-hidden />
        ) : (
          step
        ))}
    </div>
  )
}

function StepsTrigger({
  asChild = false,
  className,
  children,
  onClick,
  onKeyDown,
  tabIndex,
  ...props
}: React.ComponentProps<"button"> & {
  /** Render as a passive wrapper (no button) — e.g. for non-navigable steps. */
  asChild?: boolean
}) {
  const {
    setValue,
    value,
    registerTrigger,
    triggerNodes,
    focusNext,
    focusPrev,
    focusFirst,
    focusLast,
  } = React.useContext(StepsContext)
  const { step, state, disabled } = React.useContext(StepsItemContext)
  const isSelected = value === step

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    const node = ref.current
    registerTrigger(node)
    return () => registerTrigger(null)
  }, [registerTrigger])

  if (asChild) {
    return (
      <span data-slot="steps-trigger" data-state={state} className={className}>
        {children}
      </span>
    )
  }

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      data-slot="steps-trigger"
      data-state={state}
      aria-selected={isSelected}
      aria-controls={`steps-panel-${step}`}
      id={`steps-tab-${step}`}
      tabIndex={typeof tabIndex === "number" ? tabIndex : isSelected ? 0 : -1}
      disabled={disabled}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2.5 rounded-full text-left outline-none",
        "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:z-10",
        "disabled:pointer-events-none disabled:opacity-60",
        className
      )}
      onClick={(e) => {
        setValue(step)
        onClick?.(e)
      }}
      onKeyDown={(e) => {
        // Resolve our position among the registered triggers at event time,
        // so we never read the ref during render.
        const myIdx = triggerNodes.findIndex((n) => n === e.currentTarget)
        switch (e.key) {
          case "ArrowRight":
          case "ArrowDown":
            e.preventDefault()
            if (myIdx !== -1) focusNext(myIdx)
            break
          case "ArrowLeft":
          case "ArrowUp":
            e.preventDefault()
            if (myIdx !== -1) focusPrev(myIdx)
            break
          case "Home":
            e.preventDefault()
            focusFirst()
            break
          case "End":
            e.preventDefault()
            focusLast()
            break
        }
        onKeyDown?.(e)
      }}
      {...props}
    >
      {children}
    </button>
  )
}

function StepsContent({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = React.useContext(StepsContext)

  return (
    <div
      data-slot="steps-content"
      className={cn(
        "flex flex-col gap-0.5 pt-1",
        // Vertical: live in column 2 and span both rows so the labels sit
        // alongside the connector without stretching the indicator's row.
        orientation === "vertical" &&
          "col-start-2 row-span-2 pb-6 group-last/step:pb-0",
        className
      )}
      {...props}
    />
  )
}

function StepsTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="steps-title"
      className={cn(
        "text-sm leading-none font-medium text-foreground group-data-[state=upcoming]/step:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function StepsDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="steps-description"
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function StepsSeparator({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = React.useContext(StepsContext)

  return (
    <div
      data-slot="steps-separator"
      data-orientation={orientation}
      aria-hidden="true"
      className={cn(
        "bg-steps-connector transition-colors group-data-[state=complete]/step:bg-steps-connector-complete group-last/step:hidden",
        // A fixed-length connector in both orientations so every step looks
        // consistent. Horizontal: a thin line of constant width after the
        // content. Vertical: a thin line in row 2 of the indicator's column,
        // centered under the indicator, with a minimum length that stretches
        // to connect down to the next step when the content is taller.
        orientation === "horizontal"
          ? "mt-3.5 mr-3 h-px w-12 shrink-0"
          : "col-start-1 row-start-2 my-1.5 w-px min-h-8 justify-self-center self-stretch",
        className
      )}
      {...props}
    />
  )
}

// Content panels — render one pane per step and show only the active one,
// mirroring ReUI's StepperPanel/StepperContent. `forceMount` keeps a pane in
// the DOM (hidden) so its state survives step changes.

function StepsPanels({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="steps-panels" className={cn("w-full", className)} {...props} />
  )
}

function StepsPanel({
  value,
  forceMount,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  /** The 1-based step this panel belongs to. */
  value: number
  /** Keep mounted (hidden) when inactive. */
  forceMount?: boolean
}) {
  const { value: activeValue } = React.useContext(StepsContext)
  const isActive = value === activeValue

  if (!isActive && !forceMount) return null

  return (
    <div
      data-slot="steps-panel"
      data-state={isActive ? "active" : "inactive"}
      role="tabpanel"
      id={`steps-panel-${value}`}
      aria-labelledby={`steps-tab-${value}`}
      hidden={!isActive && forceMount ? true : undefined}
      className={cn("w-full", !isActive && forceMount && "hidden", className)}
      {...props}
    />
  )
}

export {
  Steps,
  StepsItem,
  StepsTrigger,
  StepsIndicator,
  StepsContent,
  StepsTitle,
  StepsDescription,
  StepsSeparator,
  StepsPanels,
  StepsPanel,
  useStepsContext,
  useStepsItem,
}

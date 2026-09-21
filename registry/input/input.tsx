"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { Eye, EyeOff, LoaderCircle, Search, X } from "lucide-react"

import { cn } from "@/lib/utils"

type InputSize = "small" | "middle" | "large"
type InputVariant = "outlined" | "filled" | "borderless" | "underlined"
type InputStatus = "error" | "warning"

/*
 * The "frame" is the element that looks like the input: the affix wrapper
 * around prefix / field / clear / count / suffix. Focus styling uses
 * focus-within so it lights up no matter which inner element holds focus
 * (:focus-within also matches the element itself, so the same classes work on
 * the bare OTP cells).
 */
const inputDefaults = { variant: "filled", size: "middle" } as const

const inputVariants = cva(
  "relative inline-flex w-full min-w-0 cursor-text items-center gap-1.5 border border-transparent bg-clip-padding text-foreground transition-[color,background-color,border-color,box-shadow] outline-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        outlined:
          "border-input hover:border-ring/70 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 hover:focus-within:border-ring",
        filled:
          "bg-input-background focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        borderless: "bg-transparent",
        underlined:
          "border-b-input hover:border-b-ring/70 focus-within:border-b-ring hover:focus-within:border-b-ring",
      },
      size: {
        small:
          "h-6 gap-1 rounded-md px-2 text-sm [&_svg:not([class*='size-'])]:size-3.5",
        middle: "h-8 rounded-lg px-2.5 text-sm [&_svg:not([class*='size-'])]:size-4",
        large: "h-10 rounded-lg px-3 text-base [&_svg:not([class*='size-'])]:size-4",
      },
    },
    compoundVariants: [
      // Underlined draws only the bottom edge: keep the transparent border on
      // the other sides for layout stability, square the corners, flush text.
      { variant: "underlined", className: "rounded-none px-0" },
    ],
    defaultVariants: inputDefaults,
  }
)

/* Status colouring depends on the variant it lands on, so it lives outside
 * the cva and is appended after it (tailwind-merge lets it win). */
function inputStatusClasses(variant: InputVariant, status?: InputStatus) {
  if (!status) return null
  const error = status === "error"
  switch (variant) {
    case "outlined":
      return error
        ? "border-destructive hover:border-destructive focus-within:border-destructive focus-within:ring-destructive/20"
        : "border-input-warning hover:border-input-warning focus-within:border-input-warning focus-within:ring-input-warning/20"
    case "filled":
      return error
        ? "bg-destructive/10 focus-within:border-destructive focus-within:ring-destructive/20"
        : "bg-input-warning/10 focus-within:border-input-warning focus-within:ring-input-warning/20"
    case "underlined":
      return error
        ? "border-b-destructive hover:border-b-destructive focus-within:border-b-destructive"
        : "border-b-input-warning hover:border-b-input-warning focus-within:border-b-input-warning"
    case "borderless":
      return error ? "text-destructive" : "text-input-warning"
  }
}

const inputAddonDefaults = { size: "middle" } as const

const inputAddonVariants = cva(
  "flex shrink-0 items-center justify-center bg-input-addon text-muted-foreground [&_svg]:shrink-0",
  {
    variants: {
      size: {
        small:
          "rounded-md px-2 text-sm [&_svg:not([class*='size-'])]:size-3.5",
        middle: "rounded-lg px-2.5 text-sm [&_svg:not([class*='size-'])]:size-4",
        large: "rounded-lg px-3 text-base [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: inputAddonDefaults,
  }
)

const fieldClasses =
  "h-full w-full min-w-0 flex-1 bg-transparent text-inherit outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"

function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node)
      else if (ref) (ref as React.RefObject<T | null>).current = node
    }
  }
}

/* Move focus into the field when the frame chrome (padding, prefix icon…) is
 * clicked, without stealing focus from interactive children. */
function focusFieldFromFrame(
  event: React.PointerEvent,
  field: HTMLInputElement | HTMLTextAreaElement | null
) {
  const target = event.target as HTMLElement
  if (target.closest("input, textarea, button, a, select, label")) return
  event.preventDefault()
  field?.focus()
}

/* Clear the field natively and dispatch an `input` event so React fires the
 * regular onChange, for controlled and uncontrolled usage alike. */
function clearNatively(
  el: HTMLInputElement | HTMLTextAreaElement,
  proto: typeof HTMLInputElement | typeof HTMLTextAreaElement
) {
  const setter = Object.getOwnPropertyDescriptor(proto.prototype, "value")?.set
  setter?.call(el, "")
  el.dispatchEvent(new Event("input", { bubbles: true }))
  el.focus()
}

interface CountFormatterArgs {
  value: string
  count: number
  maxLength?: number
}

/** Legacy antd-style `showCount`: boolean or a custom formatter. */
type ShowCount =
  | boolean
  | { formatter: (args: CountFormatterArgs) => React.ReactNode }

/** antd-style advanced `count` config; takes precedence over `showCount`. */
interface CountConfig {
  /** Max characters; the count turns destructive when exceeded. */
  max?: number
  /** Custom counting strategy, e.g. count grapheme clusters or emoji as 1. */
  strategy?: (value: string) => number
  /** Show the counter; a function fully customises the rendered node. */
  show?: boolean | ((args: CountFormatterArgs) => React.ReactNode)
  /** Cut/transform the value once `max` is exceeded. */
  exceedFormatter?: (value: string, config: { max: number }) => string
}

interface ResolvedCount {
  show: boolean
  max?: number
  strategy: (value: string) => number
  /** Runs the configured exceedFormatter once the value passes `max`. */
  clamp: (value: string) => string
  render: (value: string) => React.ReactNode
  exceeded: (value: string) => boolean
}

function resolveCount(
  count: CountConfig | undefined,
  showCount: ShowCount | undefined,
  maxLength: number | undefined
): ResolvedCount {
  const strategy = count?.strategy ?? ((value: string) => [...value].length)
  const max = count?.max ?? maxLength
  const show = count?.show ?? showCount ?? false
  const formatter =
    typeof show === "function"
      ? show
      : typeof show === "object"
        ? show.formatter
        : undefined
  const exceedFormatter = count?.exceedFormatter
  return {
    show: !!show,
    max,
    strategy,
    clamp: (value) =>
      exceedFormatter && max !== undefined && strategy(value) > max
        ? exceedFormatter(value, { max })
        : value,
    exceeded: (value) => max !== undefined && strategy(value) > max,
    render: (value) => {
      const current = strategy(value)
      if (formatter) return formatter({ value, count: current, maxLength: max })
      return max === undefined ? `${current}` : `${current} / ${max}`
    },
  }
}

interface InputSlotClassNames {
  /** The affix wrapper (the visible input frame). */
  affixWrapper?: string
  prefix?: string
  suffix?: string
  input?: string
  count?: string
  clear?: string
  addonBefore?: string
  addonAfter?: string
}

type InputSlotStyles = {
  [K in keyof InputSlotClassNames]?: React.CSSProperties
}

interface InputProps
  extends Omit<
      React.ComponentProps<"input">,
      "size" | "prefix" | "value" | "defaultValue"
    > {
  /** Current value (controlled). */
  value?: string
  /** Initial value (uncontrolled). */
  defaultValue?: string
  /** Control size: `small` (24px), `middle` (32px, default), `large` (40px). */
  size?: InputSize
  /** Visual variant. Defaults to `filled`; `outlined`/`underlined` draw borders. */
  variant?: InputVariant
  /** Validation status colouring. */
  status?: InputStatus
  /** Node rendered inside the frame, before the field. */
  prefix?: React.ReactNode
  /** Node rendered inside the frame, after the field. */
  suffix?: React.ReactNode
  /** Node attached outside the frame, before it (label, select…). */
  addonBefore?: React.ReactNode
  /** Node attached outside the frame, after it. */
  addonAfter?: React.ReactNode
  /** Show a clear (×) button when there is content; pass `{ clearIcon }` to customise. */
  allowClear?: boolean | { clearIcon: React.ReactNode }
  /** Show a character count (pairs with `maxLength`). */
  showCount?: ShowCount
  /** Advanced count config: custom strategy, exceed cutting, custom render. */
  count?: CountConfig
  /** Fired when Enter is pressed. */
  onPressEnter?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  /** Fired when the clear button is clicked. */
  onClear?: () => void
  /** Per-slot class overrides. */
  classNames?: InputSlotClassNames
  /** Per-slot inline styles. */
  styles?: InputSlotStyles
}

function InputBase({
  className,
  classNames,
  styles,
  style,
  size = inputDefaults.size,
  variant = inputDefaults.variant,
  status,
  disabled,
  readOnly,
  prefix,
  suffix,
  addonBefore,
  addonAfter,
  allowClear,
  showCount,
  count,
  maxLength,
  value: valueProp,
  defaultValue,
  onChange,
  onKeyDown,
  onPressEnter,
  onClear,
  ref,
  ...props
}: InputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Mirror the value so clear/count work in both controlled and uncontrolled
  // modes.
  const isControlled = valueProp !== undefined
  const [innerValue, setInnerValue] = React.useState(defaultValue ?? "")
  const mergedValue = isControlled ? (valueProp ?? "") : innerValue

  const counter = resolveCount(count, showCount, maxLength)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = counter.clamp(event.target.value)
    if (next !== event.target.value) event.target.value = next
    if (!isControlled) setInnerValue(next)
    onChange?.(event)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.key === "Enter") onPressEnter?.(event)
  }

  const showClear =
    !!allowClear && !disabled && !readOnly && mergedValue.length > 0
  const clearIcon =
    typeof allowClear === "object" ? allowClear.clearIcon : <X />

  const hasAddon = addonBefore != null || addonAfter != null

  const frame = (
    <span
      data-slot="input"
      data-variant={variant}
      data-status={status}
      data-disabled={disabled || undefined}
      onPointerDown={(event) => focusFieldFromFrame(event, inputRef.current)}
      className={cn(
        inputVariants({ variant, size }),
        inputStatusClasses(variant, status),
        disabled && "cursor-not-allowed opacity-50",
        hasAddon && "flex-1",
        addonBefore != null && "rounded-l-none",
        addonAfter != null && "rounded-r-none",
        classNames?.affixWrapper,
        !hasAddon && className
      )}
      style={{ ...styles?.affixWrapper, ...(!hasAddon ? style : undefined) }}
    >
      {prefix != null && (
        <span
          data-slot="input-prefix"
          className={cn(
            "flex shrink-0 items-center text-muted-foreground",
            classNames?.prefix
          )}
          style={styles?.prefix}
        >
          {prefix}
        </span>
      )}
      <input
        ref={composeRefs(inputRef, ref)}
        data-slot="input-field"
        disabled={disabled}
        readOnly={readOnly}
        // With an advanced count config the limit is enforced by
        // exceedFormatter (or left soft), matching antd.
        maxLength={count ? undefined : maxLength}
        {...(isControlled ? { value: mergedValue } : { defaultValue })}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={cn(fieldClasses, classNames?.input)}
        style={styles?.input}
        {...props}
      />
      {showClear && (
        <button
          type="button"
          data-slot="input-clear"
          aria-label="Clear"
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => {
            if (inputRef.current)
              clearNatively(inputRef.current, HTMLInputElement)
            onClear?.()
          }}
          className={cn(
            "flex shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground/70 outline-none transition-colors hover:text-foreground focus-visible:text-foreground [&_svg:not([class*='size-'])]:size-3.5",
            classNames?.clear
          )}
          style={styles?.clear}
        >
          {clearIcon}
        </button>
      )}
      {counter.show && (
        <span
          data-slot="input-count"
          className={cn(
            "pointer-events-none shrink-0 text-xs text-muted-foreground tabular-nums",
            counter.exceeded(mergedValue) && "text-destructive",
            classNames?.count
          )}
          style={styles?.count}
        >
          {counter.render(mergedValue)}
        </span>
      )}
      {suffix != null && (
        <span
          data-slot="input-suffix"
          className={cn(
            "flex shrink-0 items-center text-muted-foreground",
            classNames?.suffix
          )}
          style={styles?.suffix}
        >
          {suffix}
        </span>
      )}
    </span>
  )

  if (!hasAddon) return frame

  return (
    <span
      data-slot="input-group"
      className={cn("flex w-full items-stretch", className)}
      style={style}
    >
      {addonBefore != null && (
        <span
          data-slot="input-addon-before"
          className={cn(
            inputAddonVariants({ size }),
            "rounded-r-none",
            classNames?.addonBefore
          )}
          style={styles?.addonBefore}
        >
          {addonBefore}
        </span>
      )}
      {frame}
      {addonAfter != null && (
        <span
          data-slot="input-addon-after"
          className={cn(
            inputAddonVariants({ size }),
            "rounded-l-none",
            classNames?.addonAfter
          )}
          style={styles?.addonAfter}
        >
          {addonAfter}
        </span>
      )}
    </span>
  )
}

/* ------------------------------------------------------------------------ */
/* TextArea                                                                  */
/* ------------------------------------------------------------------------ */

interface InputTextAreaProps
  extends Omit<React.ComponentProps<"textarea">, "value" | "defaultValue"> {
  value?: string
  defaultValue?: string
  size?: InputSize
  variant?: InputVariant
  status?: InputStatus
  /** Grow with content; `{ minRows, maxRows }` clamps the range. */
  autoSize?: boolean | { minRows?: number; maxRows?: number }
  allowClear?: boolean | { clearIcon: React.ReactNode }
  showCount?: ShowCount
  count?: CountConfig
  onPressEnter?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onClear?: () => void
  /** Fired when the rendered size changes (drag resize, autoSize growth…). */
  onResize?: (dimensions: { width: number; height: number }) => void
  classNames?: Pick<
    InputSlotClassNames,
    "affixWrapper" | "input" | "count" | "clear"
  >
  styles?: Pick<InputSlotStyles, "affixWrapper" | "input" | "count" | "clear">
}

const textAreaSizePadding: Record<InputSize, string> = {
  small: "py-0.5",
  middle: "py-1",
  large: "py-1.5",
}

function InputTextArea({
  className,
  classNames,
  styles,
  style,
  size = inputDefaults.size,
  variant = inputDefaults.variant,
  status,
  disabled,
  readOnly,
  autoSize,
  allowClear,
  showCount,
  count,
  maxLength,
  rows,
  value: valueProp,
  defaultValue,
  onChange,
  onKeyDown,
  onPressEnter,
  onClear,
  onResize,
  ref,
  ...props
}: InputTextAreaProps) {
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null)

  const isControlled = valueProp !== undefined
  const [innerValue, setInnerValue] = React.useState(defaultValue ?? "")
  const mergedValue = isControlled ? (valueProp ?? "") : innerValue

  const counter = resolveCount(count, showCount, maxLength)

  const minRows = typeof autoSize === "object" ? autoSize.minRows : undefined
  const maxRows = typeof autoSize === "object" ? autoSize.maxRows : undefined

  React.useLayoutEffect(() => {
    const el = textAreaRef.current
    if (!el || !autoSize) return
    el.style.height = "auto"
    const cs = getComputedStyle(el)
    const lineHeight = parseFloat(cs.lineHeight) || 20
    const chrome =
      parseFloat(cs.paddingTop) +
      parseFloat(cs.paddingBottom) +
      parseFloat(cs.borderTopWidth) +
      parseFloat(cs.borderBottomWidth)
    let height = el.scrollHeight
    if (minRows) height = Math.max(height, minRows * lineHeight + chrome)
    if (maxRows) height = Math.min(height, maxRows * lineHeight + chrome)
    el.style.overflowY =
      maxRows && el.scrollHeight > height ? "auto" : "hidden"
    el.style.height = `${height}px`
  }, [autoSize, minRows, maxRows, mergedValue])

  React.useEffect(() => {
    const el = textAreaRef.current
    if (!el || !onResize) return
    const observer = new ResizeObserver(() => {
      onResize({ width: el.offsetWidth, height: el.offsetHeight })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [onResize])

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = counter.clamp(event.target.value)
    if (next !== event.target.value) event.target.value = next
    if (!isControlled) setInnerValue(next)
    onChange?.(event)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown?.(event)
    if (event.key === "Enter") onPressEnter?.(event)
  }

  const showClear =
    !!allowClear && !disabled && !readOnly && mergedValue.length > 0
  const clearIcon =
    typeof allowClear === "object" ? allowClear.clearIcon : <X />

  return (
    <span
      data-slot="input-textarea"
      data-variant={variant}
      data-status={status}
      data-disabled={disabled || undefined}
      onPointerDown={(event) => focusFieldFromFrame(event, textAreaRef.current)}
      className={cn(
        inputVariants({ variant, size }),
        "h-auto flex-col items-stretch gap-0",
        textAreaSizePadding[size],
        inputStatusClasses(variant, status),
        disabled && "cursor-not-allowed opacity-50",
        classNames?.affixWrapper,
        className
      )}
      style={{ ...styles?.affixWrapper, ...style }}
    >
      <textarea
        ref={composeRefs(textAreaRef, ref)}
        data-slot="input-textarea-field"
        disabled={disabled}
        readOnly={readOnly}
        maxLength={count ? undefined : maxLength}
        rows={rows ?? minRows ?? (autoSize ? 1 : undefined)}
        {...(isControlled ? { value: mergedValue } : { defaultValue })}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={cn(
          fieldClasses,
          // flex-none: a flex-basis of 0 from flex-1 would override the
          // inline height that autoSize sets on this column flex item.
          "h-auto flex-none leading-6",
          autoSize ? "resize-none" : "resize-y",
          showClear && "pr-5",
          classNames?.input
        )}
        style={styles?.input}
        {...props}
      />
      {showClear && (
        <button
          type="button"
          data-slot="input-clear"
          aria-label="Clear"
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => {
            if (textAreaRef.current)
              clearNatively(textAreaRef.current, HTMLTextAreaElement)
            onClear?.()
          }}
          className={cn(
            "absolute top-1.5 right-2 flex cursor-pointer items-center justify-center rounded-full text-muted-foreground/70 outline-none transition-colors hover:text-foreground focus-visible:text-foreground [&_svg:not([class*='size-'])]:size-3.5",
            classNames?.clear
          )}
          style={styles?.clear}
        >
          {clearIcon}
        </button>
      )}
      {counter.show && (
        <span
          data-slot="input-count"
          className={cn(
            "pointer-events-none self-end text-xs text-muted-foreground tabular-nums",
            counter.exceeded(mergedValue) && "text-destructive",
            classNames?.count
          )}
          style={styles?.count}
        >
          {counter.render(mergedValue)}
        </span>
      )}
    </span>
  )
}

/* ------------------------------------------------------------------------ */
/* Search                                                                    */
/* ------------------------------------------------------------------------ */

interface InputSearchProps extends Omit<InputProps, "addonAfter"> {
  /** `true` renders a primary icon button; a node renders a primary button with that content. */
  enterButton?: boolean | React.ReactNode
  /** Swap the search icon for a spinner and disable searching. */
  loading?: boolean
  onSearch?: (
    value: string,
    event?: React.SyntheticEvent,
    info?: { source: "input" | "clear" }
  ) => void
}

function InputSearch({
  className,
  style,
  enterButton = false,
  loading = false,
  onSearch,
  onPressEnter,
  onClear,
  size = inputDefaults.size,
  variant = inputDefaults.variant,
  status,
  disabled,
  ref,
  ...props
}: InputSearchProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const isPrimary = enterButton !== false && enterButton != null
  const buttonContent = loading ? (
    <LoaderCircle className="animate-spin" />
  ) : enterButton === true || enterButton === false || enterButton == null ? (
    <Search />
  ) : (
    enterButton
  )

  const triggerSearch = (event: React.SyntheticEvent) => {
    if (loading || disabled) return
    onSearch?.(inputRef.current?.value ?? "", event, { source: "input" })
  }

  return (
    <span
      data-slot="input-search"
      className={cn("flex w-full items-stretch", className)}
      style={style}
    >
      <Input
        ref={composeRefs(inputRef, ref)}
        size={size}
        variant={variant}
        status={status}
        disabled={disabled}
        className="flex-1 rounded-r-none"
        onPressEnter={(event) => {
          onPressEnter?.(event)
          triggerSearch(event)
        }}
        onClear={() => {
          onClear?.()
          onSearch?.("", undefined, { source: "clear" })
        }}
        {...props}
      />
      <button
        type="button"
        data-slot="input-search-button"
        aria-label="Search"
        disabled={disabled || loading}
        onClick={triggerSearch}
        className={cn(
          "flex shrink-0 cursor-pointer items-center justify-center outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:shrink-0",
          size === "small" &&
            "rounded-md px-2 text-sm [&_svg:not([class*='size-'])]:size-3.5",
          size === "middle" &&
            "rounded-lg px-3 text-sm [&_svg:not([class*='size-'])]:size-4",
          size === "large" &&
            "rounded-lg px-4 text-base [&_svg:not([class*='size-'])]:size-4",
          "rounded-l-none",
          isPrimary
            ? "bg-primary text-primary-foreground hover:bg-primary/80"
            : "bg-input-addon text-muted-foreground hover:text-foreground"
        )}
      >
        {buttonContent}
      </button>
    </span>
  )
}

/* ------------------------------------------------------------------------ */
/* Password                                                                  */
/* ------------------------------------------------------------------------ */

interface InputPasswordProps extends Omit<InputProps, "type" | "suffix"> {
  /** Show the visibility toggle; pass `{ visible, onVisibleChange }` to control it. */
  visibilityToggle?:
    | boolean
    | { visible?: boolean; onVisibleChange?: (visible: boolean) => void }
  /** Custom toggle icon per visibility state. */
  iconRender?: (visible: boolean) => React.ReactNode
}

function InputPassword({
  visibilityToggle = true,
  iconRender,
  disabled,
  ...props
}: InputPasswordProps) {
  const toggleConfig =
    typeof visibilityToggle === "object" ? visibilityToggle : undefined
  const isVisibleControlled = toggleConfig?.visible !== undefined
  const [innerVisible, setInnerVisible] = React.useState(false)
  const visible = isVisibleControlled ? !!toggleConfig?.visible : innerVisible

  const setVisible = (next: boolean) => {
    if (!isVisibleControlled) setInnerVisible(next)
    toggleConfig?.onVisibleChange?.(next)
  }

  const showToggle = visibilityToggle !== false

  return (
    <Input
      type={visible ? "text" : "password"}
      disabled={disabled}
      suffix={
        showToggle ? (
          <button
            type="button"
            data-slot="input-password-toggle"
            aria-label={visible ? "Hide password" : "Show password"}
            disabled={disabled}
            onPointerDown={(event) => event.preventDefault()}
            onClick={() => setVisible(!visible)}
            className="flex cursor-pointer items-center justify-center text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground disabled:cursor-not-allowed"
          >
            {iconRender ? iconRender(visible) : visible ? <Eye /> : <EyeOff />}
          </button>
        ) : undefined
      }
      {...props}
    />
  )
}

/* ------------------------------------------------------------------------ */
/* OTP                                                                       */
/* ------------------------------------------------------------------------ */

interface InputOTPProps {
  /** Number of cells. Defaults to 6. */
  length?: number
  /** Current value (controlled). `onChange` still only fires when complete. */
  value?: string
  /** Initial value (uncontrolled). */
  defaultValue?: string
  /** Fired with the full string once every cell is filled. */
  onChange?: (value: string) => void
  /** Fired with the cell array on every edit. */
  onInput?: (value: string[]) => void
  /** Transform typed input, e.g. `(v) => v.toUpperCase()`. */
  formatter?: (value: string) => string
  /** Hide typed characters; `true` uses `•`, a string uses that character. */
  mask?: boolean | string
  /** Node (or per-index factory) rendered between cells. */
  separator?: React.ReactNode | ((index: number) => React.ReactNode)
  size?: InputSize
  variant?: InputVariant
  status?: InputStatus
  disabled?: boolean
  autoFocus?: boolean
  /** Native input type for the cells, e.g. `"number"`-like entry via `inputMode`. */
  type?: React.HTMLInputTypeAttribute
  name?: string
  className?: string
  style?: React.CSSProperties
}

const otpCellWidth: Record<InputSize, string> = {
  small: "w-6",
  middle: "w-8",
  large: "w-10",
}

function seedCells(value: string, length: number) {
  return Array.from({ length }, (_, index) => value[index] ?? "")
}

function InputOTP({
  length = 6,
  value: valueProp,
  defaultValue,
  onChange,
  onInput,
  formatter,
  mask = false,
  separator,
  size = inputDefaults.size,
  variant = inputDefaults.variant,
  status,
  disabled,
  autoFocus,
  type = "text",
  name,
  className,
  style,
}: InputOTPProps) {
  const cellRefs = React.useRef<Array<HTMLInputElement | null>>([])
  const [cells, setCells] = React.useState<string[]>(() =>
    seedCells(valueProp ?? defaultValue ?? "", length)
  )

  // Follow the controlled value (and length changes) from outside by
  // adjusting state during render instead of in an effect.
  const [prevValueProp, setPrevValueProp] = React.useState(valueProp)
  const [prevLength, setPrevLength] = React.useState(length)
  if (valueProp !== prevValueProp) {
    setPrevValueProp(valueProp)
    if (valueProp !== undefined) setCells(seedCells(valueProp, length))
  }
  if (length !== prevLength) {
    setPrevLength(length)
    setCells((prev) => seedCells(prev.join(""), length))
  }

  const maskChar = mask === true ? "•" : mask === false ? undefined : mask

  const applyCells = (next: string[]) => {
    setCells(next)
    onInput?.(next.slice())
    if (next.every((cell) => cell !== "")) onChange?.(next.join(""))
  }

  const handleCellChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let typed = event.target.value
    // The rendered value may be the mask character; drop it so only the newly
    // typed characters remain.
    if (maskChar) typed = typed.split(maskChar).join("")
    if (formatter) typed = formatter(typed)

    const next = [...cells]
    if (typed === "") {
      next[index] = ""
      applyCells(next)
      return
    }
    // Fill forward from this cell — handles both single keystrokes and paste.
    const chars = [...typed].slice(0, length - index)
    chars.forEach((char, offset) => {
      next[index + offset] = char
    })
    applyCells(next)
    cellRefs.current[Math.min(index + chars.length, length - 1)]?.focus()
  }

  const handleCellKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && cells[index] === "" && index > 0) {
      event.preventDefault()
      const next = [...cells]
      next[index - 1] = ""
      applyCells(next)
      cellRefs.current[index - 1]?.focus()
    } else if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault()
      cellRefs.current[index - 1]?.focus()
    } else if (event.key === "ArrowRight" && index < length - 1) {
      event.preventDefault()
      cellRefs.current[index + 1]?.focus()
    }
  }

  return (
    <div
      data-slot="input-otp"
      role="group"
      className={cn("inline-flex items-center gap-2", className)}
      style={style}
    >
      {name != null && (
        <input type="hidden" name={name} value={cells.join("")} />
      )}
      {cells.map((cell, index) => (
        <React.Fragment key={index}>
          {index > 0 &&
            (typeof separator === "function" ? separator(index - 1) : separator)}
          <input
            ref={(el) => {
              cellRefs.current[index] = el
            }}
            data-slot="input-otp-cell"
            type={type}
            inputMode={type === "number" ? "numeric" : undefined}
            autoComplete="one-time-code"
            aria-label={`Character ${index + 1} of ${length}`}
            autoFocus={autoFocus && index === 0}
            disabled={disabled}
            value={cell !== "" && maskChar ? maskChar : cell}
            onChange={(event) => handleCellChange(index, event)}
            onKeyDown={(event) => handleCellKeyDown(index, event)}
            onFocus={(event) => event.target.select()}
            className={cn(
              inputVariants({ variant, size }),
              inputStatusClasses(variant, status),
              otpCellWidth[size],
              "shrink-0 px-0 text-center",
              disabled && "cursor-not-allowed opacity-50"
            )}
          />
        </React.Fragment>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------------ */

/** Ant Design-style Input with `Input.TextArea` / `.Search` / `.Password` / `.OTP`. */
const Input = Object.assign(InputBase, {
  TextArea: InputTextArea,
  Search: InputSearch,
  Password: InputPassword,
  OTP: InputOTP,
})

export {
  Input,
  InputTextArea,
  InputSearch,
  InputPassword,
  InputOTP,
  inputVariants,
  type InputProps,
  type InputTextAreaProps,
  type InputSearchProps,
  type InputPasswordProps,
  type InputOTPProps,
  type InputSize,
  type InputVariant,
  type InputStatus,
}

"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { cva } from "class-variance-authority"
import { LoaderCircle, X } from "lucide-react"

import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------------ */
/* Types                                                                     */
/* ------------------------------------------------------------------------ */

type MentionVariant = "outlined" | "filled" | "borderless" | "underlined"
type MentionStatus = "error" | "warning"
type MentionPlacement = "top" | "bottom"

interface MentionOption {
  /** Inserted text (after the prefix). Also the fallback popup label. */
  value: string
  /** Popup label. Falls back to `value` when omitted. */
  label?: React.ReactNode
  /** Non-selectable option. */
  disabled?: boolean
  /** Stable React key; defaults to `value`. */
  key?: string | number
}

interface MentionMeasureConfig {
  /** The active prefix + split, so a custom `validateSearch` can inspect them. */
  prefix: string | string[]
  split: string
}

interface MentionRef {
  focus: () => void
  blur: () => void
  /** The underlying textarea element. */
  textarea: HTMLTextAreaElement | null
}

interface MentionProps
  extends Omit<
    React.ComponentProps<"textarea">,
    | "value"
    | "defaultValue"
    | "onChange"
    | "onSelect"
    | "prefix"
    | "onResize"
    | "ref"
  > {
  /** Current value (controlled). */
  value?: string
  /** Initial value (uncontrolled). */
  defaultValue?: string
  /** Fired with the full text on every edit. */
  onChange?: (text: string) => void
  /** Options shown in the suggestion popup. Alternatively pass `Mention.Option` children. */
  options?: MentionOption[]
  /** Trigger keyword(s). A string, or an array for multiple triggers (e.g. `["@", "#"]`). Defaults to `@`. */
  prefix?: string | string[]
  /** String inserted around a selected mention. Defaults to a space. */
  split?: string
  /** Custom filter, or `false` to disable filtering (e.g. for async loading). */
  filterOption?: false | ((input: string, option: MentionOption) => boolean)
  /** Decide whether the text after a prefix should open the popup. */
  validateSearch?: (text: string, config: MentionMeasureConfig) => boolean
  /** Where the popup opens relative to the caret. Defaults to `bottom`. */
  placement?: MentionPlacement
  /** Shown in the popup when nothing matches. Defaults to `Not Found`. */
  notFoundContent?: React.ReactNode
  /** Show a spinner in the popup (for async option loading). */
  loading?: boolean
  /** Grow with content; `{ minRows, maxRows }` clamps the range. */
  autoSize?: boolean | { minRows?: number; maxRows?: number }
  /** Validation status colouring. */
  status?: MentionStatus
  /** Visual variant. Defaults to `filled`. */
  variant?: MentionVariant
  /** Show a clear (×) button when there is content; pass `{ clearIcon }` to customise. */
  allowClear?: boolean | { clearIcon: React.ReactNode }
  /** Fired when a suggestion is chosen. */
  onSelect?: (option: MentionOption, prefix: string) => void
  /** Fired (with the search text and active prefix) while typing after a prefix. */
  onSearch?: (text: string, prefix: string) => void
  /** Fired when the popup opens or closes. */
  onPopupOpenChange?: (open: boolean) => void
  /** Fired when the rendered size changes (autoSize growth, manual resize…). */
  onResize?: (dimensions: { width: number; height: number }) => void
  /** Mount the popup into a custom container instead of inline (a portal). */
  getPopupContainer?: (trigger: HTMLElement) => HTMLElement
  /** Custom render for each option row. */
  optionRender?: (option: MentionOption) => React.ReactNode
  /** Class for the popup element. */
  popupClassName?: string
  ref?: React.Ref<MentionRef>
}

/* ------------------------------------------------------------------------ */
/* Styling — matches the registry Input frame                                */
/* ------------------------------------------------------------------------ */

const mentionFrameDefaults = { variant: "filled" } as const

const mentionFrame = cva(
  "relative inline-flex w-full min-w-0 cursor-text flex-col items-stretch border border-transparent bg-clip-padding px-2.5 py-1 text-sm text-foreground transition-[color,background-color,border-color,box-shadow] outline-none",
  {
    variants: {
      variant: {
        outlined:
          "rounded-lg border-input hover:border-ring/70 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 hover:focus-within:border-ring",
        filled:
          "rounded-lg bg-input-background focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        borderless: "rounded-lg bg-transparent",
        underlined:
          "border-b-input px-0 hover:border-b-ring/70 focus-within:border-b-ring hover:focus-within:border-b-ring",
      },
    },
    defaultVariants: mentionFrameDefaults,
  }
)

function mentionStatusClasses(variant: MentionVariant, status?: MentionStatus) {
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

/* ------------------------------------------------------------------------ */
/* Measure helpers (ported from rc-mentions)                                 */
/* ------------------------------------------------------------------------ */

/** Find the last prefix occurrence in `text`; returns its index and which prefix hit. */
function getLastMeasureIndex(text: string, prefix: string | string[]) {
  const prefixList = Array.isArray(prefix) ? prefix : [prefix]
  return prefixList.reduce<{ location: number; prefix: string }>(
    (lastMatch, prefixStr) => {
      const lastIndex = text.lastIndexOf(prefixStr)
      if (lastIndex > lastMatch.location) {
        return { location: lastIndex, prefix: prefixStr }
      }
      return lastMatch
    },
    { location: -1, prefix: "" }
  )
}

/** Default: keep measuring only while the search text holds no split char. */
function defaultValidateSearch(text: string, config: MentionMeasureConfig) {
  const { split } = config
  return !split || text.indexOf(split) === -1
}

/** Default: case-insensitive substring match against value and string labels. */
function defaultFilterOption(input: string, option: MentionOption) {
  const query = input.toLowerCase()
  const label = typeof option.label === "string" ? option.label : ""
  return (
    option.value.toLowerCase().includes(query) ||
    label.toLowerCase().includes(query)
  )
}

/** Splice the picked option into `text`, normalising the surrounding split chars. */
function replaceWithMeasure(
  text: string,
  config: {
    measureLocation: number
    prefix: string
    targetText: string
    selectionStart: number
    split: string
  }
) {
  const { measureLocation, prefix, targetText, selectionStart, split } = config

  let beforeMeasureText = text.slice(0, measureLocation)
  if (
    split &&
    beforeMeasureText[beforeMeasureText.length - split.length] === split
  ) {
    beforeMeasureText = beforeMeasureText.slice(
      0,
      beforeMeasureText.length - split.length
    )
  }
  if (beforeMeasureText) {
    beforeMeasureText = `${beforeMeasureText}${split}`
  }

  let restText = text.slice(selectionStart)
  if (split && restText.slice(0, split.length) === split) {
    restText = restText.slice(split.length)
  }

  const connectedStartText = `${beforeMeasureText}${prefix}${targetText}${split}`
  return {
    text: `${connectedStartText}${restText}`,
    selectionLocation: connectedStartText.length,
  }
}

/** Extract mentioned values from a string — the static `Mention.getMentions`. */
function getMentions(
  value = "",
  config: { prefix?: string | string[]; split?: string } = {}
) {
  const { prefix = "@", split = " " } = config
  const prefixList = Array.isArray(prefix) ? prefix : [prefix]

  return value
    .split(split)
    .map((str = "") => {
      const hitPrefix = prefixList.find((prefixStr) =>
        str.startsWith(prefixStr)
      )
      return hitPrefix !== undefined
        ? { prefix: hitPrefix, value: str.slice(hitPrefix.length) }
        : null
    })
    .filter(
      (entry): entry is { prefix: string; value: string } =>
        !!entry && !!entry.value
    )
}

/* CSS properties copied onto the mirror element so the caret math matches. */
const MIRROR_PROPERTIES = [
  "direction",
  "boxSizing",
  "width",
  "height",
  "overflowX",
  "overflowY",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "fontStyle",
  "fontVariant",
  "fontWeight",
  "fontStretch",
  "fontSize",
  "lineHeight",
  "fontFamily",
  "textAlign",
  "textTransform",
  "textIndent",
  "letterSpacing",
  "wordSpacing",
  "tabSize",
  "whiteSpace",
] as const

/**
 * Coordinates (relative to the textarea's border box) of the caret at
 * `position`, using a hidden mirror element — the classic
 * textarea-caret-position technique.
 */
function getCaretCoordinates(element: HTMLTextAreaElement, position: number) {
  const doc = element.ownerDocument
  const div = doc.createElement("div")
  doc.body.appendChild(div)

  const style = div.style
  const computed = getComputedStyle(element)

  style.whiteSpace = "pre-wrap"
  style.wordWrap = "break-word"
  style.position = "absolute"
  style.visibility = "hidden"
  MIRROR_PROPERTIES.forEach((prop) => {
    // Copy the computed value across; indexing by string is fine here.
    style[prop as unknown as number] = computed[prop as unknown as number]
  })

  div.textContent = element.value.slice(0, position)
  const span = doc.createElement("span")
  // A trailing character keeps the span from collapsing at line ends.
  span.textContent = element.value.slice(position) || "."
  div.appendChild(span)

  const coordinates = {
    top: span.offsetTop + (parseInt(computed.borderTopWidth, 10) || 0),
    left: span.offsetLeft + (parseInt(computed.borderLeftWidth, 10) || 0),
    height: parseInt(computed.lineHeight, 10) || span.offsetHeight,
  }

  doc.body.removeChild(div)
  return coordinates
}

/* ------------------------------------------------------------------------ */
/* Option (data carrier for `Mention.Option` children)                       */
/* ------------------------------------------------------------------------ */

interface MentionOptionProps {
  value: string
  disabled?: boolean
  children?: React.ReactNode
}

function MentionOptionComponent(props: MentionOptionProps): null {
  void props
  return null
}
MentionOptionComponent.displayName = "Mention.Option"

/** Read `Mention.Option` children into a plain options array. */
function optionsFromChildren(children: React.ReactNode): MentionOption[] {
  const list: MentionOption[] = []
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return
    if (child.type !== MentionOptionComponent) return
    const { value, disabled, children: label } =
      child.props as MentionOptionProps
    list.push({ value, disabled, label: label ?? value, key: child.key ?? value })
  })
  return list
}

/* ------------------------------------------------------------------------ */
/* Mention                                                                   */
/* ------------------------------------------------------------------------ */

function MentionBase({
  className,
  popupClassName,
  style,
  variant = mentionFrameDefaults.variant,
  status,
  placement = "bottom",
  disabled,
  readOnly,
  autoFocus,
  autoSize,
  allowClear,
  loading = false,
  options: optionsProp,
  children,
  prefix = "@",
  split = " ",
  filterOption,
  validateSearch = defaultValidateSearch,
  notFoundContent = "Not Found",
  value: valueProp,
  defaultValue,
  rows,
  onChange,
  onSelect,
  onSearch,
  onPopupOpenChange,
  onResize,
  onKeyDown,
  onKeyUp,
  onFocus,
  onBlur,
  onClick,
  getPopupContainer,
  optionRender,
  ref,
  ...props
}: MentionProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const isControlled = valueProp !== undefined
  const [innerValue, setInnerValue] = React.useState(defaultValue ?? "")
  const mergedValue = isControlled ? (valueProp ?? "") : innerValue

  const options = React.useMemo(
    () => optionsProp ?? optionsFromChildren(children),
    [optionsProp, children]
  )

  // Measure state: while `measuring`, the popup is open for the text after a prefix.
  const [measuring, setMeasuring] = React.useState(false)
  const [measureText, setMeasureText] = React.useState("")
  const [measurePrefix, setMeasurePrefix] = React.useState("")
  const [measureLocation, setMeasureLocation] = React.useState(0)
  const [activeIndex, setActiveIndex] = React.useState(0)
  // Geometry captured when measuring starts, so the popup positions off state
  // rather than reading the textarea ref during render.
  const [anchor, setAnchor] = React.useState({
    top: 0,
    left: 0,
    height: 0,
    offsetTop: 0,
    offsetLeft: 0,
    scrollTop: 0,
    scrollLeft: 0,
    rectTop: 0,
    rectLeft: 0,
  })
  const [portalContainer, setPortalContainer] =
    React.useState<HTMLElement | null>(null)

  // Caret position to restore after inserting a mention (applied post-render).
  const pendingSelection = React.useRef<number | null>(null)

  const minRows = typeof autoSize === "object" ? autoSize.minRows : undefined
  const maxRows = typeof autoSize === "object" ? autoSize.maxRows : undefined

  React.useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
    blur: () => textareaRef.current?.blur(),
    textarea: textareaRef.current,
  }))

  // Auto-grow the textarea — same recipe as the registry Input.TextArea.
  React.useLayoutEffect(() => {
    const el = textareaRef.current
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
    el.style.overflowY = maxRows && el.scrollHeight > height ? "auto" : "hidden"
    el.style.height = `${height}px`
  }, [autoSize, minRows, maxRows, mergedValue])

  React.useEffect(() => {
    const el = textareaRef.current
    if (!el || !onResize) return
    const observer = new ResizeObserver(() => {
      onResize({ width: el.offsetWidth, height: el.offsetHeight })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [onResize])

  // Restore the caret after a mention is spliced in.
  React.useLayoutEffect(() => {
    if (pendingSelection.current === null) return
    const el = textareaRef.current
    if (el) {
      el.setSelectionRange(pendingSelection.current, pendingSelection.current)
      el.focus()
    }
    pendingSelection.current = null
  })

  const filteredOptions = React.useMemo(() => {
    if (!measuring) return []
    if (filterOption === false) return options
    const filterFn = filterOption ?? defaultFilterOption
    return options.filter((option) => filterFn(measureText, option))
  }, [measuring, options, filterOption, measureText])

  // Reset the highlight to the top match whenever the search text changes
  // (adjust-state-during-render, the React-recommended pattern).
  const [prevMeasureText, setPrevMeasureText] = React.useState(measureText)
  if (measureText !== prevMeasureText) {
    setPrevMeasureText(measureText)
    setActiveIndex(0)
  }

  // Clamp for reads so a shrinking list can never point past the end.
  const safeActiveIndex =
    filteredOptions.length === 0
      ? 0
      : Math.min(activeIndex, filteredOptions.length - 1)

  const openPopup = measuring && !disabled && !readOnly

  const prevOpenRef = React.useRef(false)
  React.useEffect(() => {
    if (prevOpenRef.current !== openPopup) {
      prevOpenRef.current = openPopup
      onPopupOpenChange?.(openPopup)
    }
  }, [openPopup, onPopupOpenChange])

  const stopMeasure = React.useCallback(() => {
    setMeasuring(false)
    setActiveIndex(0)
  }, [])

  const startMeasure = React.useCallback(
    (text: string, hitPrefix: string, location: number) => {
      const el = textareaRef.current
      if (el) {
        const coords = getCaretCoordinates(el, location)
        const rect = el.getBoundingClientRect()
        setAnchor({
          top: coords.top,
          left: coords.left,
          height: coords.height,
          offsetTop: el.offsetTop,
          offsetLeft: el.offsetLeft,
          scrollTop: el.scrollTop,
          scrollLeft: el.scrollLeft,
          rectTop: rect.top,
          rectLeft: rect.left,
        })
      }
      setMeasureText(text)
      setMeasurePrefix(hitPrefix)
      setMeasureLocation(location)
      setMeasuring(true)
    },
    []
  )

  // Resolve a custom popup container (portal target) off the render path.
  React.useEffect(() => {
    if (getPopupContainer && textareaRef.current) {
      setPortalContainer(getPopupContainer(textareaRef.current))
    }
  }, [getPopupContainer])

  // Re-evaluate whether a prefix is active at the caret.
  const syncMeasure = React.useCallback(() => {
    const el = textareaRef.current
    if (!el || disabled || readOnly) return

    const selectionStart = el.selectionStart ?? 0
    const beforeText = el.value.slice(0, selectionStart)
    const { location, prefix: hitPrefix } = getLastMeasureIndex(
      beforeText,
      prefix
    )

    if (location === -1) {
      if (measuring) stopMeasure()
      return
    }

    const nextMeasureText = beforeText.slice(location + hitPrefix.length)
    const valid = validateSearch(nextMeasureText, { prefix, split })

    if (!valid) {
      if (measuring) stopMeasure()
      return
    }

    startMeasure(nextMeasureText, hitPrefix, location)
    onSearch?.(nextMeasureText, hitPrefix)
  }, [
    disabled,
    readOnly,
    prefix,
    split,
    validateSearch,
    measuring,
    stopMeasure,
    startMeasure,
    onSearch,
  ])

  const triggerChange = (nextText: string) => {
    if (!isControlled) setInnerValue(nextText)
    onChange?.(nextText)
  }

  const selectOption = (option: MentionOption) => {
    if (option.disabled) return
    const el = textareaRef.current
    if (!el) return

    const { text, selectionLocation } = replaceWithMeasure(el.value, {
      measureLocation,
      prefix: measurePrefix,
      targetText: option.value,
      selectionStart: el.selectionStart ?? el.value.length,
      split,
    })

    // An uncontrolled textarea keeps its own DOM value — React only pushes
    // `value` for controlled inputs — so write the spliced text back here.
    if (!isControlled) el.value = text
    triggerChange(text)
    pendingSelection.current = selectionLocation
    stopMeasure()
    onSelect?.(option, measurePrefix)
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    triggerChange(event.target.value)
    // Defer so selectionStart reflects the just-applied edit.
    requestAnimationFrame(syncMeasure)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return

    if (openPopup && filteredOptions.length > 0) {
      const len = filteredOptions.length
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault()
          setActiveIndex((safeActiveIndex + 1) % len)
          return
        case "ArrowUp":
          event.preventDefault()
          setActiveIndex((safeActiveIndex - 1 + len) % len)
          return
        case "Enter":
        case "Tab": {
          const option = filteredOptions[safeActiveIndex]
          if (option && !option.disabled) {
            event.preventDefault()
            selectOption(option)
          }
          return
        }
        case "Escape":
          event.preventDefault()
          stopMeasure()
          return
      }
    } else if (openPopup && event.key === "Escape") {
      event.preventDefault()
      stopMeasure()
    }
  }

  const handleKeyUp = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyUp?.(event)
    // Navigation/selection keys are handled in keydown; ignore them here.
    const NAV = ["ArrowUp", "ArrowDown", "Enter", "Escape", "Tab"]
    if (!NAV.includes(event.key)) syncMeasure()
  }

  const handleClick = (event: React.MouseEvent<HTMLTextAreaElement>) => {
    onClick?.(event)
    syncMeasure()
  }

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    onBlur?.(event)
    // Delay so a click on an option registers before the popup unmounts.
    window.setTimeout(() => stopMeasure(), 100)
  }

  const showClear =
    !!allowClear && !disabled && !readOnly && mergedValue.length > 0
  const clearIcon =
    typeof allowClear === "object" ? allowClear.clearIcon : <X />

  const clearValue = () => {
    // Uncontrolled textarea: clear the DOM value ourselves (see selectOption).
    if (!isControlled && textareaRef.current) textareaRef.current.value = ""
    triggerChange("")
    stopMeasure()
    textareaRef.current?.focus()
  }

  // Position the popup at the caret. Inline mode anchors to the frame (the
  // textarea's offset parent); portal mode uses viewport-fixed coordinates.
  const portaling = !!getPopupContainer
  const anchorTop = portaling
    ? anchor.rectTop + anchor.top - anchor.scrollTop
    : anchor.offsetTop + anchor.top - anchor.scrollTop
  const anchorLeft = portaling
    ? anchor.rectLeft + anchor.left - anchor.scrollLeft
    : anchor.offsetLeft + anchor.left - anchor.scrollLeft

  const popupStyle: React.CSSProperties =
    placement === "top"
      ? {
          position: portaling ? "fixed" : "absolute",
          left: anchorLeft,
          top: anchorTop,
          transform: "translateY(-100%)",
          marginTop: -4,
        }
      : {
          position: portaling ? "fixed" : "absolute",
          left: anchorLeft,
          top: anchorTop + anchor.height + 4,
        }

  const popup = openPopup ? (
    <div
      data-slot="mention-popup"
      role="listbox"
      className={cn(
        "z-50 max-h-60 min-w-32 overflow-y-auto overscroll-contain rounded-lg bg-popover p-1 text-sm text-popover-foreground shadow-lg outline-none",
        popupClassName
      )}
      style={popupStyle}
      // Keep focus in the textarea while clicking an option.
      onMouseDown={(event) => event.preventDefault()}
    >
      {loading ? (
        <div className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground">
          <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
          Loading…
        </div>
      ) : filteredOptions.length === 0 ? (
        <div className="px-2 py-1.5 text-muted-foreground">
          {notFoundContent}
        </div>
      ) : (
        filteredOptions.map((option, index) => (
          <div
            key={option.key ?? option.value}
            role="option"
            aria-selected={index === safeActiveIndex}
            aria-disabled={option.disabled || undefined}
            data-slot="mention-option"
            onMouseEnter={() => setActiveIndex(index)}
            onClick={() => selectOption(option)}
            className={cn(
              "cursor-pointer rounded-md px-2 py-1.5 outline-none select-none",
              index === safeActiveIndex && "bg-accent text-accent-foreground",
              option.disabled && "pointer-events-none opacity-50"
            )}
          >
            {optionRender ? optionRender(option) : (option.label ?? option.value)}
          </div>
        ))
      )}
    </div>
  ) : null

  return (
    <span
      data-slot="mention"
      data-variant={variant}
      data-status={status}
      data-disabled={disabled || undefined}
      className={cn(
        mentionFrame({ variant }),
        mentionStatusClasses(variant, status),
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      style={style}
    >
      <textarea
        ref={textareaRef}
        data-slot="mention-field"
        disabled={disabled}
        readOnly={readOnly}
        autoFocus={autoFocus}
        rows={rows ?? minRows ?? (autoSize ? 1 : 3)}
        {...(isControlled ? { value: mergedValue } : { defaultValue })}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onClick={handleClick}
        onFocus={onFocus}
        onBlur={handleBlur}
        className={cn(
          "w-full min-w-0 flex-none bg-transparent leading-6 text-inherit outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
          autoSize ? "resize-none" : "resize-y",
          showClear && "pr-5"
        )}
        {...props}
      />

      {showClear && (
        <button
          type="button"
          data-slot="mention-clear"
          aria-label="Clear"
          onMouseDown={(event) => event.preventDefault()}
          onClick={clearValue}
          className="absolute top-1.5 right-2 flex cursor-pointer items-center justify-center rounded-full text-muted-foreground/70 outline-none transition-colors hover:text-foreground focus-visible:text-foreground [&_svg:not([class*='size-'])]:size-3.5"
        >
          {clearIcon}
        </button>
      )}

      {portaling && openPopup && portalContainer
        ? // Portal into the caller's container, positioned to the caret.
          createPortal(popup, portalContainer)
        : popup}
    </span>
  )
}

/** Ant Design-style Mentions with `Mention.Option` children and `Mention.getMentions`. */
const Mention = Object.assign(MentionBase, {
  Option: MentionOptionComponent,
  getMentions,
})

export {
  Mention,
  getMentions,
  type MentionProps,
  type MentionOption,
  type MentionRef,
  type MentionVariant,
  type MentionStatus,
  type MentionPlacement,
}

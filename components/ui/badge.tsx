"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// Ant Design Badge, rebuilt for this registry.
//
// Every colour comes from a `--badge-*` token (see app/globals.css and the
// item's `cssVars` in registry.json) so the whole palette is restyleable from
// one place — no hard-coded hex / named Tailwind colours live in the component.
// A user-supplied `color` string that isn't a preset name is applied verbatim
// via inline style (it's caller input, not a baked-in literal).

type BadgeStatus = "success" | "processing" | "default" | "error" | "warning"

type PresetColor =
  | "pink"
  | "red"
  | "yellow"
  | "orange"
  | "cyan"
  | "green"
  | "blue"
  | "purple"
  | "geekblue"
  | "magenta"
  | "volcano"
  | "gold"
  | "lime"

// Static maps so Tailwind sees every class literally (no runtime-built names).
const PRESET_BG: Record<PresetColor, string> = {
  pink: "bg-badge-pink",
  red: "bg-badge-red",
  yellow: "bg-badge-yellow",
  orange: "bg-badge-orange",
  cyan: "bg-badge-cyan",
  green: "bg-badge-green",
  blue: "bg-badge-blue",
  purple: "bg-badge-purple",
  geekblue: "bg-badge-geekblue",
  magenta: "bg-badge-magenta",
  volcano: "bg-badge-volcano",
  gold: "bg-badge-gold",
  lime: "bg-badge-lime",
}

// currentColor sources for the Ribbon's folded corner (a darker shade is
// derived from it with a brightness filter).
const PRESET_TEXT: Record<PresetColor, string> = {
  pink: "text-badge-pink",
  red: "text-badge-red",
  yellow: "text-badge-yellow",
  orange: "text-badge-orange",
  cyan: "text-badge-cyan",
  green: "text-badge-green",
  blue: "text-badge-blue",
  purple: "text-badge-purple",
  geekblue: "text-badge-geekblue",
  magenta: "text-badge-magenta",
  volcano: "text-badge-volcano",
  gold: "text-badge-gold",
  lime: "text-badge-lime",
}

const STATUS_BG: Record<BadgeStatus, string> = {
  success: "bg-badge-status-success",
  processing: "bg-badge-status-processing",
  error: "bg-badge-status-error",
  warning: "bg-badge-status-warning",
  default: "bg-badge-status-default",
}

const PRESET_COLORS = Object.keys(PRESET_BG) as PresetColor[]

function isPresetColor(color: string): color is PresetColor {
  return (PRESET_COLORS as string[]).includes(color)
}

type ColorProps = { className?: string; style?: React.CSSProperties }

// Resolve the fill for the dot/count/ribbon: preset → token utility class,
// custom string → inline style, otherwise the default red count token.
function fillFor(color: string | undefined, fallback: string): ColorProps {
  if (color == null) return { className: fallback }
  if (isPresetColor(color)) return { className: PRESET_BG[color] }
  return { style: { backgroundColor: color } }
}

// ---------------------------------------------------------------------------
// ScrollNumber — animates each digit by sliding a 0–9 strip, so the count
// scrolls when it changes (the signature Ant Design Badge motion).
// ---------------------------------------------------------------------------

function ScrollDigit({ char, small }: { char: string; small?: boolean }) {
  const height = small ? "h-4" : "h-5"
  const isDigit = char >= "0" && char <= "9"

  if (!isDigit) {
    return (
      <span className={cn("inline-flex items-center justify-center", height)}>
        {char}
      </span>
    )
  }

  const n = Number(char)
  return (
    <span className={cn("relative inline-flex overflow-hidden", height)}>
      {/* invisible sizer reserves the digit's width + height */}
      <span className="invisible" aria-hidden>
        {char}
      </span>
      <span
        className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-300 ease-out"
        style={{ transform: `translateY(${-n * 10}%)` }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className={cn("flex shrink-0 items-center justify-center", height)}
          >
            {i}
          </span>
        ))}
      </span>
    </span>
  )
}

function ScrollNumber({ value, small }: { value: string; small?: boolean }) {
  return (
    <span className="inline-flex tabular-nums">
      {value.split("").map((char, i) => (
        <ScrollDigit key={`${i}-${char}`} char={char} small={small} />
      ))}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------

interface BadgeProps extends Omit<React.ComponentProps<"span">, "color"> {
  /** Number (or custom node) shown in the badge. */
  count?: React.ReactNode
  /** Show the badge when the count is zero. */
  showZero?: boolean
  /** Max number to show; larger counts render as `${overflowCount}+`. */
  overflowCount?: number
  /** Show a small dot instead of a count. */
  dot?: boolean
  /** Render as a standalone status dot. */
  status?: BadgeStatus
  /** Preset colour name or any CSS colour string. */
  color?: string
  /** Text placed next to a `status`/`color` dot. */
  text?: React.ReactNode
  /** Native title shown on hover of the badge. */
  title?: string
  /** Offset of the corner badge, `[x, y]` in px (x → right, y → down). */
  offset?: [number, number]
  /** `default` (20px) or `small` (16px) count pill. */
  size?: "default" | "small"
}

// Pulsing halo for the "processing" status dot.
function ProcessingRipple({ color }: { color: ColorProps }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
        color.className
      )}
      style={color.style}
    />
  )
}

function Badge({
  count,
  showZero = false,
  overflowCount = 99,
  dot = false,
  status,
  color,
  text,
  title,
  offset,
  size = "default",
  className,
  style,
  children,
  ...rest
}: BadgeProps) {
  // Status mode: a standalone coloured dot (+ optional text). Triggered by
  // `status`, or by `color` used without a count/dot.
  const isStatusMode =
    status != null || (color != null && count == null && !dot)

  if (isStatusMode) {
    const fill = status != null ? { className: STATUS_BG[status] } : fillFor(color, STATUS_BG.default)
    return (
      <span
        data-slot="badge"
        className={cn("inline-flex items-center gap-2", className)}
        style={style}
        {...rest}
      >
        <span className="relative inline-flex size-1.5">
          {status === "processing" && <ProcessingRipple color={fill} />}
          <span
            className={cn("relative inline-flex size-1.5 rounded-full", fill.className)}
            style={fill.style}
          />
        </span>
        {text != null && (
          <span className="text-sm text-foreground">{text}</span>
        )}
      </span>
    )
  }

  // Count / dot mode.
  const isNumber = typeof count === "number"
  const isZero = isNumber && count === 0
  const isCustomNode = !dot && count != null && !isNumber
  const display = isNumber
    ? count > overflowCount
      ? `${overflowCount}+`
      : String(count)
    : ""
  const hidden = !dot && (count == null || (isZero && !showZero))

  const small = size === "small"
  const fill = fillFor(color, "bg-badge-count-bg")

  const cornerTransform = offset
    ? `translate(calc(50% + ${offset[0]}px), calc(-50% + ${offset[1]}px))`
    : "translate(50%, -50%)"

  let sup: React.ReactNode
  if (dot) {
    sup = (
      <span
        data-slot="badge-dot"
        title={title}
        className={cn(
          "block size-1.5 rounded-full shadow-sm",
          fill.className
        )}
        style={fill.style}
      />
    )
  } else if (isCustomNode) {
    // A custom node (e.g. an icon) is shown as-is, without the count pill.
    sup = (
      <span data-slot="badge-count" title={title} className="inline-flex leading-none">
        {count}
      </span>
    )
  } else {
    sup = (
      <span
        data-slot="badge-count"
        title={title}
        className={cn(
          "inline-flex items-center justify-center rounded-full px-1.5 font-semibold text-badge-count-foreground shadow-sm",
          small ? "h-4 min-w-4 text-[11px]" : "h-5 min-w-5 text-xs",
          fill.className
        )}
        style={fill.style}
      >
        <ScrollNumber value={display} small={small} />
      </span>
    )
  }

  // Standalone (no wrapped content): render the badge inline.
  if (children == null) {
    if (hidden) return null
    return (
      <span
        data-slot="badge"
        className={cn("inline-flex", className)}
        style={style}
        {...rest}
      >
        {sup}
      </span>
    )
  }

  // Wrapping: pin the badge to the top-right corner of the children.
  return (
    <span
      data-slot="badge"
      className={cn("relative inline-block", className)}
      style={style}
      {...rest}
    >
      {children}
      {!hidden && (
        <span
          data-slot="badge-corner"
          className="absolute top-0 right-0 z-10 origin-center animate-in fade-in zoom-in duration-200"
          style={{ transform: cornerTransform }}
        >
          {sup}
        </span>
      )}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Badge.Ribbon — a folded ribbon pinned to a container's top corner.
// ---------------------------------------------------------------------------

interface BadgeRibbonProps
  extends Omit<React.ComponentProps<"div">, "color"> {
  /** Content inside the ribbon. */
  text?: React.ReactNode
  /** Preset colour name or any CSS colour string. */
  color?: string
  /** Which corner the ribbon hangs from. */
  placement?: "start" | "end"
}

function BadgeRibbon({
  text,
  color,
  placement = "end",
  className,
  children,
  ...rest
}: BadgeRibbonProps) {
  const isPreset = color != null && isPresetColor(color)
  const bgClass = isPreset ? PRESET_BG[color] : color == null ? "bg-badge-count-bg" : undefined
  const cornerColorClass = isPreset
    ? PRESET_TEXT[color]
    : color == null
      ? "text-badge-count-bg"
      : undefined
  const customBg = color != null && !isPreset ? { backgroundColor: color } : undefined
  const customCornerColor = color != null && !isPreset ? { color } : undefined
  const isEnd = placement === "end"

  return (
    <div
      data-slot="badge-ribbon-wrapper"
      className={cn("relative", className)}
      {...rest}
    >
      {children}
      <div
        data-slot="badge-ribbon"
        className={cn(
          "absolute top-2 z-10 h-[22px] whitespace-nowrap px-2 text-xs leading-[22px] text-badge-count-foreground shadow-sm",
          isEnd
            ? "end-0 translate-x-2 rounded-s-md"
            : "start-0 -translate-x-2 rounded-e-md",
          bgClass
        )}
        style={customBg}
      >
        <span>{text}</span>
        {/* Folded corner: a darker shade of the ribbon colour. */}
        <div
          aria-hidden
          className={cn(
            "absolute top-full size-2 origin-top scale-y-75 border-4 border-b-transparent [filter:brightness(0.75)]",
            isEnd
              ? "end-0 border-t-current border-e-current border-s-transparent"
              : "start-0 border-t-current border-s-current border-e-transparent",
            cornerColorClass
          )}
          style={customCornerColor}
        />
      </div>
    </div>
  )
}

// Compound API so both `Badge.Ribbon` and the named `BadgeRibbon` work.
const BadgeNamespace = Object.assign(Badge, { Ribbon: BadgeRibbon })

export {
  BadgeNamespace as Badge,
  BadgeRibbon,
  type BadgeProps,
  type BadgeRibbonProps,
  type BadgeStatus,
  type PresetColor,
}

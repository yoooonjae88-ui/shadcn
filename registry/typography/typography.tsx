"use client"

import * as React from "react"
import { Check, Copy, Pencil } from "lucide-react"

import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*                               Shared types                                 */
/* -------------------------------------------------------------------------- */

type TextType = "default" | "secondary" | "success" | "warning" | "danger"

interface CopyableConfig {
  /** Text to copy. Defaults to the rendered children when omitted. */
  text?: string
  /** Tooltip/aria labels for the copy and copied states. */
  labels?: [copy: string, copied: string]
  /** Fired after a successful copy. */
  onCopy?: (text: string) => void
  /** How long the "copied" state stays visible, in ms. Defaults to 2000. */
  timeout?: number
}

interface EditableConfig {
  /** Controlled editing state. */
  editing?: boolean
  /** Fired when editing starts/stops. */
  onEditingChange?: (editing: boolean) => void
  /** Fired with the new value when the edit is committed. */
  onChange?: (value: string) => void
  /** Accessible label for the edit trigger. Defaults to "Edit". */
  label?: string
  /** Max length of the editable input. */
  maxLength?: number
}

interface EllipsisConfig {
  /** Number of lines to clamp to before truncating. Defaults to 1. */
  rows?: number
  /** Allow expanding the truncated text inline. Defaults to false. */
  expandable?: boolean
  /** Controlled expanded state. */
  expanded?: boolean
  /** Fired when the expanded state changes. */
  onExpandedChange?: (expanded: boolean) => void
  /** Labels for the expand/collapse toggle. Defaults to ["More", "Less"]. */
  symbol?: [more: string, less: string]
}

const typeClasses: Record<TextType, string> = {
  default: "",
  secondary: "text-muted-foreground",
  success: "text-typography-success",
  warning: "text-typography-warning",
  danger: "text-destructive",
}

/** Normalise a `boolean | Config` prop: `true` → `{}`, falsy → undefined. */
function toConfig<T extends object>(
  value: boolean | T | undefined
): T | undefined {
  if (!value) return undefined
  return typeof value === "object" ? value : ({} as T)
}

/* -------------------------------------------------------------------------- */
/*                            Internal copy button                            */
/* -------------------------------------------------------------------------- */

function CopyButton({
  getText,
  config,
}: {
  getText: () => string
  config: CopyableConfig
}) {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )

  React.useEffect(() => () => clearTimeout(timer.current), [])

  const [copyLabel, copiedLabel] = config.labels ?? ["Copy", "Copied"]

  const handleCopy = async () => {
    const text = config.text ?? getText()
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Fallback for insecure contexts / older browsers.
      const area = document.createElement("textarea")
      area.value = text
      area.style.position = "fixed"
      area.style.opacity = "0"
      document.body.appendChild(area)
      area.select()
      document.execCommand("copy")
      document.body.removeChild(area)
    }
    config.onCopy?.(text)
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), config.timeout ?? 2000)
  }

  return (
    <button
      type="button"
      data-slot="typography-copy"
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : copyLabel}
      title={copied ? copiedLabel : copyLabel}
      className={cn(
        "ml-1 inline-flex size-4 shrink-0 translate-y-px items-center justify-center rounded-sm align-baseline outline-none transition-colors",
        copied
          ? "text-typography-success"
          : "text-muted-foreground hover:text-foreground",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50"
      )}
    >
      {copied ? (
        <Check className="size-3.5" aria-hidden="true" />
      ) : (
        <Copy className="size-3.5" aria-hidden="true" />
      )}
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/*                           Editable text behaviour                          */
/* -------------------------------------------------------------------------- */

function useEditable(config: EditableConfig | undefined) {
  const isControlled = config?.editing !== undefined
  const [editingState, setEditingState] = React.useState(false)
  const editing = isControlled ? config!.editing! : editingState

  const setEditing = (next: boolean) => {
    if (!isControlled) setEditingState(next)
    config?.onEditingChange?.(next)
  }

  return { enabled: !!config, editing, setEditing, config }
}

function EditableInput({
  initialValue,
  config,
  onClose,
}: {
  initialValue: string
  config: EditableConfig
  onClose: () => void
}) {
  const [draft, setDraft] = React.useState(initialValue)
  const ref = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    el.focus()
    // Place caret at the end.
    el.setSelectionRange(el.value.length, el.value.length)
  }, [])

  const commit = () => {
    config.onChange?.(draft)
    onClose()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      commit()
    } else if (event.key === "Escape") {
      event.preventDefault()
      onClose()
    }
  }

  return (
    <textarea
      ref={ref}
      data-slot="typography-edit-input"
      rows={1}
      value={draft}
      maxLength={config.maxLength}
      onChange={(event) => setDraft(event.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={commit}
      className={cn(
        "w-full resize-none rounded-md border border-input bg-transparent px-2 py-1 text-inherit leading-inherit shadow-xs outline-none",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      )}
    />
  )
}

function EditButton({
  config,
  onStart,
}: {
  config: EditableConfig
  onStart: () => void
}) {
  return (
    <button
      type="button"
      data-slot="typography-edit"
      onClick={onStart}
      aria-label={config.label ?? "Edit"}
      title={config.label ?? "Edit"}
      className={cn(
        "ml-1 inline-flex size-4 shrink-0 translate-y-px items-center justify-center rounded-sm align-baseline text-muted-foreground outline-none transition-colors",
        "hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
      )}
    >
      <Pencil className="size-3.5" aria-hidden="true" />
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/*                          Ellipsis (clamp + expand)                         */
/* -------------------------------------------------------------------------- */

function useEllipsis(config: EllipsisConfig | undefined) {
  const isControlled = config?.expanded !== undefined
  const [expandedState, setExpandedState] = React.useState(false)
  const expanded = isControlled ? config!.expanded! : expandedState

  const setExpanded = (next: boolean) => {
    if (!isControlled) setExpandedState(next)
    config?.onExpandedChange?.(next)
  }

  return { expanded, setExpanded }
}

/* -------------------------------------------------------------------------- */
/*                            Base text renderer                              */
/* -------------------------------------------------------------------------- */

interface BaseTextOwnProps {
  type?: TextType
  strong?: boolean
  italic?: boolean
  underline?: boolean
  /** Strike-through. */
  del?: boolean
  /** Highlighted (mark). */
  mark?: boolean
  /** Inline code styling. */
  code?: boolean
  /** Disabled appearance + non-interactive. */
  disabled?: boolean
  copyable?: boolean | CopyableConfig
  editable?: boolean | EditableConfig
  ellipsis?: boolean | EllipsisConfig
}

function decorate(
  children: React.ReactNode,
  { mark, code }: { mark?: boolean; code?: boolean }
) {
  let node = children
  if (code) node = <code className="rounded bg-muted px-1 py-0.5 text-[0.85em] font-mono">{node}</code>
  if (mark) node = <mark className="rounded bg-typography-mark px-0.5 text-foreground">{node}</mark>
  return node
}

function textDecorationClasses({
  type,
  strong,
  italic,
  underline,
  del,
  disabled,
}: BaseTextOwnProps) {
  return cn(
    type && typeClasses[type],
    strong && "font-semibold",
    italic && "italic",
    underline && "underline underline-offset-2",
    del && "line-through",
    disabled && "cursor-not-allowed opacity-50 select-none"
  )
}

function resolveTextString(children: React.ReactNode): string {
  if (children == null || typeof children === "boolean") return ""
  if (typeof children === "string" || typeof children === "number")
    return String(children)
  if (Array.isArray(children)) return children.map(resolveTextString).join("")
  if (React.isValidElement(children))
    return resolveTextString(
      (children.props as { children?: React.ReactNode }).children
    )
  return ""
}

/* -------------------------------------------------------------------------- */
/*                                   Text                                      */
/* -------------------------------------------------------------------------- */

interface TextProps
  extends Omit<React.ComponentPropsWithoutRef<"span">, "children">,
    BaseTextOwnProps {
  children?: React.ReactNode
  /** Render as a block paragraph (`<p>` with bottom margin) instead of inline. */
  as?: "span" | "p" | "div"
}

function Text({
  children,
  as = "span",
  className,
  type,
  strong,
  italic,
  underline,
  del,
  mark,
  code,
  disabled,
  copyable,
  editable,
  ellipsis,
  ...props
}: TextProps) {
  const decoProps = { type, strong, italic, underline, del, disabled }

  const editConfig = toConfig<EditableConfig>(editable)
  const copyConfig = toConfig<CopyableConfig>(copyable)
  const ellipsisConfig = toConfig<EllipsisConfig>(ellipsis)

  const getText = React.useCallback(
    () => resolveTextString(children),
    [children]
  )

  const editState = useEditable(editConfig)
  const { expanded, setExpanded } = useEllipsis(ellipsisConfig)

  const Comp: React.ElementType = as

  // Editing mode replaces the whole node with an input.
  if (editState.enabled && editState.editing && editConfig) {
    return (
      <Comp
        data-slot="typography-text"
        className={cn("block", className)}
        {...props}
      >
        <EditableInput
          initialValue={getText()}
          config={editConfig}
          onClose={() => editState.setEditing(false)}
        />
      </Comp>
    )
  }

  const rows = ellipsisConfig?.rows ?? 1
  const clamp = ellipsisConfig && !expanded
  const [moreLabel, lessLabel] = ellipsisConfig?.symbol ?? ["More", "Less"]

  // The clamp lives on an inner wrapper so its `overflow: hidden` only hides the
  // text — the expand/copy/edit controls are siblings outside it and stay
  // visible. (Rendering the toggle *inside* the clamped box would clip it away
  // along with the truncated text.)
  const content = ellipsisConfig ? (
    <span
      data-slot="typography-ellipsis"
      className={cn(clamp && rows === 1 && "block truncate")}
      style={
        clamp && rows > 1
          ? {
              display: "-webkit-box",
              WebkitLineClamp: rows,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }
          : undefined
      }
    >
      {decorate(children, { mark, code })}
    </span>
  ) : (
    decorate(children, { mark, code })
  )

  return (
    <Comp
      data-slot="typography-text"
      data-type={type}
      className={cn(
        "text-foreground",
        as === "p" && "mb-4 leading-7",
        ellipsisConfig && "block",
        textDecorationClasses(decoProps),
        className
      )}
      {...props}
    >
      {content}
      {ellipsisConfig?.expandable ? (
        <button
          type="button"
          data-slot="typography-expand"
          onClick={() => setExpanded(!expanded)}
          className="align-baseline text-sm font-medium text-primary outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          {expanded ? lessLabel : moreLabel}
        </button>
      ) : null}
      {editState.enabled && editConfig ? (
        <EditButton
          config={editConfig}
          onStart={() => editState.setEditing(true)}
        />
      ) : null}
      {copyConfig ? <CopyButton getText={getText} config={copyConfig} /> : null}
    </Comp>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   Title                                     */
/* -------------------------------------------------------------------------- */

type TitleLevel = 1 | 2 | 3 | 4 | 5

const titleClasses: Record<TitleLevel, string> = {
  1: "text-4xl font-bold tracking-tight",
  2: "text-3xl font-semibold tracking-tight",
  3: "text-2xl font-semibold tracking-tight",
  4: "text-xl font-semibold",
  5: "text-base font-semibold",
}

interface TitleProps
  extends Omit<React.ComponentProps<"h1">, "children">,
    Pick<BaseTextOwnProps, "type" | "italic" | "underline" | "del" | "disabled"> {
  children?: React.ReactNode
  /** Heading level 1–5. Defaults to 1. */
  level?: TitleLevel
  copyable?: boolean | CopyableConfig
  editable?: boolean | EditableConfig
}

function Title({
  children,
  level = 1,
  className,
  type,
  italic,
  underline,
  del,
  disabled,
  copyable,
  editable,
  ...props
}: TitleProps) {
  const Comp = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5"

  const editConfig = toConfig<EditableConfig>(editable)
  const copyConfig = toConfig<CopyableConfig>(copyable)

  const getText = React.useCallback(
    () => resolveTextString(children),
    [children]
  )
  const editState = useEditable(editConfig)

  if (editState.enabled && editState.editing && editConfig) {
    return (
      <Comp
        data-slot="typography-title"
        className={cn(titleClasses[level], "mb-2", className)}
        {...props}
      >
        <EditableInput
          initialValue={getText()}
          config={editConfig}
          onClose={() => editState.setEditing(false)}
        />
      </Comp>
    )
  }

  return (
    <Comp
      data-slot="typography-title"
      data-level={level}
      className={cn(
        "font-heading scroll-m-20 text-foreground",
        titleClasses[level],
        "mb-2",
        textDecorationClasses({ type, italic, underline, del, disabled }),
        className
      )}
      {...props}
    >
      {children}
      {editState.enabled && editConfig ? (
        <EditButton
          config={editConfig}
          onStart={() => editState.setEditing(true)}
        />
      ) : null}
      {copyConfig ? <CopyButton getText={getText} config={copyConfig} /> : null}
    </Comp>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   Link                                      */
/* -------------------------------------------------------------------------- */

interface LinkProps
  extends Omit<React.ComponentProps<"a">, "type">,
    Pick<BaseTextOwnProps, "type" | "strong" | "italic" | "underline" | "disabled"> {
  copyable?: boolean | CopyableConfig
}

function Link({
  children,
  className,
  type,
  strong,
  italic,
  underline,
  disabled,
  copyable,
  href,
  onClick,
  ...props
}: LinkProps) {
  const copyConfig = toConfig<CopyableConfig>(copyable)

  const getText = React.useCallback(
    () => resolveTextString(children),
    [children]
  )

  return (
    <span data-slot="typography-link-wrapper" className="inline">
      <a
        data-slot="typography-link"
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        onClick={disabled ? (e) => e.preventDefault() : onClick}
        className={cn(
          "font-medium text-primary underline-offset-4 outline-none transition-colors",
          "hover:text-primary/80 hover:underline",
          "focus-visible:ring-[3px] focus-visible:ring-ring/50 rounded-sm",
          type && typeClasses[type],
          strong && "font-semibold",
          italic && "italic",
          underline && "underline",
          disabled && "pointer-events-none cursor-not-allowed opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </a>
      {copyConfig ? <CopyButton getText={getText} config={copyConfig} /> : null}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/*                                Paragraph                                    */
/* -------------------------------------------------------------------------- */

type ParagraphProps = Omit<TextProps, "as">

function Paragraph(props: ParagraphProps) {
  return <Text as="p" {...props} />
}

/* -------------------------------------------------------------------------- */
/*                           Typography container                             */
/* -------------------------------------------------------------------------- */

function Typography({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="typography"
      className={cn("text-foreground", className)}
      {...props}
    />
  )
}

export {
  Typography,
  Text,
  Title,
  Link,
  Paragraph,
  type TextProps,
  type TitleProps,
  type LinkProps,
  type ParagraphProps,
  type CopyableConfig,
  type EditableConfig,
  type EllipsisConfig,
  type TextType,
  type TitleLevel,
}

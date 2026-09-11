"use client"

import * as React from "react"
import {
  Archive,
  Eraser,
  Info,
  MoreVertical,
  Pin,
  SendHorizontal,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  ConversationCardIcon,
  type ConversationType,
} from "@/components/ui/conversation-card"
import {
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverSeparator,
  PopoverTrigger,
} from "@/components/ui/popover"
import { SearchInput, type SearchInputProps } from "@/components/ui/search-input"

/* -------------------------------------------------------------------------- */
/*                                 Container                                   */
/* -------------------------------------------------------------------------- */

// Vertical flex container with three regions: header, scrollable body and
// the composer. Give it a bounded height (e.g. `h-[32rem]` or `h-full`) so
// the body scrolls instead of the page.
function ChatWindow({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-window"
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-xl bg-transparent",
        className
      )}
      {...props}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Header                                     */
/* -------------------------------------------------------------------------- */

interface ChatWindowHeaderProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  /** Conversation name shown next to the avatar. */
  title: React.ReactNode
  /** Selects the default avatar glyph — a person vs. a group. */
  type?: ConversationType
  /** Shows a pin icon beside the title for pinned conversations. */
  pinned?: boolean
  /** Custom avatar/icon, replacing the default person/group glyph. */
  icon?: React.ReactNode
  /**
   * Actions rendered on the right of the header. Defaults to a search field
   * plus a "more options" menu. Pass `null` to hide them, or your own nodes
   * to replace them entirely.
   */
  actions?: React.ReactNode
}

function ChatWindowHeader({
  title,
  type = "direct",
  pinned = false,
  icon,
  actions,
  className,
  children,
  ...props
}: ChatWindowHeaderProps) {
  return (
    <div
      data-slot="chat-window-header"
      className={cn(
        "flex shrink-0 items-center gap-3 bg-transparent px-3 py-2.5",
        className
      )}
      {...props}
    >
      {icon ?? <ConversationCardIcon type={type} />}

      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        <span
          data-slot="chat-window-title"
          className="min-w-0 truncate text-sm font-semibold"
        >
          {title}
        </span>
        {pinned && (
          <Pin
            data-slot="chat-window-pin"
            className="size-3.5 shrink-0 rotate-45 fill-current text-muted-foreground"
            aria-label="Pinned"
          />
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {actions}
        {children}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                               Options menu                                 */
/* -------------------------------------------------------------------------- */

interface ChatWindowMenuProps {
  /** "Info Page" action. */
  onInfo?: () => void
  /** "Archive Chat" action. */
  onArchive?: () => void
  /** "Clear Chat" action (styled as destructive). */
  onClear?: () => void
  /** Accessible label for the trigger button. Defaults to "More options". */
  label?: string
}

// The "more options" popover triggered by the vertical-dots button.
function ChatWindowMenu({
  onInfo,
  onArchive,
  onClear,
  label = "More options",
}: ChatWindowMenuProps) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            className="text-muted-foreground hover:bg-transparent hover:text-foreground dark:hover:bg-transparent aria-expanded:bg-transparent aria-expanded:text-foreground"
          />
        }
      >
        <MoreVertical />
      </PopoverTrigger>
      <PopoverContent align="end">
        <PopoverItem onClick={onInfo}>
          <Info />
          Info Page
        </PopoverItem>
        <PopoverItem onClick={onArchive}>
          <Archive />
          Archive Chat
        </PopoverItem>
        <PopoverSeparator />
        <PopoverItem
          onClick={onClear}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:bg-destructive/10 focus-visible:text-destructive"
        >
          <Eraser />
          Clear Chat
        </PopoverItem>
      </PopoverContent>
    </Popover>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   Body                                      */
/* -------------------------------------------------------------------------- */

// Scrollable message area. Render `ChatBubble`s as children.
function ChatWindowBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-window-body"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto p-4",
        className
      )}
      {...props}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*                                 Composer                                    */
/* -------------------------------------------------------------------------- */

interface ChatWindowInputProps
  extends Omit<
    React.ComponentProps<"textarea">,
    "value" | "defaultValue" | "onChange" | "rows"
  > {
  /** Current value (controlled). */
  value?: string
  /** Initial value (uncontrolled). */
  defaultValue?: string
  /** Fired on every keystroke with the new value. */
  onValueChange?: (value: string) => void
  /** Fired when the message is submitted (Enter, or the send button). */
  onSend?: (value: string) => void
  /** Max number of visible text rows before the field scrolls. Defaults to 3. */
  maxRows?: number
  /** Accessible label for the send button. Defaults to "Send message". */
  sendLabel?: string
}

// A multi-line composer that auto-grows from one line up to `maxRows` (3 by
// default), then scrolls. Enter sends; Shift+Enter inserts a newline.
function ChatWindowInput({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSend,
  maxRows = 3,
  sendLabel = "Send message",
  placeholder = "Type a message…",
  className,
  disabled,
  onKeyDown,
  ...props
}: ChatWindowInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Support both controlled and uncontrolled `value`.
  const isControlled = valueProp !== undefined
  const [valueState, setValueState] = React.useState(defaultValue)
  const value = isControlled ? valueProp : valueState

  const setValue = (next: string) => {
    if (!isControlled) setValueState(next)
    onValueChange?.(next)
  }

  // Grow the textarea to fit its content, capped at `maxRows`. Past the cap the
  // height is frozen and the field scrolls. Runs on every value change.
  const resize = React.useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    const styles = window.getComputedStyle(el)
    const lineHeight = parseFloat(styles.lineHeight) || 20
    const paddingY =
      parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom)
    // The textarea is borderless (the container draws the border), so its
    // border-box height is simply content rows + vertical padding.
    const maxHeight = lineHeight * maxRows + paddingY
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden"
  }, [maxRows])

  React.useLayoutEffect(() => {
    resize()
  }, [value, resize])

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend?.(trimmed)
    if (!isControlled) setValueState("")
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    // Enter sends; Shift+Enter (or other modifiers) inserts a newline.
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <div
      data-slot="chat-window-input"
      className={cn(
        "flex shrink-0 items-end gap-2 bg-transparent p-2.5",
        "focus-within:[&_[data-slot=chat-window-field-wrap]]:border-ring focus-within:[&_[data-slot=chat-window-field-wrap]]:ring-[3px] focus-within:[&_[data-slot=chat-window-field-wrap]]:ring-ring/50",
        className
      )}
    >
      <div
        data-slot="chat-window-field-wrap"
        className="flex min-w-0 flex-1 rounded-2xl bg-input-background transition-[border-color,box-shadow]"
      >
        <textarea
          ref={textareaRef}
          data-slot="chat-window-field"
          rows={1}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-0 w-full resize-none bg-transparent px-3 py-2 text-sm leading-5 text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-50"
          {...props}
        />
      </div>

      <Button
        type="button"
        size="icon"
        aria-label={sendLabel}
        disabled={disabled || value.trim().length === 0}
        onClick={submit}
        className="size-9 rounded-full"
      >
        <SendHorizontal />
      </Button>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                            High-level convenience                          */
/* -------------------------------------------------------------------------- */

interface ChatWindowRootProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** Conversation name shown in the header. */
  title: React.ReactNode
  /** Selects the default avatar glyph — a person vs. a group. */
  type?: ConversationType
  /** Shows a pin icon beside the title for pinned conversations. */
  pinned?: boolean
  /** Custom avatar/icon for the header, replacing the default glyph. */
  icon?: React.ReactNode
  /** Props forwarded to the header's search field. */
  searchProps?: SearchInputProps
  /** "Info Page" menu action. */
  onInfo?: () => void
  /** "Archive Chat" menu action. */
  onArchive?: () => void
  /** "Clear Chat" menu action. */
  onClear?: () => void
  /** Props forwarded to the composer (e.g. `onSend`, `value`, `maxRows`). */
  inputProps?: ChatWindowInputProps
  /** The message bubbles rendered in the scrollable body. */
  children?: React.ReactNode
}

// Pre-assembled chat window: header (avatar + title + pin + search + menu),
// scrollable body for the message bubbles, and the auto-growing composer.
// Drop down to the individual parts above for custom layouts.
function ChatWindowRoot({
  title,
  type = "direct",
  pinned = false,
  icon,
  searchProps,
  onInfo,
  onArchive,
  onClear,
  inputProps,
  children,
  ...props
}: ChatWindowRootProps) {
  return (
    <ChatWindow {...props}>
      <ChatWindowHeader
        title={title}
        type={type}
        pinned={pinned}
        icon={icon}
        actions={
          <>
            <SearchInput {...searchProps} />
            <ChatWindowMenu
              onInfo={onInfo}
              onArchive={onArchive}
              onClear={onClear}
            />
          </>
        }
      />
      <ChatWindowBody>{children}</ChatWindowBody>
      <ChatWindowInput {...inputProps} />
    </ChatWindow>
  )
}

export {
  ChatWindow,
  ChatWindowHeader,
  ChatWindowMenu,
  ChatWindowBody,
  ChatWindowInput,
  ChatWindowRoot,
  type ChatWindowHeaderProps,
  type ChatWindowMenuProps,
  type ChatWindowInputProps,
  type ChatWindowRootProps,
}

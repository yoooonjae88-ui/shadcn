"use client"

import * as React from "react"
import {
  Check,
  CheckCheck,
  ChevronDown,
  Copy,
  Forward,
  ListChecks,
  Reply,
  Trash2,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogIcon,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverSeparator,
  PopoverTrigger,
} from "@/components/ui/popover"

type ChatBubbleVariant = "incoming" | "outgoing"
type ChatBubbleStatus = "sent" | "delivered" | "read"
/** Which copy of the message a delete removes. */
type ChatBubbleDeleteScope = "me" | "everyone"

type ChatBubbleContextValue = {
  variant: ChatBubbleVariant
  selectable: boolean
  selected: boolean
}

const ChatBubbleContext = React.createContext<ChatBubbleContextValue>({
  variant: "incoming",
  selectable: false,
  selected: false,
})

function useChatBubble() {
  return React.useContext(ChatBubbleContext)
}

interface ChatBubbleProps extends React.ComponentProps<"div"> {
  variant?: ChatBubbleVariant
  /**
   * Puts the row in selection mode: a tick appears on the left and the whole
   * row toggles `selected` on click (or Enter/Space). Drive it from the
   * "Select messages" action of `ChatBubbleMenu`.
   */
  selectable?: boolean
  /** Whether this message is part of the current selection. */
  selected?: boolean
  /** Fired when the row is toggled while `selectable`. */
  onSelectedChange?: (selected: boolean) => void
}

function ChatBubble({
  variant = "incoming",
  selectable = false,
  selected = false,
  onSelectedChange,
  className,
  children,
  onClick,
  onKeyDown,
  ...props
}: ChatBubbleProps) {
  const context = React.useMemo(
    () => ({ variant, selectable, selected }),
    [variant, selectable, selected]
  )

  return (
    <ChatBubbleContext.Provider value={context}>
      <div
        data-slot="chat-bubble"
        data-variant={variant}
        data-selectable={selectable ? "" : undefined}
        data-selected={selectable && selected ? "" : undefined}
        role={selectable ? "checkbox" : undefined}
        aria-checked={selectable ? selected : undefined}
        tabIndex={selectable ? 0 : undefined}
        onClick={(event) => {
          onClick?.(event)
          if (!selectable || event.defaultPrevented) return
          onSelectedChange?.(!selected)
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (!selectable || event.defaultPrevented) return
          if (event.key !== " " && event.key !== "Enter") return
          event.preventDefault()
          onSelectedChange?.(!selected)
        }}
        className={cn(
          "flex w-full",
          variant === "outgoing" ? "justify-end" : "justify-start",
          selectable
            ? "cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1 outline-none transition-colors hover:bg-primary/5 focus-visible:bg-primary/5"
            : variant === "outgoing"
              ? "pl-12"
              : "pr-12",
          selectable && selected && "bg-primary/10 hover:bg-primary/10",
          className
        )}
        {...props}
      >
        {selectable && (
          <ChatBubbleSelectIndicator
            className={variant === "outgoing" ? "mr-auto" : undefined}
          />
        )}
        {children}
      </div>
    </ChatBubbleContext.Provider>
  )
}

// The circular tick shown at the start of a row in selection mode. Rendered
// automatically by `ChatBubble` when `selectable` is set; exported for custom
// row layouts.
function ChatBubbleSelectIndicator({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const { selected } = useChatBubble()
  return (
    <span
      aria-hidden="true"
      data-slot="chat-bubble-select-indicator"
      data-selected={selected ? "" : undefined}
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-full transition-colors",
        selected
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground/40",
        className
      )}
      {...props}
    >
      <Check className="size-3.5" strokeWidth={3} />
    </span>
  )
}

// The curved corner tail WhatsApp attaches to the first bubble of a group.
// Fill follows currentColor so it always matches the bubble background.
function ChatBubbleTail({ flip }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 8 13"
      width="8"
      height="13"
      aria-hidden="true"
      data-slot="chat-bubble-tail"
      className={cn(
        "absolute top-0",
        flip ? "right-[-8px] -scale-x-100" : "left-[-8px]"
      )}
    >
      <path
        fill="currentColor"
        d="M1.533 2.568 8 11.193V0H2.812C1.042 0 .474 1.156 1.533 2.568z"
      />
    </svg>
  )
}

interface ChatBubbleMessageProps extends React.ComponentProps<"div"> {
  tail?: boolean
  /**
   * Controls rendered in the bubble's top-right corner — typically a
   * `<ChatBubbleMenu />`. Floated, so the message text wraps around it the
   * same way it wraps around the timestamp.
   */
  actions?: React.ReactNode
}

function ChatBubbleMessage({
  tail = true,
  actions,
  className,
  children,
  ...props
}: ChatBubbleMessageProps) {
  const { variant } = useChatBubble()
  return (
    <div
      data-slot="chat-bubble-message"
      data-variant={variant}
      className={cn(
        "group/bubble relative max-w-full rounded-[7.5px] px-[9px] py-[6px] text-sm leading-[19px] break-words shadow-sm",
        tail &&
          (variant === "incoming" ? "rounded-tl-none" : "rounded-tr-none"),
        variant === "incoming"
          ? "bg-muted text-foreground"
          : "bg-primary text-primary-foreground",
        className
      )}
      {...props}
    >
      {tail && (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none",
            variant === "incoming" ? "text-muted" : "text-primary"
          )}
        >
          <ChatBubbleTail flip={variant === "outgoing"} />
        </span>
      )}
      {actions && (
        <span
          data-slot="chat-bubble-actions"
          // Keeps menu and dialog clicks from toggling the row in selection mode.
          onClick={(event) => event.stopPropagation()}
          className="float-right -mt-px -mr-1 ml-1.5 inline-flex"
        >
          {actions}
        </span>
      )}
      {children}
    </div>
  )
}

// Sender name shown on incoming messages in group chats.
function ChatBubbleSender({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-bubble-sender"
      className={cn(
        "text-[12.8px] font-medium text-primary",
        className
      )}
      {...props}
    />
  )
}

interface ChatBubbleQuoteProps extends React.ComponentProps<"div"> {
  /** Who wrote the quoted message. */
  sender?: React.ReactNode
}

// The quoted message WhatsApp stacks above the text when you reply to
// something. Render it as the first child of `ChatBubbleMessage`.
function ChatBubbleQuote({
  sender,
  className,
  children,
  ...props
}: ChatBubbleQuoteProps) {
  const { variant } = useChatBubble()
  const incoming = variant === "incoming"
  return (
    <div
      data-slot="chat-bubble-quote"
      data-variant={variant}
      className={cn(
        "mb-1 flex gap-2 overflow-hidden rounded-[5px] pr-2 text-[13px] leading-[18px]",
        incoming ? "bg-foreground/5" : "bg-primary-foreground/15",
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "w-1 shrink-0 self-stretch",
          incoming ? "bg-primary" : "bg-primary-foreground/70"
        )}
      />
      <div className="min-w-0 py-1">
        {sender && (
          <div
            data-slot="chat-bubble-quote-sender"
            className={cn(
              "truncate font-medium",
              incoming ? "text-primary" : "text-primary-foreground"
            )}
          >
            {sender}
          </div>
        )}
        <div
          className={cn(
            "line-clamp-2 break-words",
            incoming ? "text-muted-foreground" : "text-primary-foreground/80"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

// Renders inside ChatBubbleMessage, after the text. Floats to the
// bottom-right corner so the last line of text wraps around it,
// exactly like WhatsApp.
function ChatBubbleTimestamp({
  status,
  className,
  children,
  ...props
}: React.ComponentProps<"span"> & { status?: ChatBubbleStatus }) {
  const { variant } = useChatBubble()
  return (
    <span
      data-slot="chat-bubble-timestamp"
      className={cn(
        "float-right mt-[5px] ml-2 inline-flex translate-y-[3px] items-center gap-1 text-[11px] leading-none",
        variant === "incoming"
          ? "text-muted-foreground"
          : "text-primary-foreground/70",
        className
      )}
      {...props}
    >
      {children}
      {variant === "outgoing" && status && (
        <span
          data-slot="chat-bubble-status"
          data-status={status}
          className={cn(
            status === "read"
              ? "text-primary-foreground"
              : "text-primary-foreground/70"
          )}
        >
          {status === "sent" ? (
            <Check className="size-4" strokeWidth={1.5} />
          ) : (
            <CheckCheck className="size-4" strokeWidth={1.5} />
          )}
        </span>
      )}
    </span>
  )
}

interface ChatBubbleDeleteDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** How many messages are being deleted — pluralises the default copy. */
  count?: number
  /**
   * Offers "Delete for everyone" alongside "Delete for me". Turn it off for
   * incoming messages, or once the unsend window has passed.
   */
  canDeleteForEveryone?: boolean
  /** Fired with the scope the user picked. The dialog closes either way. */
  onDelete?: (scope: ChatBubbleDeleteScope) => void
  title?: React.ReactNode
  description?: React.ReactNode
  /** Overrides the three button labels. */
  labels?: Partial<Record<"everyone" | "me" | "cancel", string>>
}

// Asks *how* the delete should happen rather than just confirming it: the
// WhatsApp choice between clearing the message from this device and unsending
// it for every participant.
function ChatBubbleDeleteDialog({
  open,
  onOpenChange,
  count = 1,
  canDeleteForEveryone = true,
  onDelete,
  title,
  description,
  labels,
}: ChatBubbleDeleteDialogProps) {
  const plural = count > 1
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm" data-slot="chat-bubble-delete-dialog">
        <AlertDialogHeader>
          <div className="flex items-start gap-3">
            <AlertDialogIcon variant="destructive">
              <Trash2 />
            </AlertDialogIcon>
            <div className="flex flex-col gap-2">
              <AlertDialogTitle>
                {title ??
                  (plural ? `Delete ${count} messages?` : "Delete message?")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {description ??
                  (canDeleteForEveryone
                    ? `Delete for everyone removes ${
                        plural ? "these messages" : "this message"
                      } from the chat for all participants. Delete for me only clears ${
                        plural ? "them" : "it"
                      } from this device.`
                    : `${
                        plural ? "These messages" : "This message"
                      } will be cleared from this device only — everyone else keeps their copy.`)}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <div className="flex flex-col gap-2">
          {canDeleteForEveryone && (
            <AlertDialogAction
              variant="destructive"
              className="justify-center"
              onClick={() => onDelete?.("everyone")}
            >
              {labels?.everyone ?? "Delete for everyone"}
            </AlertDialogAction>
          )}
          <AlertDialogAction
            variant="outline"
            className="justify-center"
            onClick={() => onDelete?.("me")}
          >
            {labels?.me ?? "Delete for me"}
          </AlertDialogAction>
          <AlertDialogCancel variant="ghost" className="justify-center">
            {labels?.cancel ?? "Cancel"}
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

interface ChatBubbleMenuProps {
  /** Accessible label for the chevron trigger. Defaults to "Message actions". */
  label?: string
  /** "Reply" — quote this message in the composer. */
  onReply?: () => void
  /** "Forward" — forward this single message. */
  onForward?: () => void
  /** "Select messages" — put the thread into multi-select mode. */
  onSelectMessages?: () => void
  /** "Copy" — fired after `copyText` (if given) is written to the clipboard. */
  onCopy?: () => void
  /** Text the Copy item writes to the clipboard. */
  copyText?: string
  /** "Delete" — fired with the scope chosen in the delete dialog. */
  onDelete?: (scope: ChatBubbleDeleteScope) => void
  /** Passed through to the delete dialog. */
  canDeleteForEveryone?: boolean
  /** Further props for the delete dialog (copy, labels, count). */
  deleteDialogProps?: Omit<
    ChatBubbleDeleteDialogProps,
    "open" | "onOpenChange" | "onDelete" | "canDeleteForEveryone"
  >
  /** Overrides the menu item labels. */
  labels?: Partial<
    Record<"reply" | "forward" | "select" | "copy" | "delete", string>
  >
  /** Extra items appended below the built-in ones. */
  children?: React.ReactNode
}

// The chevron in the bubble's top-right corner and its action menu. Each item
// only renders when its handler is passed, so a bubble offers exactly the
// actions it supports. "Delete" opens `ChatBubbleDeleteDialog` and reports the
// scope the user picked.
function ChatBubbleMenu({
  label = "Message actions",
  onReply,
  onForward,
  onSelectMessages,
  onCopy,
  copyText,
  onDelete,
  canDeleteForEveryone = true,
  deleteDialogProps,
  labels,
  children,
}: ChatBubbleMenuProps) {
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const handleCopy = () => {
    if (copyText !== undefined) {
      void navigator.clipboard?.writeText(copyText)
    }
    onCopy?.()
  }

  const hasPrecedingItems = Boolean(
    onReply || onForward || onSelectMessages || onCopy || copyText !== undefined
  )

  return (
    <>
      <Popover>
        <PopoverTrigger
          data-slot="chat-bubble-menu-trigger"
          aria-label={label}
          className="inline-flex size-5 cursor-pointer items-center justify-center rounded-full text-current opacity-0 outline-none transition-opacity group-hover/bubble:opacity-100 focus-visible:opacity-100 aria-expanded:opacity-100 data-[popup-open]:opacity-100 [@media(hover:none)]:opacity-100"
        >
          <ChevronDown className="size-4" />
        </PopoverTrigger>
        <PopoverContent align="end" className="min-w-44">
          {onReply && (
            <PopoverItem onClick={onReply}>
              <Reply />
              {labels?.reply ?? "Reply"}
            </PopoverItem>
          )}
          {onForward && (
            <PopoverItem onClick={onForward}>
              <Forward />
              {labels?.forward ?? "Forward"}
            </PopoverItem>
          )}
          {onSelectMessages && (
            <PopoverItem onClick={onSelectMessages}>
              <ListChecks />
              {labels?.select ?? "Select messages"}
            </PopoverItem>
          )}
          {(onCopy || copyText !== undefined) && (
            <PopoverItem onClick={handleCopy}>
              <Copy />
              {labels?.copy ?? "Copy"}
            </PopoverItem>
          )}
          {children}
          {onDelete && hasPrecedingItems && <PopoverSeparator />}
          {onDelete && (
            <PopoverItem
              onClick={() => setDeleteOpen(true)}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:bg-destructive/10 focus-visible:text-destructive"
            >
              <Trash2 />
              {labels?.delete ?? "Delete"}
            </PopoverItem>
          )}
        </PopoverContent>
      </Popover>

      {onDelete && (
        <ChatBubbleDeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          canDeleteForEveryone={canDeleteForEveryone}
          onDelete={onDelete}
          {...deleteDialogProps}
        />
      )}
    </>
  )
}

export {
  ChatBubble,
  ChatBubbleDeleteDialog,
  ChatBubbleMenu,
  ChatBubbleMessage,
  ChatBubbleQuote,
  ChatBubbleSelectIndicator,
  ChatBubbleSender,
  ChatBubbleTimestamp,
  type ChatBubbleDeleteDialogProps,
  type ChatBubbleDeleteScope,
  type ChatBubbleMenuProps,
  type ChatBubbleMessageProps,
  type ChatBubbleProps,
  type ChatBubbleQuoteProps,
  type ChatBubbleStatus,
  type ChatBubbleVariant,
}

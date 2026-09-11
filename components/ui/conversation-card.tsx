"use client"

import * as React from "react"
import { Pin, User, Users } from "lucide-react"

import { cn } from "@/lib/utils"

type ConversationType = "direct" | "group"

// Default avatar shown when no custom `icon` is supplied. A single-person
// glyph for one-to-one chats, a group glyph for group conversations.
function ConversationCardIcon({
  type,
  className,
  ...props
}: React.ComponentProps<"div"> & { type: ConversationType }) {
  const Icon = type === "group" ? Users : User
  return (
    <div
      data-slot="conversation-card-icon"
      data-type={type}
      className={cn(
        "flex size-10 shrink-0 items-center justify-center text-muted-foreground group-hover:text-conversation-card-active-foreground group-data-[selected]:text-conversation-card-active-foreground",
        className
      )}
      {...props}
    >
      <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
    </div>
  )
}

// Green pill badge anchored to the top-right corner of the card, showing the
// number of new/unread messages. Rendered whenever `count` is non-null; the
// caller (ConversationCard) decides whether a 0 count is shown via `showZero`.
//
// NOTE: the badge is centered on the corner point (translate offsets), so it
// intentionally bleeds slightly outside the card edges. Any ancestor container
// with `overflow-hidden` will clip it — keep the list wrapper overflow-visible
// (or add padding/margin) if you use this badge.
function ConversationCardBadge({
  count,
  className,
  ...props
}: React.ComponentProps<"span"> & { count: number }) {
  return (
    <span
      data-slot="conversation-card-badge"
      className={cn(
        "pointer-events-none absolute top-0 right-0 flex h-5 min-w-5 -translate-y-1/2 translate-x-1/2 items-center justify-center",
        "rounded-full bg-conversation-card-badge px-1.5 text-xs font-medium text-conversation-card-badge-foreground tabular-nums",
        className
      )}
      aria-label={`${count} new ${count === 1 ? "message" : "messages"}`}
      {...props}
    >
      {count > 99 ? "99+" : count}
    </span>
  )
}

// Truncates the preview text to `previewLength` characters, appending an
// ellipsis when it overflows. CSS line-clamp also guards against long words,
// but this keeps the character budget explicit per the design.
function truncate(text: string, max: number) {
  if (text.length <= max) return text
  return text.slice(0, max).trimEnd() + "…"
}

interface ConversationCardProps
  extends Omit<React.ComponentProps<"button">, "title" | "type"> {
  /** Controls the default icon: a person glyph vs. a group glyph. */
  type?: ConversationType
  /** Conversation name shown in bold on the first line. */
  title: React.ReactNode
  /** Last message preview, truncated to `previewLength` characters. */
  lastMessage?: string
  /** Timestamp shown on the right of the title row (e.g. "9:41 AM"). */
  time?: React.ReactNode
  /** Pins the card; pinned cards show a pin icon. Sort with `sortConversations`. */
  pinned?: boolean
  /** Highlights the card as the active conversation. */
  selected?: boolean
  /** Max characters of `lastMessage` to show before truncating. Defaults to 40. */
  previewLength?: number
  /** Optional custom avatar/icon, replacing the default person/group glyph. */
  icon?: React.ReactNode
  /** Number of new/unread messages, shown in a green badge at the top-right. */
  unreadCount?: number
  /** When true, show the badge even if `unreadCount` is 0. Defaults to false. */
  showZero?: boolean
}

function ConversationCard({
  type = "direct",
  title,
  lastMessage,
  time,
  pinned = false,
  selected = false,
  previewLength = 40,
  icon,
  unreadCount,
  showZero = false,
  className,
  ...props
}: ConversationCardProps) {
  const showBadge = unreadCount != null && (unreadCount > 0 || showZero)

  return (
    <button
      type="button"
      data-slot="conversation-card"
      data-type={type}
      data-pinned={pinned || undefined}
      data-selected={selected || undefined}
      aria-pressed={selected}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-lg border border-white/40 bg-conversation-card px-3 py-2.5 text-left shadow-sm backdrop-blur-md backdrop-saturate-150 transition-colors dark:border-white/10",
        "hover:bg-conversation-card-active hover:text-conversation-card-active-foreground",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        selected &&
          "border-transparent bg-conversation-card-active text-conversation-card-active-foreground",
        className
      )}
      {...props}
    >
      {showBadge && <ConversationCardBadge count={unreadCount} />}

      {icon ?? <ConversationCardIcon type={type} />}

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span
            data-slot="conversation-card-title"
            className="min-w-0 flex-1 truncate text-sm font-semibold"
          >
            {title}
          </span>
          {time != null && (
            <span
              data-slot="conversation-card-time"
              className="shrink-0 text-xs text-muted-foreground group-hover:text-conversation-card-active-foreground group-data-[selected]:text-conversation-card-active-foreground"
            >
              {time}
            </span>
          )}
        </div>

        {(lastMessage != null || pinned) && (
          <div className="flex items-center gap-1">
            {lastMessage != null && (
              <span
                data-slot="conversation-card-preview"
                className="min-w-0 flex-1 truncate text-xs text-muted-foreground group-hover:text-conversation-card-active-foreground group-data-[selected]:text-conversation-card-active-foreground"
              >
                {truncate(lastMessage, previewLength)}
              </span>
            )}
            {pinned && (
              <Pin
                data-slot="conversation-card-pin"
                className="size-3.5 shrink-0 rotate-45 fill-current text-muted-foreground group-hover:text-conversation-card-active-foreground group-data-[selected]:text-conversation-card-active-foreground"
                aria-label="Pinned"
              />
            )}
          </div>
        )}
      </div>
    </button>
  )
}

// Stable sort that floats pinned conversations to the top while preserving the
// existing order within the pinned and unpinned groups.
function sortConversations<T extends { pinned?: boolean }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))
  )
}

export {
  ConversationCard,
  ConversationCardIcon,
  ConversationCardBadge,
  sortConversations,
  type ConversationCardProps,
  type ConversationType,
}

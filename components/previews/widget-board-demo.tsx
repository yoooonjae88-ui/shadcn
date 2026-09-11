"use client"

import * as React from "react"
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  CalendarClock,
  Check,
  GitPullRequest,
  ListTodo,
  MessageSquare,
  RotateCcw,
  Send,
  Sparkles,
  UserPlus,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/registry/sidebar/sidebar"
import {
  WidgetBoard,
  WidgetCanvas,
  WidgetCard,
  WidgetSource,
  WidgetTrash,
  useWidgetBoard,
} from "@/registry/widget-board/widget-board"

// ---------------------------------------------------------------------------
// Interactive widgets. Each owns its own local state and lives entirely in the
// card body, which stays interactive because only the card header is draggable.
// ---------------------------------------------------------------------------

// A ChatGPT-style prompt window: type a message, hit send, get a canned reply.
function ChatWidget() {
  const [messages, setMessages] = React.useState<
    { role: "user" | "assistant"; text: string }[]
  >([{ role: "assistant", text: "Hi! Ask me anything to get started." }])
  const [input, setInput] = React.useState("")
  const listRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages])

  function send(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setMessages((m) => [
      ...m,
      { role: "user", text },
      {
        role: "assistant",
        text: `You said: “${text}”. This is a demo response.`,
      },
    ])
    setInput("")
  }

  return (
    <div className="flex h-60 flex-col gap-2">
      <div ref={listRef} className="flex-1 space-y-2 overflow-auto pr-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "flex",
              m.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-3 py-1.5 text-xs",
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              )}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={send} className="flex items-center gap-1.5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message assistant…"
          className="h-8 min-w-0 flex-1 rounded-lg bg-muted px-3 text-xs text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
        />
        <Button type="submit" size="icon-sm" aria-label="Send message">
          <Send />
        </Button>
      </form>
    </div>
  )
}

// A dismissable notifications list.
function NotificationsWidget() {
  const [items, setItems] = React.useState([
    {
      id: 1,
      icon: <MessageSquare />,
      title: "New comment from Dana",
      time: "2m",
      unread: true,
    },
    {
      id: 2,
      icon: <GitPullRequest />,
      title: "PR #128 was approved",
      time: "1h",
      unread: true,
    },
    {
      id: 3,
      icon: <UserPlus />,
      title: "Sam joined your team",
      time: "3h",
      unread: false,
    },
    {
      id: 4,
      icon: <AlertTriangle />,
      title: "Build failed on main",
      time: "5h",
      unread: false,
    },
  ])

  if (items.length === 0) {
    return (
      <p className="py-6 text-center text-xs text-muted-foreground">
        You&rsquo;re all caught up.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-0.5">
      {items.map((n) => (
        <li
          key={n.id}
          className="group/notif flex items-start gap-2 rounded-lg p-2 transition-colors hover:bg-muted"
        >
          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-3.5">
            {n.icon}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-foreground">
              {n.title}
            </p>
            <p className="text-[11px] text-muted-foreground">{n.time} ago</p>
          </div>
          {n.unread && (
            <span className="mt-1 size-2 shrink-0 rounded-full bg-primary group-hover/notif:hidden" />
          )}
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setItems((x) => x.filter((i) => i.id !== n.id))}
            className="hidden size-5 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-card hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 group-hover/notif:flex"
          >
            <Check className="size-3.5" />
          </button>
        </li>
      ))}
    </ul>
  )
}

// An interactable schedule for today and tomorrow: switch days, tick events off.
function CalendarWidget() {
  const today = React.useMemo(() => new Date(), [])
  const tomorrow = React.useMemo(() => {
    const d = new Date(today)
    d.setDate(d.getDate() + 1)
    return d
  }, [today])

  const fmt = (d: Date) =>
    d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    })

  const eventsByDay = {
    today: [
      { id: "t1", time: "09:00", title: "Daily standup" },
      { id: "t2", time: "13:30", title: "Lunch with Priya" },
      { id: "t3", time: "16:00", title: "Design review" },
    ],
    tomorrow: [
      { id: "m1", time: "10:00", title: "1:1 with manager" },
      { id: "m2", time: "15:00", title: "Release planning" },
    ],
  } as const

  const [day, setDay] = React.useState<"today" | "tomorrow">("today")
  const [done, setDone] = React.useState<Record<string, boolean>>({})
  const events = eventsByDay[day]

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
        {(["today", "tomorrow"] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDay(d)}
            data-active={day === d ? "" : undefined}
            className="flex flex-col items-center rounded-md px-2 py-1 text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 data-active:bg-card data-active:text-foreground data-active:shadow-sm"
          >
            <span className="text-xs font-medium capitalize">{d}</span>
            <span className="text-[10px]">
              {fmt(d === "today" ? today : tomorrow)}
            </span>
          </button>
        ))}
      </div>
      <ul className="flex flex-col gap-0.5">
        {events.map((ev) => {
          const isDone = !!done[ev.id]
          return (
            <li key={ev.id}>
              <button
                type="button"
                onClick={() =>
                  setDone((s) => ({ ...s, [ev.id]: !s[ev.id] }))
                }
                className="flex w-full items-center gap-2 rounded-lg p-1.5 text-left transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <span
                  data-done={isDone ? "" : undefined}
                  className="flex size-4 shrink-0 items-center justify-center rounded-full bg-muted text-primary-foreground transition-colors data-done:bg-primary [&_svg]:size-3"
                >
                  {isDone && <Check />}
                </span>
                <span className="w-10 shrink-0 text-[11px] tabular-nums text-muted-foreground">
                  {ev.time}
                </span>
                <span
                  className={cn(
                    "flex-1 truncate text-xs text-foreground",
                    isDone && "text-muted-foreground line-through"
                  )}
                >
                  {ev.title}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Catalog: maps a widget `type` to its sidebar label/icon and its body. Because
// the board only persists `{ id, type }`, widgets rerender from this map on
// reload — keep all presentation here. `width` tunes the card per widget type.
// ---------------------------------------------------------------------------
const CATALOG: Record<
  string,
  {
    label: string
    icon: React.ReactNode
    width: string
    render: () => React.ReactNode
  }
> = {
  chat: {
    label: "AI prompt",
    icon: <Sparkles />,
    width: "w-80",
    render: () => <ChatWidget />,
  },
  notifications: {
    label: "Notifications",
    icon: <Bell />,
    width: "w-72",
    render: () => <NotificationsWidget />,
  },
  events: {
    label: "Schedule",
    icon: <CalendarClock />,
    width: "w-72",
    render: () => <CalendarWidget />,
  },
  stats: {
    label: "Quick stats",
    icon: <BarChart3 />,
    width: "w-60",
    render: () => (
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-muted/60 p-2">
          <div className="text-lg font-semibold text-foreground">2,481</div>
          <div className="text-xs">Visitors</div>
        </div>
        <div className="rounded-lg bg-muted/60 p-2">
          <div className="text-lg font-semibold text-foreground">$12.4k</div>
          <div className="text-xs">Revenue</div>
        </div>
      </div>
    ),
  },
  activity: {
    label: "Activity",
    icon: <Activity />,
    width: "w-60",
    render: () => (
      <ul className="flex flex-col gap-1.5">
        <li>· Deploy succeeded</li>
        <li>· 3 new sign-ups</li>
        <li>· Backup completed</li>
      </ul>
    ),
  },
  tasks: {
    label: "Tasks",
    icon: <ListTodo />,
    width: "w-60",
    render: () => (
      <ul className="flex flex-col gap-1.5">
        <li className="flex items-center gap-2">
          <Check className="size-4 text-primary" /> Review PR #128
        </li>
        <li className="flex items-center gap-2">
          <Check className="size-4 text-muted-foreground/40" /> Ship release
          notes
        </li>
      </ul>
    ),
  },
}

export function WidgetBoardDemo() {
  const board = useWidgetBoard({
    // Bumped key: the widget catalog changed, so start fresh rather than
    // rehydrating older saved types.
    storageKey: "widget-board-demo-v2",
    initial: [
      { id: "seed-chat", type: "chat" },
      { id: "seed-events", type: "events" },
    ],
  })

  return (
    <div className="flex w-full max-w-3xl flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Drag a widget by its header onto the board, rearrange it, then drop
          one on the trash to delete it. Widget bodies stay fully interactive,
          and your layout is saved to localStorage.
        </p>
        <Button size="sm" variant="outline" onClick={board.reset}>
          <RotateCcw /> Reset layout
        </Button>
      </div>

      <WidgetBoard board={board}>
        <div className="flex h-[28rem] overflow-hidden rounded-xl bg-background shadow-sm">
          <Sidebar className="bg-sidebar">
            <SidebarGroup>
              <SidebarGroupLabel>Widgets</SidebarGroupLabel>
              {Object.entries(CATALOG).map(([type, { label, icon }]) => (
                <WidgetSource key={type} type={type} icon={icon}>
                  {label}
                </WidgetSource>
              ))}
            </SidebarGroup>

            <SidebarGroup placement="bottom">
              <WidgetTrash />
            </SidebarGroup>
          </Sidebar>

          <div className="flex flex-1 flex-col p-3">
            <WidgetCanvas>
              {board.widgets.map((widget, index) => {
                const entry = CATALOG[widget.type]
                if (!entry) return null
                return (
                  <WidgetCard
                    key={widget.id}
                    widget={widget}
                    index={index}
                    icon={entry.icon}
                    title={entry.label}
                    className={entry.width}
                  >
                    {entry.render()}
                  </WidgetCard>
                )
              })}
            </WidgetCanvas>
          </div>
        </div>
      </WidgetBoard>
    </div>
  )
}

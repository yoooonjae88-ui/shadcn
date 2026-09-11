"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

type PaginationItemType = "page" | "prev" | "next" | "jump-prev" | "jump-next"
type PaginationSize = "default" | "small"
type PaginationAlign = "start" | "center" | "end"

interface PaginationProps
  extends Omit<React.ComponentProps<"nav">, "onChange"> {
  /** Current page (controlled). */
  current?: number
  /** Initial page when uncontrolled. */
  defaultCurrent?: number
  /** Total number of data items. */
  total?: number
  /** Items per page (controlled). */
  pageSize?: number
  /** Initial page size when uncontrolled. */
  defaultPageSize?: number
  /** Called when the page or page size changes. */
  onChange?: (page: number, pageSize: number) => void
  /** Called when the page size changes. */
  onShowSizeChange?: (current: number, size: number) => void
  /** Disable the whole pagination. */
  disabled?: boolean
  /** Hide the pager entirely when there is only one page. */
  hideOnSinglePage?: boolean
  /** Show fewer page items (ellipsis jumps 3 pages instead of 5). */
  showLessItems?: boolean
  /** Show the page-size select. Defaults to true when total > 50. */
  showSizeChanger?: boolean
  /** Options for the page-size select. */
  pageSizeOptions?: number[]
  /** Show the "Go to" quick-jump input. */
  showQuickJumper?: boolean
  /** Add native title tooltips to the page items. */
  showTitle?: boolean
  /** Render a total summary, e.g. (total, [from, to]) => `1-10 of 85`. */
  showTotal?: (total: number, range: [number, number]) => React.ReactNode
  /** Simple mode: prev, an editable page input over the page count, next. */
  simple?: boolean | { readOnly?: boolean }
  /** Item size. */
  size?: PaginationSize
  /** Horizontal alignment of the pager inside its container. */
  align?: PaginationAlign
  /** Customize the rendered element of a page / prev / next / jump item. */
  itemRender?: (
    page: number,
    type: PaginationItemType,
    element: React.ReactNode
  ) => React.ReactNode
}

/** Builds the visible sequence of page numbers and ellipsis jumpers. */
function getPageItems(
  current: number,
  totalPages: number,
  showLessItems: boolean
): (number | "jump-prev" | "jump-next")[] {
  const buffer = showLessItems ? 1 : 2

  if (totalPages <= 3 + buffer * 2) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // Keep a fixed-width window of pages around the current one, pinned to the
  // edges so the item count stays constant while paging.
  let left = Math.max(1, current - buffer)
  let right = Math.min(current + buffer, totalPages)
  if (current - 1 <= buffer) right = 1 + buffer * 2
  if (totalPages - current <= buffer) left = totalPages - buffer * 2

  const items: (number | "jump-prev" | "jump-next")[] = [1]
  if (left > 2) items.push("jump-prev")
  for (
    let page = Math.max(2, left);
    page <= Math.min(right, totalPages - 1);
    page++
  ) {
    items.push(page)
  }
  if (right < totalPages - 1) items.push("jump-next")
  items.push(totalPages)
  return items
}

function Pagination({
  current: currentProp,
  defaultCurrent = 1,
  total = 0,
  pageSize: pageSizeProp,
  defaultPageSize = 10,
  onChange,
  onShowSizeChange,
  disabled = false,
  hideOnSinglePage = false,
  showLessItems = false,
  showSizeChanger,
  pageSizeOptions = [10, 20, 50, 100],
  showQuickJumper = false,
  showTitle = true,
  showTotal,
  simple = false,
  size = "default",
  align = "start",
  itemRender,
  className,
  ...props
}: PaginationProps) {
  const [innerCurrent, setInnerCurrent] = React.useState(defaultCurrent)
  const [innerPageSize, setInnerPageSize] = React.useState(defaultPageSize)

  const pageSize = pageSizeProp ?? innerPageSize
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const current = Math.min(Math.max(currentProp ?? innerCurrent, 1), totalPages)

  const isSimple = simple === true || typeof simple === "object"
  const simpleReadOnly = typeof simple === "object" && simple.readOnly === true
  const small = size === "small"
  const sizeChangerVisible = showSizeChanger ?? total > 50
  const jumpDelta = showLessItems ? 3 : 5

  const changePage = (page: number) => {
    const next = Math.min(Math.max(page, 1), totalPages)
    if (disabled) return
    setInnerCurrent(next)
    if (next !== current) onChange?.(next, pageSize)
  }

  const changePageSize = (nextSize: number) => {
    if (disabled || nextSize === pageSize) return
    const nextTotalPages = Math.max(1, Math.ceil(total / nextSize))
    const nextCurrent = Math.min(current, nextTotalPages)
    setInnerPageSize(nextSize)
    setInnerCurrent(nextCurrent)
    onShowSizeChange?.(nextCurrent, nextSize)
    onChange?.(nextCurrent, nextSize)
  }

  if (hideOnSinglePage && totalPages <= 1) return null

  const itemBase = cn(
    "inline-flex cursor-pointer items-center justify-center rounded-md tabular-nums transition-colors outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent",
    small
      ? "size-6 text-xs [&_svg]:size-3.5"
      : "size-8 text-sm [&_svg]:size-4"
  )
  const itemIdle = "text-foreground hover:bg-pagination-item-hover"
  const itemActive =
    "bg-pagination-item-active font-medium text-pagination-item-active-foreground"

  const renderInLi = (
    key: React.Key,
    page: number,
    type: PaginationItemType,
    element: React.ReactNode,
    onActivate: () => void
  ) => (
    // Activation lives on the <li> (clicks from the default button bubble up
    // here) so itemRender can swap in a custom element — e.g. a router <a> —
    // and page changes still fire. Disabled buttons don't bubble clicks.
    <li key={key} onClick={onActivate}>
      {itemRender ? itemRender(page, type, element) : element}
    </li>
  )

  const range: [number, number] =
    total === 0
      ? [0, 0]
      : [(current - 1) * pageSize + 1, Math.min(current * pageSize, total)]

  const totalText = showTotal ? (
    <li
      className={cn(
        "flex items-center text-muted-foreground",
        small ? "text-xs" : "text-sm",
        disabled && "opacity-40"
      )}
    >
      {showTotal(total, range)}
    </li>
  ) : null

  const prevDisabled = disabled || current <= 1
  const nextDisabled = disabled || current >= totalPages

  const prevItem = renderInLi(
    "prev",
    Math.max(1, current - 1),
    "prev",
    <button
      type="button"
      aria-label="Previous page"
      title={showTitle ? "Previous page" : undefined}
      disabled={prevDisabled}
      className={cn(itemBase, itemIdle)}
    >
      <ChevronLeftIcon />
    </button>,
    () => changePage(current - 1)
  )

  const nextItem = renderInLi(
    "next",
    Math.min(totalPages, current + 1),
    "next",
    <button
      type="button"
      aria-label="Next page"
      title={showTitle ? "Next page" : undefined}
      disabled={nextDisabled}
      className={cn(itemBase, itemIdle)}
    >
      <ChevronRightIcon />
    </button>,
    () => changePage(current + 1)
  )

  const sizeChanger = sizeChangerVisible && !isSimple && (
    <li className="flex items-center">
      <SelectPrimitive.Root
        value={pageSize}
        onValueChange={(value) => changePageSize(value as number)}
        disabled={disabled}
      >
        <SelectPrimitive.Trigger
          aria-label="Page size"
          className={cn(
            "flex cursor-pointer items-center gap-1.5 rounded-md bg-input-background text-foreground transition-colors outline-none select-none hover:bg-pagination-item-hover focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40",
            small ? "h-6 px-1.5 text-xs" : "h-8 px-2.5 text-sm"
          )}
        >
          <span className="whitespace-nowrap">{pageSize} / page</span>
          <ChevronDownIcon
            className={cn(
              "text-muted-foreground",
              small ? "size-3" : "size-3.5"
            )}
          />
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Positioner
            sideOffset={4}
            align="start"
            alignItemWithTrigger={false}
            className="z-50"
          >
            <SelectPrimitive.Popup className="max-h-[var(--available-height)] min-w-[var(--anchor-width)] overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md outline-none">
              {pageSizeOptions.map((option) => (
                <SelectPrimitive.Item
                  key={option}
                  value={option}
                  className={cn(
                    "relative flex cursor-default items-center gap-2 rounded-md py-1.5 pr-7 pl-2 outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground",
                    small ? "text-xs" : "text-sm"
                  )}
                >
                  <SelectPrimitive.ItemText>
                    {option} / page
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute right-1.5 flex size-4 items-center justify-center">
                    <CheckIcon className="size-3.5" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Popup>
          </SelectPrimitive.Positioner>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </li>
  )

  const quickJumper = showQuickJumper && !isSimple && (
    <li
      className={cn(
        "flex items-center gap-2 text-foreground",
        small ? "text-xs" : "text-sm",
        disabled && "opacity-40"
      )}
    >
      Go to
      <input
        type="text"
        inputMode="numeric"
        aria-label="Jump to page"
        disabled={disabled}
        className={cn(
          "rounded-md bg-input-background text-center text-foreground transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed",
          small ? "h-6 w-10 text-xs" : "h-8 w-12 text-sm"
        )}
        onKeyDown={(event) => {
          if (event.key !== "Enter") return
          const input = event.currentTarget
          const page = Number.parseInt(input.value, 10)
          if (!Number.isNaN(page)) changePage(page)
          input.value = ""
        }}
      />
    </li>
  )

  let pager: React.ReactNode

  if (isSimple) {
    pager = (
      <li
        className={cn(
          "flex items-center gap-1.5 text-foreground tabular-nums",
          small ? "text-xs" : "text-sm",
          disabled && "opacity-40"
        )}
      >
        {simpleReadOnly ? (
          <span>{current}</span>
        ) : (
          <input
            key={current}
            type="text"
            inputMode="numeric"
            aria-label="Page"
            defaultValue={current}
            disabled={disabled}
            className={cn(
              "rounded-md bg-input-background text-center text-foreground transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed",
              small ? "h-6 w-9 text-xs" : "h-8 w-11 text-sm"
            )}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return
              event.currentTarget.blur()
            }}
            onBlur={(event) => {
              const page = Number.parseInt(event.currentTarget.value, 10)
              if (!Number.isNaN(page)) changePage(page)
              event.currentTarget.value = String(
                Number.isNaN(page)
                  ? current
                  : Math.min(Math.max(page, 1), totalPages)
              )
            }}
          />
        )}
        <span className="text-muted-foreground">/</span>
        <span>{totalPages}</span>
      </li>
    )
  } else {
    pager = getPageItems(current, totalPages, showLessItems).map((item) => {
      if (item === "jump-prev" || item === "jump-next") {
        const isPrev = item === "jump-prev"
        const targetPage = isPrev
          ? Math.max(1, current - jumpDelta)
          : Math.min(totalPages, current + jumpDelta)
        const title = isPrev
          ? `Previous ${jumpDelta} pages`
          : `Next ${jumpDelta} pages`
        const JumpIcon = isPrev ? ChevronsLeftIcon : ChevronsRightIcon
        return renderInLi(
          item,
          targetPage,
          item,
          <button
            type="button"
            aria-label={title}
            title={showTitle ? title : undefined}
            disabled={disabled}
            className={cn(itemBase, itemIdle, "group/jump")}
          >
            {/* The ••• swaps to a double chevron on hover/focus, like antd. */}
            <span className="tracking-widest text-pagination-ellipsis group-hover/jump:hidden group-focus-visible/jump:hidden">
              •••
            </span>
            <JumpIcon className="hidden text-pagination-jump group-hover/jump:block group-focus-visible/jump:block" />
          </button>,
          () => changePage(targetPage)
        )
      }

      const active = item === current
      return renderInLi(
        item,
        item,
        "page",
        <button
          type="button"
          aria-current={active ? "page" : undefined}
          title={showTitle ? String(item) : undefined}
          disabled={disabled}
          className={cn(itemBase, active ? itemActive : itemIdle)}
        >
          {item}
        </button>,
        () => changePage(item)
      )
    })
  }

  return (
    <nav
      data-slot="pagination"
      aria-label="Pagination"
      className={cn(
        "flex w-full",
        align === "center" && "justify-center",
        align === "end" && "justify-end",
        className
      )}
      {...props}
    >
      <ul
        className={cn(
          "flex flex-wrap items-center",
          small ? "gap-1" : "gap-1.5"
        )}
      >
        {totalText}
        {prevItem}
        {pager}
        {nextItem}
        {sizeChanger}
        {quickJumper}
      </ul>
    </nav>
  )
}

export { Pagination }
export type { PaginationProps, PaginationItemType }

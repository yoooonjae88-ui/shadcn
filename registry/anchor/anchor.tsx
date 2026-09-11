"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type AnchorDirection = "vertical" | "horizontal"
type AnchorContainer = HTMLElement | Window

interface AnchorItem {
  key: React.Key
  href: string
  title: React.ReactNode
  /** `target` attribute of the rendered `<a>`. */
  target?: string
  /** Replace the history entry instead of pushing one (overrides the Anchor-level `replace`). */
  replace?: boolean
  /** Nested links, one indent level deeper. Only rendered in vertical direction. */
  children?: AnchorItem[]
}

interface AnchorProps
  extends Omit<React.ComponentProps<"nav">, "onClick" | "onChange"> {
  items: AnchorItem[]
  direction?: AnchorDirection
  /** Pin the anchor while the page scrolls (sticky). On by default, like Ant Design. */
  affix?: boolean
  /** Sticky offset from the top of the viewport when `affix` is on. */
  offsetTop?: number
  /** Scroll offset between the container top and a section when jumping / highlighting. Defaults to `offsetTop`. */
  targetOffset?: number
  /** Extra tolerance (px) added when deciding which section is active. */
  bounds?: number
  /** Replace the history entry instead of pushing one when a link is clicked. */
  replace?: boolean
  /** Show the ink indicator even when `affix` is off. */
  showInkInFixed?: boolean
  /** The scrolling container the sections live in. Defaults to the window. */
  getContainer?: () => AnchorContainer
  /** Customize which link is highlighted, given the computed active link. */
  getCurrentAnchor?: (activeLink: string) => string
  onChange?: (activeLink: string) => void
  onClick?: (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: { title: React.ReactNode; href: string }
  ) => void
}

/** Resolve `#id` (or `/page#id`) to the section element it points at. */
function getHashElement(href: string): HTMLElement | null {
  const i = href.indexOf("#")
  if (i === -1) return null
  const id = decodeURIComponent(href.slice(i + 1))
  return id ? document.getElementById(id) : null
}

/** A section's top edge, measured from the top of the scroll container. */
function getTargetTop(el: HTMLElement, container: AnchorContainer): number {
  const top = el.getBoundingClientRect().top
  return container instanceof HTMLElement
    ? top - container.getBoundingClientRect().top
    : top
}

function Anchor({
  items,
  direction = "vertical",
  affix = true,
  offsetTop,
  targetOffset,
  bounds = 5,
  replace = false,
  showInkInFixed = false,
  getContainer,
  getCurrentAnchor,
  onChange,
  onClick,
  className,
  style,
  ...props
}: AnchorProps) {
  const navRef = React.useRef<HTMLElement>(null)
  const linkRefs = React.useRef(new Map<string, HTMLAnchorElement>())
  const activeRef = React.useRef("")
  const [activeLink, setActiveLink] = React.useState("")
  // While a click-triggered smooth scroll is running, scroll events must not
  // move the highlight through the sections being flown past. The token lets
  // a second click invalidate the first click's pending "scroll finished"
  // callbacks instead of them ending the second animation early.
  const animationToken = React.useRef(0)
  const animating = React.useRef(false)

  const scrollOffset = targetOffset ?? offsetTop ?? 0

  // Kept in refs so scroll/click handlers always see the latest callbacks
  // without re-binding container listeners every render.
  const getContainerRef = React.useRef(getContainer)
  const onChangeRef = React.useRef(onChange)
  React.useEffect(() => {
    getContainerRef.current = getContainer
    onChangeRef.current = onChange
  })

  const updateActive = React.useCallback((link: string) => {
    if (activeRef.current === link) return
    activeRef.current = link
    setActiveLink(link)
    onChangeRef.current?.(link)
  }, [])

  // Every href to watch, in order. Horizontal anchors don't render nested
  // children, so they're excluded from detection too.
  const hrefs = React.useMemo(() => {
    const out: string[] = []
    const walk = (list: AnchorItem[]) => {
      for (const item of list) {
        if (item.href) out.push(item.href)
        if (direction === "vertical" && item.children) walk(item.children)
      }
    }
    walk(items)
    return out
  }, [items, direction])

  // Scroll spy: the active link is the section furthest down the page whose
  // top has scrolled up past the (offset + bounds) line.
  React.useEffect(() => {
    const container = getContainerRef.current?.() ?? window
    const handleScroll = () => {
      if (animating.current) return
      let best: { href: string; top: number } | null = null
      for (const href of hrefs) {
        const el = getHashElement(href)
        if (!el) continue
        const top = getTargetTop(el, container)
        if (top <= scrollOffset + bounds && (!best || top > best.top)) {
          best = { href, top }
        }
      }
      updateActive(best?.href ?? "")
    }
    handleScroll()
    container.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll)
    return () => {
      container.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [hrefs, scrollOffset, bounds, updateActive])

  const currentActive = getCurrentAnchor
    ? getCurrentAnchor(activeLink)
    : activeLink

  // Ink indicator geometry: offset + length of the active link along the
  // anchor's axis (top/height when vertical, left/width when horizontal).
  const [ink, setInk] = React.useState<{ start: number; size: number } | null>(
    null
  )
  React.useEffect(() => {
    const measure = () => {
      const nav = navRef.current
      const link = currentActive
        ? linkRefs.current.get(currentActive)
        : undefined
      if (!nav || !link) {
        setInk(null)
        return
      }
      const navRect = nav.getBoundingClientRect()
      const rect = link.getBoundingClientRect()
      setInk(
        direction === "horizontal"
          ? { start: rect.left - navRect.left, size: rect.width }
          : { start: rect.top - navRect.top, size: rect.height }
      )
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [currentActive, direction, items])

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: AnchorItem
  ) => {
    onClick?.(e, { title: item.title, href: item.href })
    if (e.defaultPrevented) return
    const el = getHashElement(item.href)
    if (!el) return // no matching section — let the browser follow the href
    e.preventDefault()

    if (item.replace ?? replace) {
      history.replaceState(null, "", item.href)
    } else {
      history.pushState(null, "", item.href)
    }

    const container = getContainerRef.current?.() ?? window
    const token = ++animationToken.current
    animating.current = true
    updateActive(item.href)

    const delta = getTargetTop(el, container) - scrollOffset
    if (container instanceof HTMLElement) {
      container.scrollTo({ top: container.scrollTop + delta, behavior: "smooth" })
    } else {
      container.scrollTo({ top: container.scrollY + delta, behavior: "smooth" })
    }

    const finish = () => {
      if (animationToken.current === token) animating.current = false
      container.removeEventListener("scrollend", finish)
    }
    container.addEventListener("scrollend", finish, { once: true })
    // Fallback for browsers without `scrollend` (and for zero-distance jumps
    // that never fire a scroll event).
    window.setTimeout(finish, 1000)
  }

  const showInk = affix || showInkInFixed

  const renderItem = (item: AnchorItem, depth: number) => {
    const active = currentActive === item.href
    return (
      <li key={item.key}>
        <a
          ref={(node) => {
            if (node) linkRefs.current.set(item.href, node)
            else linkRefs.current.delete(item.href)
          }}
          href={item.href}
          target={item.target}
          data-slot="anchor-link"
          data-active={active || undefined}
          aria-current={active ? "true" : undefined}
          title={typeof item.title === "string" ? item.title : undefined}
          onClick={(e) => handleLinkClick(e, item)}
          className={cn(
            "block py-1.5 text-anchor-link transition-colors hover:text-anchor-link-hover",
            direction === "vertical"
              ? "truncate pr-2"
              : "px-3 whitespace-nowrap",
            active && "text-anchor-link-active hover:text-anchor-link-active"
          )}
          // Each nesting level indents one step further from the rail.
          style={
            direction === "vertical"
              ? { paddingLeft: 16 + depth * 16 }
              : undefined
          }
        >
          {item.title}
        </a>
        {direction === "vertical" && item.children?.length ? (
          <ul>{item.children.map((child) => renderItem(child, depth + 1))}</ul>
        ) : null}
      </li>
    )
  }

  return (
    <nav
      ref={navRef}
      data-slot="anchor"
      data-direction={direction}
      className={cn("relative text-sm", affix && "sticky z-10", className)}
      style={{
        ...(affix ? { top: offsetTop ?? 0 } : null),
        ...style,
      }}
      {...props}
    >
      {direction === "vertical" ? (
        <>
          <span
            aria-hidden
            data-slot="anchor-rail"
            className="absolute inset-y-1 left-0 w-px rounded-full bg-anchor-rail"
          />
          {showInk && ink && (
            <span
              aria-hidden
              data-slot="anchor-ink"
              className="absolute left-0 w-0.5 rounded-full bg-anchor-ink transition-all duration-200"
              // Inset a touch from the link's box so the segment hugs the text.
              style={{ top: ink.start + 5, height: ink.size - 10 }}
            />
          )}
          <ul className="flex flex-col">
            {items.map((item) => renderItem(item, 0))}
          </ul>
        </>
      ) : (
        <>
          <span
            aria-hidden
            data-slot="anchor-rail"
            className="absolute inset-x-0 bottom-0 h-px rounded-full bg-anchor-rail"
          />
          {showInk && ink && (
            <span
              aria-hidden
              data-slot="anchor-ink"
              className="absolute bottom-0 h-0.5 rounded-full bg-anchor-ink transition-all duration-200"
              // Inset by the link's horizontal padding (px-3) so the underline
              // matches the label, not the whole hit area.
              style={{ left: ink.start + 12, width: ink.size - 24 }}
            />
          )}
          <ul className="flex items-center overflow-x-auto">
            {items.map((item) => renderItem(item, 0))}
          </ul>
        </>
      )}
    </nav>
  )
}

export { Anchor, type AnchorItem, type AnchorProps }

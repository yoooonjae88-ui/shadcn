"use client"

import * as React from "react"
import { Toaster as SonnerPrimitive, toast } from "sonner"

// This registry runs class-based dark mode (`.dark` on <html>, toggled by the
// theme switcher) rather than next-themes, so we detect the active theme here
// and hand it to Sonner. That keeps Sonner's internal light/dark styling in
// sync with the palette without pulling in an extra dependency.
function useResolvedTheme(): "light" | "dark" {
  const [theme, setTheme] = React.useState<"light" | "dark">("light")

  React.useEffect(() => {
    const root = document.documentElement
    const read = () =>
      setTheme(root.classList.contains("dark") ? "dark" : "light")

    read()
    const observer = new MutationObserver(read)
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  return theme
}

type ToasterProps = React.ComponentProps<typeof SonnerPrimitive>

// All colors resolve from theme tokens (shipped via this item's `cssVars` in
// registry.json) so the whole toast palette is restyleable from globals.css:
// `--normal-*` maps to the popover surface, and the rich-color variants map to
// the `--sonner-*` tokens. Never hardcode a color here.
function Toaster({ richColors = true, ...props }: ToasterProps) {
  const theme = useResolvedTheme()

  return (
    <SonnerPrimitive
      theme={theme}
      richColors={richColors}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          // Render the close button (when enabled via `closeButton`) at the
          // top-right corner. Sonner defaults it to the top-left in LTR; these
          // override the built-in position vars so every toast is consistent.
          "--toast-close-button-start": "unset",
          "--toast-close-button-end": "0",
          "--toast-close-button-transform": "translate(35%, -35%)",
          "--success-bg": "var(--sonner-success)",
          "--success-text": "var(--sonner-success-foreground)",
          "--success-border": "var(--sonner-success-border)",
          "--error-bg": "var(--sonner-error)",
          "--error-text": "var(--sonner-error-foreground)",
          "--error-border": "var(--sonner-error-border)",
          "--warning-bg": "var(--sonner-warning)",
          "--warning-text": "var(--sonner-warning-foreground)",
          "--warning-border": "var(--sonner-warning-border)",
          "--info-bg": "var(--sonner-info)",
          "--info-text": "var(--sonner-info-foreground)",
          "--info-border": "var(--sonner-info-border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster, toast }

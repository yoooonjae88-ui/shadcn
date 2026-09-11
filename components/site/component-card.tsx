import Link from "next/link"

import { cardPreviews } from "@/components/previews/examples"

/**
 * A home-page tile for a registry item: the live demo rendered as a static,
 * non-interactive "image" with the item's title underneath.
 *
 * The link is an absolutely-positioned overlay rather than a wrapper — some
 * demos contain their own anchors, and nesting <a> inside <a> is invalid HTML
 * (it breaks hydration).
 */
export function ComponentCard({ name, title }: { name: string; title: string }) {
  const Preview = cardPreviews[name]

  return (
    <div className="group relative flex flex-col gap-2.5">
      <div className="h-52 overflow-hidden rounded-xl border bg-card transition-colors group-hover:border-ring group-has-focus-visible:border-ring">
        <div
          inert
          className="pointer-events-none flex h-full w-full items-center justify-center p-6 select-none"
        >
          {Preview ? (
            // max-h + overflow here means demos taller than the card are
            // cropped from the top (their lead example) rather than an
            // arbitrary center slice, while short demos stay centered.
            <div className="max-h-full w-full overflow-hidden">
              {/* The scale transform also creates a containing block, so
                  demos with fixed-position pieces stay clipped inside. */}
              <div className="flex w-full origin-top scale-[0.85] justify-center">
                <Preview />
              </div>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">No preview</span>
          )}
        </div>
      </div>
      <span className="px-1 text-sm font-medium text-foreground/90 transition-colors group-hover:text-foreground">
        {title}
      </span>
      <Link
        href={`/components/${name}`}
        className="absolute inset-0 z-10 rounded-xl outline-none"
        aria-label={title}
      />
    </div>
  )
}

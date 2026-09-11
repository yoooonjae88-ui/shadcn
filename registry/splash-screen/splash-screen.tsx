"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// The splash moves through these phases (their order depends on `sequence`),
// then unmounts:
// - foreground: the two-image layer fades from opaque to clear.
// - blink:      the centered dot blinks in place.
// - expand:     the dot stretches vertically into a line that reaches both edges.
// - done:       the whole splash is removed, revealing the site underneath.
type SplashPhase = "foreground" | "blink" | "expand" | "done"

// How the image fade and the dot animation are ordered:
// - "images-first": images fade out, then the dot blinks + expands (the default).
// - "together":     both play at once and finish together, dot behind the images.
// - "dot-first":    the dot blinks + expands, then the images fade out.
type SplashSequence = "images-first" | "together" | "dot-first"

interface SplashScreenProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /**
   * Foreground layer content — the two images that fade out first. Falls back
   * to two placeholder tiles when omitted.
   */
  images?: React.ReactNode
  /**
   * Play the splash only once per browser tab. Uses sessionStorage, so a new
   * tab replays it while a reload within the same tab does not. Defaults to true.
   */
  once?: boolean
  /** sessionStorage key used to remember the splash has played (when `once`). */
  storageKey?: string
  /**
   * Cover the nearest positioned ancestor (absolute) instead of the whole
   * viewport (fixed). Handy for demos and section-scoped intros. Defaults to false.
   */
  contained?: boolean
  /**
   * Orders the image fade against the dot animation. "images-first" (default)
   * fades the images out and then plays the dot. "together" plays both at once,
   * finishing at the same instant. "dot-first" plays the dot (blink + expand)
   * and then fades the images out. In "together" and "dot-first" the dot-and-line
   * layer sits *behind* the images and the foreground paints no background (so the
   * dot shows through the gaps), leaving layout to the `images` slot.
   */
  sequence?: SplashSequence
  /**
   * How long the images take to fade out, in ms. In "together" the fade is
   * derived from blink + expand and this value is ignored. Defaults to 1500.
   */
  foregroundDuration?: number
  /** Total time the dot spends blinking, in ms. Defaults to 1000. */
  blinkDuration?: number
  /** Number of blinks packed into `blinkDuration`. Defaults to 3. */
  blinkCount?: number
  /** How long the dot takes to expand to the edges, in ms. Defaults to 500. */
  expandDuration?: number
  /** Dot diameter — and the width of the expanded line — in px. Defaults to 12. */
  dotSize?: number
  /** Called once the splash has finished playing (not when skipped as already-seen). */
  onDone?: () => void
}

// Two neutral placeholder tiles standing in for the caller's images.
function SplashPlaceholderImages() {
  return (
    <>
      <div className="size-24 rounded-2xl bg-splash-mark/10 sm:size-28" />
      <div className="size-24 rounded-2xl bg-splash-mark/10 sm:size-28" />
    </>
  )
}

function SplashScreen({
  images,
  once = true,
  storageKey = "splash-screen-seen",
  contained = false,
  sequence = "images-first",
  foregroundDuration = 1500,
  blinkDuration = 1000,
  blinkCount = 3,
  expandDuration = 500,
  dotSize = 12,
  onDone,
  className,
  style,
  ...props
}: SplashScreenProps) {
  // Start as `null` so the server render and the first client render agree
  // (nothing is painted); the effect below decides what to play once mounted.
  const [phase, setPhase] = React.useState<SplashPhase | null>(null)

  // Keep the latest onDone without making it a dependency of the timing effect,
  // so passing an inline callback doesn't restart the sequence.
  const onDoneRef = React.useRef(onDone)
  React.useEffect(() => {
    onDoneRef.current = onDone
  })

  React.useEffect(() => {
    if (once) {
      try {
        if (sessionStorage.getItem(storageKey)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time gate read from sessionStorage, a client-only external store
          setPhase("done")
          return
        }
      } catch {
        // sessionStorage unavailable (private mode / SSR guard) — just play it.
      }
    }

    const markSeen = () => {
      if (!once) return
      try {
        sessionStorage.setItem(storageKey, "1")
      } catch {
        // ignore write failures; worst case the splash replays.
      }
    }

    const finish = () => {
      markSeen()
      setPhase("done")
      onDoneRef.current?.()
    }

    // Respect users who prefer reduced motion: skip straight to the site.
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) {
      finish()
      return
    }

    let timers: ReturnType<typeof setTimeout>[]
    if (sequence === "together") {
      // Both layers play at once; the foreground fades across the dot's
      // blink + expand time so they reach their end at the same instant.
      setPhase("blink")
      timers = [
        setTimeout(() => setPhase("expand"), blinkDuration),
        setTimeout(finish, blinkDuration + expandDuration),
      ]
    } else if (sequence === "dot-first") {
      // Dot blinks + expands, the dot-and-line layer is dropped, then the
      // images fade out to reveal the site.
      setPhase("blink")
      timers = [
        setTimeout(() => setPhase("expand"), blinkDuration),
        setTimeout(() => setPhase("foreground"), blinkDuration + expandDuration),
        setTimeout(finish, blinkDuration + expandDuration + foregroundDuration),
      ]
    } else {
      // images-first: images fade out, then the dot blinks + expands.
      setPhase("foreground")
      timers = [
        setTimeout(() => setPhase("blink"), foregroundDuration),
        setTimeout(() => setPhase("expand"), foregroundDuration + blinkDuration),
        setTimeout(finish, foregroundDuration + blinkDuration + expandDuration),
      ]
    }
    return () => timers.forEach(clearTimeout)
  }, [
    once,
    storageKey,
    sequence,
    foregroundDuration,
    blinkDuration,
    expandDuration,
  ])

  if (phase === null || phase === "done") return null

  const isImagesFirst = sequence === "images-first"

  // The dot-and-line layer stays up the whole time except in "dot-first", where
  // it is dropped once the line is drawn so the following image fade reveals the
  // site (its background matches the page, so removing it is seamless).
  const showDotLayer = isImagesFirst
    ? true
    : sequence === "together"
      ? true
      : phase === "blink" || phase === "expand"

  // Foreground visibility per sequence: only during its own phase in
  // "images-first"; throughout in "together" and "dot-first".
  const showForeground = isImagesFirst
    ? phase === "foreground"
    : true

  // The foreground only animates its fade during the "foreground" phase; in
  // "together" it fades across blink + expand instead.
  const foregroundFading =
    sequence === "together" || phase === "foreground"
  const foregroundFade =
    sequence === "together" ? blinkDuration + expandDuration : foregroundDuration

  return (
    <div
      data-slot="splash-screen"
      data-phase={phase}
      aria-hidden="true"
      className={cn(
        "inset-0 z-50 overflow-hidden",
        contained ? "absolute" : "fixed",
        className
      )}
      style={style}
      {...props}
    >
      {/* Scoped keyframes travel with the component so it stays self-contained. */}
      <style>{splashKeyframes}</style>

      {/* Dot-and-line layer (behind the foreground). Its opaque background
          covers the site until the layer itself is removed. Keyed so the
          foreground element below stays mounted when this layer is dropped. */}
      {showDotLayer && (
        <div
          key="dot-layer"
          data-slot="splash-dot-layer"
          className="absolute inset-0 flex items-center justify-center bg-splash-background"
        >
          <div
            data-slot="splash-dot"
            className="bg-splash-mark"
            style={{
              width: dotSize,
              height: phase === "expand" ? "100%" : dotSize,
              borderRadius: dotSize,
              transition: `height ${expandDuration}ms ease-in`,
              animation:
                phase === "blink"
                  ? `splash-screen-blink ${blinkDuration / blinkCount}ms ease-in-out ${blinkCount}`
                  : undefined,
            }}
          />
        </div>
      )}

      {/* Foreground layer (frontmost). It fades to clear, then unmounts to
          reveal what's beneath. In "images-first" it paints a full backdrop and
          centres the placeholder tiles; in "together"/"dot-first" it paints no
          background and leaves layout to the `images` slot, so the dot shows
          through the gaps. */}
      {showForeground && (
        <div
          key="foreground"
          data-slot="splash-foreground"
          className={cn(
            "absolute inset-0",
            isImagesFirst &&
              "flex items-center justify-center gap-8 bg-splash-foreground"
          )}
          style={{
            animation: foregroundFading
              ? `splash-screen-fade ${foregroundFade}ms ease-in forwards`
              : undefined,
          }}
        >
          {images ?? <SplashPlaceholderImages />}
        </div>
      )}
    </div>
  )
}

const splashKeyframes = `
@keyframes splash-screen-fade {
  from { opacity: 1; }
  to { opacity: 0; }
}
@keyframes splash-screen-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
`

export { SplashScreen, type SplashScreenProps, type SplashSequence }

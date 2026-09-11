"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { SplashScreen } from "@/registry/splash-screen/splash-screen"

// Stand-ins for the two real images. Colours resolve from theme tokens so the
// panels restyle with the palette — no hardcoded colours here.
//
// Layout (widths are % of the splash width, so they scale to the viewport):
//   • Image A sits flush to the bottom-left and is 45% wide.
//   • Image B sits flush to the bottom-right and is 60% wide.
//   • 45% + 60% = 105%, so A overlaps B by 5%; A renders last to sit on top.
function ImageA() {
  return (
    <div className="absolute bottom-0 left-0 flex h-[55%] w-[45%] items-center justify-center bg-primary text-lg font-semibold text-primary-foreground">
      Image A
    </div>
  )
}

function ImageB() {
  return (
    <div className="absolute right-0 bottom-0 flex h-[72%] w-[60%] items-center justify-center bg-accent text-lg font-semibold text-accent-foreground">
      Image B
    </div>
  )
}

export function SplashScreenImagesExample() {
  // `key` remounts the splash so it replays; `once={false}` and `contained`
  // keep it scoped to this preview box instead of the whole viewport.
  const [runId, setRunId] = React.useState(0)

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted/40">
        <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
          Your website content lives here.
        </div>
        <SplashScreen
          key={runId}
          once={false}
          contained
          // The dot-and-line layer animates first (dot blinks 1.5s, line draws
          // over 0.5s), then images A and B fade out over 1s to reveal the site.
          sequence="dot-first"
          blinkDuration={1500}
          expandDuration={500}
          foregroundDuration={1000}
          images={
            <>
              {/* B first, so A overlaps it on the left. */}
              <ImageB />
              <ImageA />
            </>
          }
        />
      </div>

      <Button size="sm" variant="outline" onClick={() => setRunId((n) => n + 1)}>
        Replay
      </Button>
    </div>
  )
}

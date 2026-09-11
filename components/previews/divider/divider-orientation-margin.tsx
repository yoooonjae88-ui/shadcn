"use client"

import { Divider } from "@/registry/divider/divider"

export function DividerOrientationMarginExample() {
  return (
    <div className="w-full max-w-xl text-sm">
      <Divider orientation="start" orientationMargin={0}>
        Start, margin 0
      </Divider>
      <Divider orientation="end" orientationMargin={48}>
        End, margin 48px
      </Divider>
    </div>
  )
}

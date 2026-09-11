"use client"

import { Rating } from "@/registry/rating/rating"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-28 shrink-0 text-sm text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

export function RatingSizesExample() {
  return (
    <div className="flex flex-col gap-3">
      <Row label="Small">
        <Rating rating={4} size="sm" />
      </Row>
      <Row label="Default">
        <Rating rating={4} size="default" />
      </Row>
      <Row label="Large">
        <Rating rating={4} size="lg" />
      </Row>
    </div>
  )
}

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

export function RatingReadOnlyExample() {
  return (
    <div className="flex flex-col gap-3">
      <Row label="Read-only">
        <Rating rating={4} editable readOnly />
      </Row>
      <Row label="Disabled">
        <Rating rating={3} editable disabled />
      </Row>
    </div>
  )
}

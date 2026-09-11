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

// Read-only display with whole, decimal and half fills.
export function RatingDisplayExample() {
  return (
    <div className="flex flex-col gap-3">
      <Row label="5.0">
        <Rating rating={5} />
      </Row>
      <Row label="3.7 (decimal)">
        <Rating rating={3.7} allowHalf showValue />
      </Row>
      <Row label="2.5 (half)">
        <Rating rating={2.5} allowHalf showValue />
      </Row>
      <Row label="Custom max (10)">
        <Rating rating={7} maxRating={10} size="sm" />
      </Row>
    </div>
  )
}

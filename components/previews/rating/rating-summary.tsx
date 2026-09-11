"use client"

import { Rating } from "@/registry/rating/rating"

const distribution = [
  { stars: 5, count: 124, percentage: 62 },
  { stars: 4, count: 45, percentage: 22 },
  { stars: 3, count: 18, percentage: 9 },
  { stars: 2, count: 8, percentage: 4 },
  { stars: 1, count: 5, percentage: 3 },
]

// An average score with a per-star distribution breakdown.
export function RatingSummaryExample() {
  return (
    <div className="w-full max-w-xs space-y-4">
      <div className="flex flex-col items-center gap-2">
        <span className="text-3xl font-semibold">4.6</span>
        <Rating rating={4.6} size="sm" allowHalf />
        <span className="text-xs text-muted-foreground">Based on 200 reviews</span>
      </div>
      <div className="space-y-2">
        {distribution.map((row) => (
          <div key={row.stars} className="flex items-center gap-3 text-sm">
            <span className="w-3 text-right text-xs text-muted-foreground">
              {row.stars}
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-rating-filled"
                style={{ width: `${row.percentage}%` }}
              />
            </div>
            <span className="w-7 text-right text-xs text-muted-foreground">
              {row.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

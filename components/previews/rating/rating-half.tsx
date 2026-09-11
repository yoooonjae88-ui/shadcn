"use client"

import * as React from "react"

import { Rating } from "@/registry/rating/rating"

// Clicking the left half of an icon picks a .5 value.
export function RatingHalfExample() {
  const [rating, setRating] = React.useState(3.5)
  return (
    <div className="flex flex-col gap-3">
      <Rating rating={rating} onRatingChange={setRating} editable allowHalf size="lg" />
      <p className="text-sm text-muted-foreground">
        Your rating:{" "}
        <span className="font-semibold text-foreground">{rating.toFixed(1)}</span> / 5
      </p>
    </div>
  )
}

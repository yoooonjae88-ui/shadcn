"use client"

import * as React from "react"

import { Rating } from "@/registry/rating/rating"

// Editable star rating with a live value readout.
export function RatingEditableExample() {
  const [rating, setRating] = React.useState(3)
  return (
    <div className="flex flex-col gap-3">
      <Rating rating={rating} onRatingChange={setRating} editable showValue />
      <p className="text-sm text-muted-foreground">
        Your rating:{" "}
        <span className="font-semibold text-foreground">{rating.toFixed(1)}</span> / 5
      </p>
    </div>
  )
}

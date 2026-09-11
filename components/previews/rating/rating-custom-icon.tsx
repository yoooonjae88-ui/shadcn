"use client"

import * as React from "react"
import { Heart } from "lucide-react"

import { Rating } from "@/registry/rating/rating"

// Swap in any lucide icon — hearts instead of stars.
export function RatingCustomIconExample() {
  const [rating, setRating] = React.useState(2)
  return <Rating rating={rating} onRatingChange={setRating} editable icon={Heart} />
}

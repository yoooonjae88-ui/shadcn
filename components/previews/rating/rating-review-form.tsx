"use client"

import * as React from "react"

import { Button } from "@/registry/button/button"
import { Rating } from "@/registry/rating/rating"

// A full review form combining an editable rating and a text area.
export function RatingReviewFormExample() {
  const [rating, setRating] = React.useState(0)
  const [review, setReview] = React.useState("")
  return (
    <div className="w-full max-w-xs space-y-5 rounded-xl bg-card p-5 text-card-foreground shadow-xs">
      <div className="flex flex-col items-center gap-3">
        <h4 className="text-sm font-semibold">Write a Review</h4>
        <Rating rating={rating} onRatingChange={setRating} editable size="lg" />
        <p className="h-4 text-xs text-muted-foreground">
          {rating === 0
            ? " "
            : rating <= 2
              ? "We're sorry to hear that"
              : rating <= 3
                ? "Thanks for your feedback"
                : "Glad you enjoyed it!"}
        </p>
      </div>
      <div className="space-y-2">
        <label htmlFor="rating-review-text" className="text-sm">
          Your review
        </label>
        <textarea
          id="rating-review-text"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Tell us what you think..."
          rows={3}
          className="w-full resize-none rounded-md bg-input-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <Button disabled={rating === 0} size="sm" className="w-full">
        Submit Review
      </Button>
    </div>
  )
}

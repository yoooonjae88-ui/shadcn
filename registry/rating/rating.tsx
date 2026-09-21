"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

const ratingDefaults = {
  size: "default",
} as const

const ratingVariants = cva("flex items-center", {
  variants: {
    size: {
      sm: "gap-2",
      default: "gap-2.5",
      lg: "gap-3",
    },
  },
  defaultVariants: ratingDefaults,
})

const starDefaults = {
  size: "default",
} as const

const starVariants = cva("shrink-0", {
  variants: {
    size: {
      sm: "size-4",
      default: "size-5",
      lg: "size-6",
    },
  },
  defaultVariants: starDefaults,
})

const valueDefaults = {
  size: "default",
} as const

const valueVariants = cva("text-muted-foreground tabular-nums", {
  variants: {
    size: {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: valueDefaults,
})

type RatingSize = NonNullable<VariantProps<typeof ratingVariants>["size"]>

type RatingIcon = React.ComponentType<{ className?: string }>

interface RatingProps
  extends Omit<React.ComponentProps<"div">, "onChange">,
    VariantProps<typeof ratingVariants> {
  /** Current rating value. Supports decimals for partial fills (e.g. 3.7). */
  rating: number
  /** Number of icons to render. */
  maxRating?: number
  /** Render a numeric readout of the current value next to the icons. */
  showValue?: boolean
  /** Extra classes for each icon. */
  starClassName?: string
  /** Extra classes for the numeric readout. */
  valueClassName?: string
  /** Allow the user to hover and click to change the rating. */
  editable?: boolean
  /**
   * When editable, let the user pick half values by clicking the left half of
   * an icon. Also renders precise half fills for display-only ratings.
   */
  allowHalf?: boolean
  /** Non-interactive even if `editable` — makes read-only intent explicit. */
  readOnly?: boolean
  /** Dim the control and block interaction. */
  disabled?: boolean
  /** Swap the default star for any icon component (e.g. Heart). */
  icon?: RatingIcon
  /** Fired with the new value when the user picks a rating. */
  onRatingChange?: (rating: number) => void
}

function Rating({
  rating,
  maxRating = 5,
  size,
  className,
  starClassName,
  valueClassName,
  showValue = false,
  editable = false,
  allowHalf = false,
  readOnly = false,
  disabled = false,
  icon: Icon = Star,
  onRatingChange,
  ...props
}: RatingProps) {
  const interactive = editable && !readOnly && !disabled
  const [hoveredRating, setHoveredRating] = React.useState<number | null>(null)
  const step = allowHalf ? 0.5 : 1

  const displayRating =
    interactive && hoveredRating !== null ? hoveredRating : rating

  const commit = (next: number) => {
    if (interactive) {
      onRatingChange?.(Math.min(Math.max(next, 0), maxRating))
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return
    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        event.preventDefault()
        commit(Math.min(rating + step, maxRating))
        break
      case "ArrowLeft":
      case "ArrowDown":
        event.preventDefault()
        commit(Math.max(rating - step, 0))
        break
      case "Home":
        event.preventDefault()
        commit(0)
        break
      case "End":
        event.preventDefault()
        commit(maxRating)
        break
    }
  }

  const stars = Array.from({ length: maxRating }, (_, index) => {
    const starValue = index + 1
    const fillPercentage = Math.min(
      Math.max((displayRating - index) * 100, 0),
      100
    )

    return (
      <div key={starValue} className="relative">
        <Icon
          data-slot="rating-star-empty"
          className={cn(starVariants({ size }), "text-rating-empty", starClassName)}
        />
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ width: `${fillPercentage}%` }}
        >
          <Icon
            data-slot="rating-star-filled"
            className={cn(
              starVariants({ size }),
              "fill-rating-filled text-rating-filled",
              starClassName
            )}
          />
        </div>

        {interactive && (
          <div className="absolute inset-0 flex">
            {allowHalf && (
              <button
                type="button"
                aria-label={`Rate ${starValue - 0.5} out of ${maxRating}`}
                className="h-full w-1/2 cursor-pointer"
                onMouseEnter={() => setHoveredRating(starValue - 0.5)}
                onClick={() => commit(starValue - 0.5)}
              />
            )}
            <button
              type="button"
              aria-label={`Rate ${starValue} out of ${maxRating}`}
              className={cn("h-full cursor-pointer", allowHalf ? "w-1/2" : "w-full")}
              onMouseEnter={() => setHoveredRating(starValue)}
              onClick={() => commit(starValue)}
            />
          </div>
        )}
      </div>
    )
  })

  return (
    <div
      data-slot="rating"
      role={interactive ? "slider" : "img"}
      aria-label={`Rating: ${rating} out of ${maxRating}`}
      aria-valuenow={interactive ? rating : undefined}
      aria-valuemin={interactive ? 0 : undefined}
      aria-valuemax={interactive ? maxRating : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={handleKeyDown}
      className={cn(
        ratingVariants({ size }),
        interactive && "outline-none focus-visible:ring-3 focus-visible:ring-ring/50 rounded-md",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      {...props}
    >
      <div
        className="flex items-center"
        style={{ gap: "inherit" }}
        onMouseLeave={() => interactive && setHoveredRating(null)}
      >
        {stars}
      </div>
      {showValue && (
        <span
          data-slot="rating-value"
          className={cn(valueVariants({ size }), valueClassName)}
        >
          {displayRating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

export { Rating, ratingVariants, starVariants }
export type { RatingProps, RatingSize, RatingIcon }

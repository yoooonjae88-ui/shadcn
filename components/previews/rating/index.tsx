import type { PreviewExample } from "@/components/previews/types"
import { RatingCustomIconExample } from "./rating-custom-icon"
import { RatingDisplayExample } from "./rating-display"
import { RatingEditableExample } from "./rating-editable"
import { RatingHalfExample } from "./rating-half"
import { RatingReadOnlyExample } from "./rating-read-only"
import { RatingReviewFormExample } from "./rating-review-form"
import { RatingSizesExample } from "./rating-sizes"
import { RatingSummaryExample } from "./rating-summary"

export const ratingExamples: PreviewExample[] = [
  {
    name: "display",
    title: "Display & partial fills",
    component: RatingDisplayExample,
    file: "components/previews/rating/rating-display.tsx",
  },
  {
    name: "sizes",
    title: "Sizes",
    component: RatingSizesExample,
    file: "components/previews/rating/rating-sizes.tsx",
  },
  {
    name: "editable",
    title: "Editable",
    component: RatingEditableExample,
    file: "components/previews/rating/rating-editable.tsx",
  },
  {
    name: "half",
    title: "Half stars",
    component: RatingHalfExample,
    file: "components/previews/rating/rating-half.tsx",
  },
  {
    name: "custom-icon",
    title: "Custom icon",
    component: RatingCustomIconExample,
    file: "components/previews/rating/rating-custom-icon.tsx",
  },
  {
    name: "read-only",
    title: "Read-only & disabled",
    component: RatingReadOnlyExample,
    file: "components/previews/rating/rating-read-only.tsx",
  },
  {
    name: "summary",
    title: "Review summary",
    component: RatingSummaryExample,
    file: "components/previews/rating/rating-summary.tsx",
  },
  {
    name: "review-form",
    title: "Review form",
    component: RatingReviewFormExample,
    file: "components/previews/rating/rating-review-form.tsx",
  },
]

import type { PreviewExample } from "@/components/previews/types"
import { SliderBasicExample } from "./slider-basic"
import { SliderDisabledExample } from "./slider-disabled"
import { SliderInputExample } from "./slider-input"
import { SliderMarksExample } from "./slider-marks"
import { SliderMultipleExample } from "./slider-multiple"
import { SliderRangeExample } from "./slider-range"
import { SliderRatingExample } from "./slider-rating"
import { SliderSizesExample } from "./slider-sizes"
import { SliderStepsExample } from "./slider-steps"
import { SliderTemperatureExample } from "./slider-temperature"
import { SliderTooltipExample } from "./slider-tooltip"
import { SliderValueExample } from "./slider-value"
import { SliderVerticalExample } from "./slider-vertical"

export const sliderExamples: PreviewExample[] = [
  {
    name: "basic",
    title: "Basic",
    component: SliderBasicExample,
    file: "components/previews/slider/slider-basic.tsx",
  },
  {
    name: "range",
    title: "Range",
    component: SliderRangeExample,
    file: "components/previews/slider/slider-range.tsx",
  },
  {
    name: "multiple",
    title: "Multiple thumbs",
    component: SliderMultipleExample,
    file: "components/previews/slider/slider-multiple.tsx",
  },
  {
    name: "steps",
    title: "Steps with marks",
    component: SliderStepsExample,
    file: "components/previews/slider/slider-steps.tsx",
  },
  {
    name: "sizes",
    title: "Sizes",
    component: SliderSizesExample,
    file: "components/previews/slider/slider-sizes.tsx",
  },
  {
    name: "disabled",
    title: "Disabled",
    component: SliderDisabledExample,
    file: "components/previews/slider/slider-disabled.tsx",
  },
  {
    name: "tooltip",
    title: "With tooltip",
    component: SliderTooltipExample,
    file: "components/previews/slider/slider-tooltip.tsx",
  },
  {
    name: "marks",
    title: "Reference labels",
    component: SliderMarksExample,
    file: "components/previews/slider/slider-marks.tsx",
  },
  {
    name: "vertical",
    title: "Vertical",
    component: SliderVerticalExample,
    file: "components/previews/slider/slider-vertical.tsx",
  },
  {
    name: "value",
    title: "With value readout",
    component: SliderValueExample,
    file: "components/previews/slider/slider-value.tsx",
  },
  {
    name: "input",
    title: "Synced with input",
    component: SliderInputExample,
    file: "components/previews/slider/slider-input.tsx",
  },
  {
    name: "temperature",
    title: "Color temperature",
    component: SliderTemperatureExample,
    file: "components/previews/slider/slider-temperature.tsx",
  },
  {
    name: "rating",
    title: "Rating",
    component: SliderRatingExample,
    file: "components/previews/slider/slider-rating.tsx",
  },
]

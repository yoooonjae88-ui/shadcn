import type { PreviewExample } from "@/components/previews/types"
import { TimePicker12HourExample } from "./time-picker-12-hour"
import { TimePickerBasicExample } from "./time-picker-basic"
import { TimePickerDisabledTimeExample } from "./time-picker-disabled-time"
import { TimePickerFormatExample } from "./time-picker-format"
import { TimePickerPrefixSuffixExample } from "./time-picker-prefix-suffix"
import { TimePickerRangeExample } from "./time-picker-range"
import { TimePickerScrollExample } from "./time-picker-scroll"
import { TimePickerSizesExample } from "./time-picker-sizes"
import { TimePickerStatusExample } from "./time-picker-status"
import { TimePickerStepsExample } from "./time-picker-steps"
import { TimePickerVariantsExample } from "./time-picker-variants"

export const timePickerExamples: PreviewExample[] = [
  {
    name: "basic",
    title: "Basic",
    component: TimePickerBasicExample,
    file: "components/previews/time-picker/time-picker-basic.tsx",
  },
  {
    name: "12-hour",
    title: "12 hours",
    component: TimePicker12HourExample,
    file: "components/previews/time-picker/time-picker-12-hour.tsx",
  },
  {
    name: "format",
    title: "Format",
    component: TimePickerFormatExample,
    file: "components/previews/time-picker/time-picker-format.tsx",
  },
  {
    name: "steps",
    title: "Interval steps",
    component: TimePickerStepsExample,
    file: "components/previews/time-picker/time-picker-steps.tsx",
  },
  {
    name: "disabled-time",
    title: "Disabled time",
    component: TimePickerDisabledTimeExample,
    file: "components/previews/time-picker/time-picker-disabled-time.tsx",
  },
  {
    name: "scroll",
    title: "Change on scroll",
    component: TimePickerScrollExample,
    file: "components/previews/time-picker/time-picker-scroll.tsx",
  },
  {
    name: "sizes",
    title: "Sizes",
    component: TimePickerSizesExample,
    file: "components/previews/time-picker/time-picker-sizes.tsx",
  },
  {
    name: "variants",
    title: "Variants",
    component: TimePickerVariantsExample,
    file: "components/previews/time-picker/time-picker-variants.tsx",
  },
  {
    name: "status",
    title: "Status",
    component: TimePickerStatusExample,
    file: "components/previews/time-picker/time-picker-status.tsx",
  },
  {
    name: "prefix-suffix",
    title: "Prefix & suffix icon",
    component: TimePickerPrefixSuffixExample,
    file: "components/previews/time-picker/time-picker-prefix-suffix.tsx",
  },
  {
    name: "range",
    title: "Range",
    component: TimePickerRangeExample,
    file: "components/previews/time-picker/time-picker-range.tsx",
  },
]

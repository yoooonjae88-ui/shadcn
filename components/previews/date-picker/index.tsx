import type { PreviewExample } from "@/components/previews/types"
import { DatePickerBasicExample } from "./date-picker-basic"
import { DatePickerDisabledExample } from "./date-picker-disabled"
import { DatePickerDisabledDatesExample } from "./date-picker-disabled-dates"
import { DatePickerDropdownExample } from "./date-picker-dropdown"
import { DatePickerFormatExample } from "./date-picker-format"
import { DatePickerLocaleExample } from "./date-picker-locale"
import { DatePickerPrefixSuffixExample } from "./date-picker-prefix-suffix"
import { DatePickerPresetsExample } from "./date-picker-presets"
import { DatePickerRangeExample } from "./date-picker-range"
import { DatePickerRangePresetsExample } from "./date-picker-range-presets"
import { DatePickerSizesExample } from "./date-picker-sizes"
import { DatePickerStatusExample } from "./date-picker-status"
import { DatePickerVariantsExample } from "./date-picker-variants"
import { DatePickerWeekNumbersExample } from "./date-picker-week-numbers"

export const datePickerExamples: PreviewExample[] = [
  {
    name: "basic",
    title: "Basic",
    component: DatePickerBasicExample,
    file: "components/previews/date-picker/date-picker-basic.tsx",
  },
  {
    name: "range",
    title: "Range",
    component: DatePickerRangeExample,
    file: "components/previews/date-picker/date-picker-range.tsx",
  },
  {
    name: "format",
    title: "Format",
    component: DatePickerFormatExample,
    file: "components/previews/date-picker/date-picker-format.tsx",
  },
  {
    name: "locale",
    title: "Locale",
    component: DatePickerLocaleExample,
    file: "components/previews/date-picker/date-picker-locale.tsx",
  },
  {
    name: "presets",
    title: "Presets",
    component: DatePickerPresetsExample,
    file: "components/previews/date-picker/date-picker-presets.tsx",
  },
  {
    name: "range-presets",
    title: "Range presets",
    component: DatePickerRangePresetsExample,
    file: "components/previews/date-picker/date-picker-range-presets.tsx",
  },
  {
    name: "disabled-dates",
    title: "Disabled dates",
    component: DatePickerDisabledDatesExample,
    file: "components/previews/date-picker/date-picker-disabled-dates.tsx",
  },
  {
    name: "dropdown",
    title: "Month & year dropdowns",
    component: DatePickerDropdownExample,
    file: "components/previews/date-picker/date-picker-dropdown.tsx",
  },
  {
    name: "week-numbers",
    title: "Week numbers & multiple months",
    component: DatePickerWeekNumbersExample,
    file: "components/previews/date-picker/date-picker-week-numbers.tsx",
  },
  {
    name: "sizes",
    title: "Sizes",
    component: DatePickerSizesExample,
    file: "components/previews/date-picker/date-picker-sizes.tsx",
  },
  {
    name: "variants",
    title: "Variants",
    component: DatePickerVariantsExample,
    file: "components/previews/date-picker/date-picker-variants.tsx",
  },
  {
    name: "status",
    title: "Status",
    component: DatePickerStatusExample,
    file: "components/previews/date-picker/date-picker-status.tsx",
  },
  {
    name: "prefix-suffix",
    title: "Prefix & suffix icon",
    component: DatePickerPrefixSuffixExample,
    file: "components/previews/date-picker/date-picker-prefix-suffix.tsx",
  },
  {
    name: "disabled",
    title: "Disabled & read-only",
    component: DatePickerDisabledExample,
    file: "components/previews/date-picker/date-picker-disabled.tsx",
  },
]

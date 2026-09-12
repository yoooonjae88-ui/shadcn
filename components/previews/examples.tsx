import type * as React from "react"

import { previews } from "@/components/previews"
import type { PreviewExample } from "@/components/previews/types"

import { accordionExamples } from "@/components/previews/accordion"
import { alertExamples } from "@/components/previews/alert"
import { alertDialogExamples } from "@/components/previews/alert-dialog"
import { anchorExamples } from "@/components/previews/anchor"
import { aspectRatioExamples } from "@/components/previews/aspect-ratio"
import { avatarExamples } from "@/components/previews/avatar"
import { badgeExamples } from "@/components/previews/badge"
import { breadcrumbExamples } from "@/components/previews/breadcrumb"
import { buttonExamples } from "@/components/previews/button"
import { calendarExamples } from "@/components/previews/calendar"
import { calendarViewExamples } from "@/components/previews/calendar-view"
import { cardExamples } from "@/components/previews/card"
import { carouselExamples } from "@/components/previews/carousel"
import { chatBubbleExamples } from "@/components/previews/chat-bubble"
import { checkboxExamples } from "@/components/previews/checkbox"
import { comboboxExamples } from "@/components/previews/combobox"
import { datePickerExamples } from "@/components/previews/date-picker"
import { dividerExamples } from "@/components/previews/divider"
import { drawerExamples } from "@/components/previews/drawer"
import { dropdownExamples } from "@/components/previews/dropdown"
import { emptyExamples } from "@/components/previews/empty"
import { fieldExamples } from "@/components/previews/field"
import { fileUploadExamples } from "@/components/previews/file-upload"
import { inputExamples } from "@/components/previews/input"
import { inputGroupExamples } from "@/components/previews/input-group"
import { masonryExamples } from "@/components/previews/masonry"
import { mentionExamples } from "@/components/previews/mention"
import { paginationExamples } from "@/components/previews/pagination"
import { popoverExamples } from "@/components/previews/popover"
import { progressExamples } from "@/components/previews/progress"
import { radioGroupExamples } from "@/components/previews/radio-group"
import { ratingExamples } from "@/components/previews/rating"
import { segmentedExamples } from "@/components/previews/segmented"
import { spaceExamples } from "@/components/previews/space"
import { sliderExamples } from "@/components/previews/slider"
import { splashScreenExamples } from "@/components/previews/splash-screen"
import { splitterExamples } from "@/components/previews/splitter"
import { stepsExamples } from "@/components/previews/steps"
import { switchExamples } from "@/components/previews/switch"
import { tabsExamples } from "@/components/previews/tabs"
import { tagExamples } from "@/components/previews/tag"
import { timePickerExamples } from "@/components/previews/time-picker"
import { timelineExamples } from "@/components/previews/timeline"
import { tooltipExamples } from "@/components/previews/tooltip"
import { treeExamples } from "@/components/previews/tree"
import { typographyExamples } from "@/components/previews/typography"

export type { PreviewExample }

// Items split into dedicated per-example files, each registered by its
// `components/previews/<name>/index.tsx`. Items not listed here fall back to
// their single `<name>-demo.tsx` preview below. To split an item, create
// self-contained files under `components/previews/<name>/` and export the
// list from that folder's index (see avatar for the pattern).
const exampleOverrides: Record<string, PreviewExample[]> = {
  accordion: accordionExamples,
  alert: alertExamples,
  "alert-dialog": alertDialogExamples,
  anchor: anchorExamples,
  "aspect-ratio": aspectRatioExamples,
  avatar: avatarExamples,
  badge: badgeExamples,
  breadcrumb: breadcrumbExamples,
  button: buttonExamples,
  calendar: calendarExamples,
  "calendar-view": calendarViewExamples,
  card: cardExamples,
  carousel: carouselExamples,
  "chat-bubble": chatBubbleExamples,
  checkbox: checkboxExamples,
  combobox: comboboxExamples,
  "date-picker": datePickerExamples,
  divider: dividerExamples,
  drawer: drawerExamples,
  dropdown: dropdownExamples,
  empty: emptyExamples,
  field: fieldExamples,
  "file-upload": fileUploadExamples,
  input: inputExamples,
  "input-group": inputGroupExamples,
  masonry: masonryExamples,
  mention: mentionExamples,
  pagination: paginationExamples,
  popover: popoverExamples,
  progress: progressExamples,
  "radio-group": radioGroupExamples,
  rating: ratingExamples,
  segmented: segmentedExamples,
  slider: sliderExamples,
  space: spaceExamples,
  "splash-screen": splashScreenExamples,
  splitter: splitterExamples,
  steps: stepsExamples,
  switch: switchExamples,
  tabs: tabsExamples,
  tag: tagExamples,
  "time-picker": timePickerExamples,
  timeline: timelineExamples,
  tooltip: tooltipExamples,
  tree: treeExamples,
  typography: typographyExamples,
}

/** The examples shown on `/components/<item>`, in display order. */
export function examplesFor(itemName: string): PreviewExample[] {
  const override = exampleOverrides[itemName]
  if (override) return override

  const Demo = previews[itemName]
  if (!Demo) return []

  return [
    {
      name: "preview",
      title: "Preview",
      component: Demo,
      file: `components/previews/${itemName}-demo.tsx`,
    },
  ]
}

// The demo rendered inside an item's card on the home page. Items split into
// per-example files lead with their first example, which makes a cleaner card
// image than the full kitchen-sink demo.
export const cardPreviews: Record<string, React.ComponentType> = {
  ...previews,
  ...Object.fromEntries(
    Object.entries(exampleOverrides)
      .filter(([, examples]) => examples.length > 0)
      .map(([item, examples]) => [item, examples[0].component])
  ),
}

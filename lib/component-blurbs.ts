// Short, non-technical "what would I use this for" phrases, one per registry
// item. They're composed into the one-line description shown on
// /components/<name> — the full technical description stays in registry.json
// for CLI consumers. Keep each phrase lowercase and around three use cases.
const useCases: Record<string, string> = {
  accordion: "FAQs and collapsible content sections",
  alert: "inline messages and status callouts",
  "alert-dialog": "confirmations and destructive-action prompts",
  anchor: "table-of-contents navigation on long pages",
  "aspect-ratio": "locking images, video, and embeds to a fixed shape",
  avatar: "profile pictures, presence indicators, and team lists",
  badge: "counts, statuses, and notification dots",
  breadcrumb: "showing users where they are in your app",
  button: "actions in forms, dialogs, and toolbars",
  calendar: "date selection, scheduling flows, and booking interfaces",
  "calendar-view": "month and week schedules with events",
  card: "dashboards, summaries, and content previews",
  carousel: "image galleries and content sliders",
  "chat-bubble": "messaging and chat interfaces",
  "chat-window": "full messaging experiences",
  checkbox: "multi-choice forms and settings",
  combobox: "searchable selects and option pickers",
  "context-menu": "right-click actions on files, rows, and canvas items",
  "conversation-card": "chat lists and inboxes",
  "data-grid": "tables, admin panels, and data-heavy screens",
  "date-picker": "picking dates and date ranges in forms, filters, and booking flows",
  divider: "separating content sections and inline items",
  drawer: "slide-in panels for details and settings",
  dropdown: "select inputs and action menus",
  empty: "empty states with a clear next step",
  field: "form layouts with labels, hints, and errors",
  "file-upload": "attachments, image uploads, and drag-and-drop",
  input: "forms, search fields, and text entry",
  "input-group": "search bars, URL fields, and composer toolbars",
  marker: "status lines, system notes, and labelled dividers in a thread",
  masonry: "photo walls, card feeds, and dashboards",
  masthead: "page banners and hero sections",
  mention: "tagging people in comments and messages",
  menu: "sidebar and app navigation",
  "multi-select": "picking several people or options at once",
  pagination: "navigating long lists and tables",
  pigeon: "playful 3D flourishes and easter eggs",
  popover: "quick actions, feedback prompts, and inline forms",
  progress: "showing task and upload progress",
  questionnaire: "onboarding surveys, setup wizards, and multi-step forms",
  "radio-group": "choosing one option from a few",
  rating: "star ratings and feedback scores",
  "search-input": "compact, expandable search",
  segmented: "compact view switchers and filters",
  sidebar: "app navigation that collapses out of the way",
  skeleton: "loading placeholders while content arrives",
  slider: "picking values and ranges",
  sonner: "toast notifications and status updates",
  space: "consistent gaps between controls and content",
  "splash-screen": "app intros, brand reveals, and first-visit welcomes",
  spinner: "loading and busy states",
  splitter: "resizable panels and split views",
  steps: "onboarding, checkout, and multi-step forms",
  switch: "on/off settings and toggles",
  tabs: "switching between views and settings panels",
  tag: "labels, filters, and status chips",
  "time-picker": "choosing times in forms and schedules",
  timeline: "activity feeds, order tracking, and roadmaps",
  tooltip: "hints and extra context on hover",
  tour: "guided walkthroughs of new features",
  tree: "folders, hierarchies, and nested data",
  typography: "headings, body text, and inline styles",
  "use-debounce": "search boxes, autosave, and other rapid-fire input",
  "widget-board": "drag-and-drop dashboards",
}

/**
 * The concise one-liner shown under an item's title on its component page,
 * e.g. "Browse 8 production-ready avatar examples for profile pictures,
 * presence indicators, and team lists."
 */
export function componentBlurb(
  item: { name: string; title: string; type: string },
  exampleCount: number
): string {
  const kind = item.type === "registry:hook" ? "hook" : "component"
  const subject = item.title.toLowerCase()
  const phrase = useCases[item.name]
  const forUses = phrase ? ` for ${phrase}` : ""

  if (exampleCount > 1) {
    return `Browse ${exampleCount} production-ready ${subject} examples${forUses}.`
  }
  return `A production-ready ${subject} ${kind}${forUses}.`
}

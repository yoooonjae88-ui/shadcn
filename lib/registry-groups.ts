import registry from "@/registry.json"

export type RegistryItem = (typeof registry.items)[number]

// Display order for the categories on the home page and the components
// sidebar. Groups not listed here (e.g. "Navigation") slot in after the
// known ones, and "Others" always comes last.
const CATEGORY_ORDER = [
  "General",
  "Layout",
  "Data Entry",
  "Data Display",
  "Feedback",
]

const OTHERS = "Others"

/**
 * Registry items grouped by `meta.group`, as [category, items] pairs in
 * display order. Items are sorted alphabetically by title within a group.
 */
export function groupedRegistryItems(): [string, RegistryItem[]][] {
  const groups = new Map<string, RegistryItem[]>()

  for (const item of registry.items) {
    const group = item.meta?.group || OTHERS
    const items = groups.get(group)
    if (items) items.push(item)
    else groups.set(group, [item])
  }

  const known = CATEGORY_ORDER.filter((name) => groups.has(name))
  const extra = [...groups.keys()]
    .filter((name) => name !== OTHERS && !CATEGORY_ORDER.includes(name))
    .sort()
  const order = groups.has(OTHERS) ? [...known, ...extra, OTHERS] : [...known, ...extra]

  return order.map((name) => [
    name,
    groups.get(name)!.slice().sort((a, b) => a.title.localeCompare(b.title)),
  ])
}

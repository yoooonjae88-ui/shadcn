"use client"

import { Masonry, type MasonryItemType } from "@/registry/masonry/masonry"

const HEIGHTS = [96, 168, 64, 200, 120, 88, 152, 72]

const pinnedItems: MasonryItemType<{ label: string; height: number }>[] = [
  { key: "pinned", column: 0, data: { label: "pinned to column 0", height: 128 } },
  ...HEIGHTS.map((height, index) => ({
    key: index,
    data: { label: `${index + 1}`, height },
  })),
]

// Data-driven with itemRender; the first item is pinned to a column.
export function MasonryItemsApiExample() {
  return (
    <Masonry
      className="w-full max-w-xl"
      columns={{ base: 2, md: 3 }}
      gutter={16}
      items={pinnedItems}
      itemRender={(item) => (
        <div
          className={`flex items-center justify-center rounded-md px-3 text-center text-sm font-medium ${
            item.column !== undefined
              ? "bg-accent text-accent-foreground"
              : "bg-muted text-muted-foreground"
          }`}
          style={{ height: item.data?.height }}
        >
          {item.data?.label}
        </div>
      )}
    />
  )
}

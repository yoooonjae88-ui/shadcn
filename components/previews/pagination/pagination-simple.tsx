"use client"

import { Pagination } from "@/registry/pagination/pagination"

// Simple mode with an inline editable page input.
export function PaginationSimpleExample() {
  return (
    <div className="w-full max-w-xl">
      <Pagination simple defaultCurrent={2} total={500} />
    </div>
  )
}

"use client"

import { Pagination } from "@/registry/pagination/pagination"

export function PaginationAlignedExample() {
  return (
    <div className="w-full max-w-xl">
      <Pagination align="center" defaultCurrent={1} total={50} />
    </div>
  )
}

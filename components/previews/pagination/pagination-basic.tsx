"use client"

import { Pagination } from "@/registry/pagination/pagination"

export function PaginationBasicExample() {
  return (
    <div className="w-full max-w-xl">
      <Pagination total={50} />
    </div>
  )
}

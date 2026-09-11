"use client"

import * as React from "react"

import { Pagination } from "@/registry/pagination/pagination"

// The ••• jumpers hop 5 pages and show double chevrons on hover.
export function PaginationMoreExample() {
  const [page, setPage] = React.useState(6)
  return (
    <div className="w-full max-w-xl">
      <Pagination
        current={page}
        onChange={setPage}
        total={500}
        showSizeChanger={false}
      />
    </div>
  )
}

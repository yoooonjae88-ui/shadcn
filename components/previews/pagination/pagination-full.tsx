"use client"

import * as React from "react"

import { Pagination } from "@/registry/pagination/pagination"

// Total summary, a page-size changer and a quick jumper.
export function PaginationFullExample() {
  const [page, setPage] = React.useState(6)
  const [pageSize, setPageSize] = React.useState(10)

  return (
    <div className="w-full max-w-xl">
      <Pagination
        current={page}
        pageSize={pageSize}
        onChange={(nextPage, nextPageSize) => {
          setPage(nextPage)
          setPageSize(nextPageSize)
        }}
        total={500}
        showSizeChanger
        showQuickJumper
        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
      />
    </div>
  )
}

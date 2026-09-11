"use client"

import * as React from "react"

import { Input } from "@/registry/input/input"

export function InputSearchExample() {
  const [searched, setSearched] = React.useState("")

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      {searched && (
        <p className="text-xs text-muted-foreground">searched: “{searched}”</p>
      )}
      <Input.Search placeholder="Search…" onSearch={setSearched} allowClear />
      <Input.Search
        placeholder="With primary button"
        enterButton
        onSearch={setSearched}
      />
      <Input.Search
        placeholder="Custom button text"
        enterButton="Search"
        size="large"
        onSearch={setSearched}
      />
      <Input.Search placeholder="Loading" enterButton loading />
    </div>
  )
}

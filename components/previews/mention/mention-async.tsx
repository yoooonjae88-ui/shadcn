"use client"

import * as React from "react"

import { Mention, type MentionOption } from "@/registry/mention/mention"

// Stand-in for a real backend.
async function fetchUsers(query: string): Promise<MentionOption[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const all = ["light", "bamboo", "cat", "dog", "cake", "orange", "lemon", "banana"]
  return all
    .filter((name) => name.includes(query.toLowerCase()))
    .map((name) => ({ value: name, label: name }))
}

// filterOption disabled — options come straight from onSearch, with stale
// responses ignored.
export function MentionAsyncExample() {
  const [asyncOptions, setAsyncOptions] = React.useState<MentionOption[]>([])
  const [loading, setLoading] = React.useState(false)
  const searchRef = React.useRef(0)

  const handleSearch = (text: string) => {
    const token = ++searchRef.current
    setLoading(true)
    setAsyncOptions([])
    fetchUsers(text).then((next) => {
      if (token !== searchRef.current) return
      setAsyncOptions(next)
      setLoading(false)
    })
  }

  return (
    <Mention
      className="max-w-sm"
      options={asyncOptions}
      loading={loading}
      filterOption={false}
      onSearch={handleSearch}
      placeholder="Type @ then 'a' or 'ca'…"
      autoSize={{ minRows: 2 }}
    />
  )
}

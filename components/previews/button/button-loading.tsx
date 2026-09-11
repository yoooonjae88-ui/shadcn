"use client"

import * as React from "react"

import { Button } from "@/registry/button/button"

export function ButtonLoadingExample() {
  const [loading, setLoading] = React.useState(false)

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button loading={loading} onClick={() => setLoading((v) => !v)}>
        {loading ? "Saving…" : "Click to load"}
      </Button>
      <Button variant="outline" loading>
        Please wait
      </Button>
      <Button size="icon" variant="secondary" loading aria-label="Loading" />
    </div>
  )
}

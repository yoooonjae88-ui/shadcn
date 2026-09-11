"use client"

import * as React from "react"

import {
  MultiSelect,
  type MultiSelectOption,
} from "@/registry/multi-select/multi-select"

const directory: MultiSelectOption[] = [
  { value: "U-1001", label: "Leslie Alexander", domain: "acme.com" },
  { value: "U-1002", label: "Kathryn Murphy", domain: "acme.com" },
  { value: "U-1003", label: "Courtney Henry", domain: "globex.io" },
  { value: "U-1004", label: "Michael Foster", domain: "globex.io" },
  { value: "U-1005", label: "Lindsay Walton", domain: "acme.com" },
  { value: "U-1006", label: "Tom Cook", domain: "initech.net" },
  { value: "U-1007", label: "Whitney Francis", domain: "initech.net" },
  { value: "U-1008", label: "Jacob Jones", domain: "globex.io" },
  { value: "U-1009", label: "Arlene McCoy", domain: "acme.com" },
  { value: "U-1010", label: "Marvin McKinney", domain: "initech.net" },
]

// Stand-in for a real backend: resolves after a short network-like delay and
// honors the abort signal the way `fetch(url, { signal })` would.
async function searchUsers(
  query: string,
  signal: AbortSignal
): Promise<MultiSelectOption[]> {
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, 500)
    signal.addEventListener("abort", () => {
      clearTimeout(timer)
      reject(new DOMException("Aborted", "AbortError"))
    })
  })

  const q = query.toLowerCase()
  return directory.filter(
    (user) =>
      user.label.toLowerCase().includes(q) ||
      user.value.toLowerCase().includes(q) ||
      (user.domain ?? "").toLowerCase().includes(q)
  )
}

export function MultiSelectDemo() {
  const [selected, setSelected] = React.useState<MultiSelectOption[]>([])
  const [chipDetail, setChipDetail] = React.useState(true)

  return (
    <div className="flex flex-col items-center gap-4">
      <MultiSelect
        onSearch={searchUsers}
        onValueChange={setSelected}
        columns={["Name", "User ID", "Domain"]}
        chipDetail={chipDetail}
        placeholder="Search people…"
        searchPrompt="Type a name, user id or domain…"
        className="w-96"
      />
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={chipDetail}
          onChange={(event) => setChipDetail(event.target.checked)}
          className="size-3.5 accent-primary"
        />
        Show “Name (userid@domain)” in chips
      </label>
      <p className="text-xs text-muted-foreground">
        {selected.length === 0
          ? "Nothing selected yet — try typing “le”, “U-10” or “acme”."
          : `Selected: ${selected.map((user) => user.value).join(", ")}`}
      </p>
    </div>
  )
}

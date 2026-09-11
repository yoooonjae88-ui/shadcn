"use client"

import * as React from "react"

import { Checkbox } from "@/registry/checkbox/checkbox"

const GROUP_ITEMS = ["Marketing", "Security", "Product updates"] as const

// A parent checkbox that tracks its children with an indeterminate state.
export function CheckboxSelectAllExample() {
  const parentId = React.useId()
  const [checkedItems, setCheckedItems] = React.useState<boolean[]>([
    true,
    false,
    false,
  ])

  const allChecked = checkedItems.every(Boolean)
  const someChecked = checkedItems.some(Boolean)

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id={parentId}
          checked={allChecked}
          indeterminate={someChecked && !allChecked}
          onCheckedChange={(value) =>
            setCheckedItems(GROUP_ITEMS.map(() => value))
          }
        />
        <label htmlFor={parentId} className="cursor-pointer text-sm font-medium leading-none">
          Select all
        </label>
      </div>
      <div className="flex flex-col gap-3 ps-6">
        {GROUP_ITEMS.map((item, index) => {
          const id = `cb-group-${index}`
          return (
            <div key={item} className="flex items-center gap-2">
              <Checkbox
                id={id}
                checked={checkedItems[index]}
                onCheckedChange={(value) =>
                  setCheckedItems((prev) =>
                    prev.map((c, i) => (i === index ? value : c))
                  )
                }
              />
              <label htmlFor={id} className="cursor-pointer text-sm font-medium leading-none">
                {item}
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}

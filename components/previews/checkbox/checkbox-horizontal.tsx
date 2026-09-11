"use client"

import { Checkbox } from "@/registry/checkbox/checkbox"

const options = ["React", "Vue", "Svelte"]

export function CheckboxHorizontalExample() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      {options.map((option) => {
        const id = `cb-fw-${option}`
        return (
          <div key={option} className="flex items-center gap-2">
            <Checkbox id={id} defaultChecked={option === "React"} />
            <label htmlFor={id} className="cursor-pointer text-sm font-medium leading-none">
              {option}
            </label>
          </div>
        )
      })}
    </div>
  )
}

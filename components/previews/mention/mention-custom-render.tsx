"use client"

import { Mention, type MentionOption } from "@/registry/mention/mention"

const users: MentionOption[] = [
  { value: "afc163", label: "Afc163" },
  { value: "zombiej", label: "Zombie J" },
  { value: "yesmeck", label: "Yes Meck" },
]

// optionRender draws rich suggestion rows.
export function MentionCustomRenderExample() {
  return (
    <Mention
      className="max-w-sm"
      options={users}
      autoSize={{ minRows: 2 }}
      placeholder="Type @ to see rich rows"
      optionRender={(option) => (
        <div className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            {option.value.charAt(0).toUpperCase()}
          </span>
          <span>{option.label}</span>
        </div>
      )}
    />
  )
}

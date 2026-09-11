"use client"

import { Title } from "@/registry/typography/typography"

export function TypographyTitleExample() {
  return (
    <div className="flex flex-col gap-1">
      <Title level={2}>Title level 2</Title>
      <Title level={4}>Title level 4</Title>
    </div>
  )
}

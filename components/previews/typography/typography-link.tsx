"use client"

import { Link, Paragraph } from "@/registry/typography/typography"

export function TypographyLinkExample() {
  return (
    <Paragraph className="max-w-xl">
      Read the conventions in the{" "}
      <Link href="https://ui.shadcn.com/docs" target="_blank" rel="noreferrer">
        shadcn docs
      </Link>{" "}
      or use a{" "}
      <Link href="#" disabled>
        disabled link
      </Link>
      .
    </Paragraph>
  )
}

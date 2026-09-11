"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"

export function CopyButton({
  text,
  variant = "outline",
}: {
  text: string
  variant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const [copied, setCopied] = React.useState(false)

  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy"}
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  )
}

"use client"

import { Check } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarIndicator,
  AvatarStatus,
} from "@/registry/avatar/avatar"

// Self-contained SVG portrait (data URI) so the demo renders without any
// network — a soft gradient disc with initials.
function portrait(initials: string, hue: number) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${hue} 70% 62%)"/>
      <stop offset="1" stop-color="hsl(${(hue + 40) % 360} 68% 45%)"/>
    </linearGradient></defs>
    <rect width="96" height="96" fill="url(#g)"/>
    <text x="48" y="48" dy="0.35em" text-anchor="middle" font-family="system-ui, sans-serif"
      font-size="38" font-weight="600" fill="#ffffff">${initials}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export function AvatarIndicatorsExample() {
  return (
    <div className="flex items-center gap-4">
      <Avatar size="lg">
        <AvatarImage src={portrait("AC", 260)} alt="Ava Chen" />
        <AvatarFallback>AC</AvatarFallback>
        <AvatarIndicator position="top-end">
          <AvatarStatus variant="online" size="lg" />
        </AvatarIndicator>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src={portrait("ML", 200)} alt="Marcus Lee" />
        <AvatarFallback>ML</AvatarFallback>
        <AvatarIndicator position="bottom-start">
          <AvatarStatus variant="away" size="lg" />
        </AvatarIndicator>
      </Avatar>
      {/* A custom badge overlay instead of a presence dot */}
      <Avatar size="lg">
        <AvatarImage src={portrait("PN", 330)} alt="Priya Nair" />
        <AvatarFallback>PN</AvatarFallback>
        <AvatarIndicator position="top-end">
          <span className="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background">
            <Check className="size-2.5" aria-label="Verified" />
          </span>
        </AvatarIndicator>
      </Avatar>
    </div>
  )
}

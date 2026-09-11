"use client"

import { Users } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/avatar/avatar"
import { Button } from "@/registry/button/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/empty/empty"

// Self-contained SVG portrait (data URI) so the avatar renders with no network.
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

// The media slot holds an avatar instead of an icon.
export function EmptyAvatarExample() {
  return (
    <Empty variant="outline" className="w-full max-w-sm">
      <EmptyHeader>
        <EmptyMedia>
          <Avatar size="lg">
            <AvatarImage src={portrait("AC", 260)} alt="Ava Chen" />
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
        </EmptyMedia>
        <EmptyTitle>Ava hasn&apos;t posted</EmptyTitle>
        <EmptyDescription>
          When Ava shares an update it will appear on this profile.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline">
          <Users aria-hidden="true" />
          Follow
        </Button>
      </EmptyContent>
    </Empty>
  )
}

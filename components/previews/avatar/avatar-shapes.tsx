"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/registry/avatar/avatar"

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

export function AvatarShapesExample() {
  return (
    <div className="flex items-center gap-4">
      <Avatar shape="circle">
        <AvatarImage src={portrait("SO", 150)} alt="Sam Ortiz" />
        <AvatarFallback>SO</AvatarFallback>
      </Avatar>
      <Avatar shape="square">
        <AvatarImage src={portrait("SO", 150)} alt="Sam Ortiz" />
        <AvatarFallback>SO</AvatarFallback>
      </Avatar>
    </div>
  )
}

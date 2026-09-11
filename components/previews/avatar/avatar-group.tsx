"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
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

const people = [
  { name: "Ava Chen", initials: "AC", hue: 260 },
  { name: "Marcus Lee", initials: "ML", hue: 200 },
  { name: "Priya Nair", initials: "PN", hue: 330 },
  { name: "Sam Ortiz", initials: "SO", hue: 150 },
  { name: "Jordan Kim", initials: "JK", hue: 30 },
]

export function AvatarGroupExample() {
  return (
    <div className="flex flex-col items-center gap-4">
      <AvatarGroup max={3}>
        {people.map((p) => (
          <Avatar key={p.name}>
            <AvatarImage src={portrait(p.initials, p.hue)} alt={p.name} />
            <AvatarFallback>{p.initials}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
      <AvatarGroup max={4} size="sm">
        {people.map((p) => (
          <Avatar key={p.name} size="sm">
            <AvatarImage src={portrait(p.initials, p.hue)} alt={p.name} />
            <AvatarFallback>{p.initials}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
    </div>
  )
}

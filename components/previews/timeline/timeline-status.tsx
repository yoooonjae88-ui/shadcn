"use client"

import { GitCommitHorizontal } from "lucide-react"

import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/registry/timeline/timeline"

const statuses = [
  { variant: "success" as const, title: "Deploy succeeded", date: "2m ago" },
  { variant: "info" as const, title: "Migration started", date: "9m ago" },
  { variant: "warning" as const, title: "High memory usage", date: "22m ago" },
  { variant: "destructive" as const, title: "Health check failed", date: "1h ago" },
]

// Coloured indicator variants for an activity feed.
export function TimelineStatusExample() {
  return (
    <Timeline className="w-full max-w-md">
      {statuses.map((status, index) => (
        <TimelineItem key={status.title} step={index + 1}>
          <TimelineHeader>
            <TimelineSeparator />
            <TimelineIndicator variant={status.variant}>
              <GitCommitHorizontal />
            </TimelineIndicator>
            <TimelineTitle>{status.title}</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>{status.date}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

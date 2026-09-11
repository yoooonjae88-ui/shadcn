"use client"

import { Check, Package, Rocket, Truck } from "lucide-react"

import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/registry/timeline/timeline"

const events = [
  { date: "Mar 12", title: "Order placed", body: "Payment authorised.", icon: <Check /> },
  { date: "Mar 12", title: "Packed", body: "Boxed for shipping.", icon: <Package /> },
  { date: "Mar 13", title: "Shipped", body: "Tracking is now live.", icon: <Truck /> },
  { date: "Mar 15", title: "Out for delivery", body: "Arrives today.", icon: <Rocket /> },
]

// alternate sits items on either side of a centered rail.
export function TimelineAlternatingExample() {
  return (
    <Timeline value={2} alternate className="w-full max-w-md">
      {events.map((event, index) => (
        <TimelineItem key={event.title} step={index + 1}>
          <TimelineHeader>
            <TimelineSeparator />
            <TimelineIndicator>{event.icon}</TimelineIndicator>
            <TimelineDate>{event.date}</TimelineDate>
            <TimelineTitle>{event.title}</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>{event.body}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

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
  { date: "Mar 15", title: "Delivery", body: "Arrives today.", icon: <Rocket /> },
]

export function TimelineHorizontalExample() {
  return (
    <Timeline value={2} orientation="horizontal" className="w-full max-w-xl">
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

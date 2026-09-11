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
  {
    date: "Mar 12, 2026 · 09:14",
    title: "Order placed",
    body: "Payment authorised and the order was queued for fulfilment.",
    icon: <Check />,
  },
  {
    date: "Mar 12, 2026 · 15:02",
    title: "Packed",
    body: "Items were picked from the warehouse and boxed for shipping.",
    icon: <Package />,
  },
  {
    date: "Mar 13, 2026 · 08:47",
    title: "Shipped",
    body: "Handed to the carrier — tracking is now live.",
    icon: <Truck />,
  },
  {
    date: "Mar 15, 2026",
    title: "Out for delivery",
    body: "The parcel is on the final leg and arrives today.",
    icon: <Rocket />,
  },
]

// value lights the passed connectors and indicators as completed.
export function TimelineVerticalExample() {
  return (
    <Timeline value={2} className="w-full max-w-md">
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

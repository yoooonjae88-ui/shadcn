"use client"

import { CreditCard, HelpCircle, Truck } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/accordion/accordion"

const iconItems = [
  {
    value: "shipping",
    icon: Truck,
    title: "Shipping",
    body: "Free standard shipping on all orders over $50, delivered in 3–5 business days.",
  },
  {
    value: "billing",
    icon: CreditCard,
    title: "Billing",
    body: "We accept all major cards and invoice monthly. Update your payment method any time.",
  },
  {
    value: "support",
    icon: HelpCircle,
    title: "Support",
    body: "Reach our team 24/7 through live chat or email for anything you need.",
  },
]

export function AccordionIconsExample() {
  return (
    <Accordion variant="solid" className="w-full max-w-md">
      {iconItems.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>
            <span className="flex items-center gap-3">
              <item.icon aria-hidden="true" className="size-4 shrink-0" />
              {item.title}
            </span>
          </AccordionTrigger>
          <AccordionContent>{item.body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

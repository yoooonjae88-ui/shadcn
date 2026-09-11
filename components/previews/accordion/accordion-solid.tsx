"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/accordion/accordion"

const faqs = [
  {
    value: "item-1",
    question: "What is a private registry?",
    answer:
      "A private registry distributes your own components to consumer projects behind an auth token, so installs work offline and stay internal.",
  },
  {
    value: "item-2",
    question: "How do I install an item?",
    answer:
      "Run `pnpm dlx shadcn add @private/<item>` with your bearer token set. The CLI resolves every dependency from this registry.",
  },
  {
    value: "item-3",
    question: "Can I restyle a component?",
    answer:
      "Yes. Every colour is a theme token, so editing the CSS variables restyles the whole component in one place.",
  },
]

export function AccordionSolidExample() {
  return (
    <Accordion variant="solid" defaultValue={["item-1"]} className="w-full max-w-md">
      {faqs.map((faq) => (
        <AccordionItem key={faq.value} value={faq.value}>
          <AccordionTrigger>{faq.question}</AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

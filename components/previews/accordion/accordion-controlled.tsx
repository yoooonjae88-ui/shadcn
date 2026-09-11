"use client"

import * as React from "react"

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

// External buttons drive the open panel through value / onValueChange.
export function AccordionControlledExample() {
  const [value, setValue] = React.useState<string[]>(["item-1"])
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {faqs.map((faq, index) => (
          <button
            key={faq.value}
            type="button"
            onClick={() => setValue([faq.value])}
            className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground data-[active]:bg-primary data-[active]:text-primary-foreground"
            data-active={value.includes(faq.value) || undefined}
          >
            Open {index + 1}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setValue([])}
          className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Close all
        </button>
      </div>
      <Accordion value={value} onValueChange={setValue}>
        {faqs.map((faq) => (
          <AccordionItem key={faq.value} value={faq.value}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

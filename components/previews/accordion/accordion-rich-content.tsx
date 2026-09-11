"use client"

import { Settings } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/accordion/accordion"

// Panels can hold any rich content, not just text.
export function AccordionRichContentExample() {
  return (
    <Accordion variant="outline" className="w-full max-w-md">
      <AccordionItem value="general">
        <AccordionTrigger>
          <span className="flex items-center gap-3">
            <Settings aria-hidden="true" className="size-4 shrink-0" />
            General
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-2">
            <p>Configure the basics for your workspace.</p>
            <ul className="list-inside list-disc text-muted-foreground">
              <li>Workspace name</li>
              <li>Default language</li>
              <li>Time zone</li>
            </ul>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

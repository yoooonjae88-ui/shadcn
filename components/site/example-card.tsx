"use client"

import * as React from "react"
import { Code, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/site/copy-button"
import { cn } from "@/lib/utils"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/drawer/drawer"

/**
 * One example on a component page: a live demo with a header that opens a
 * drawer showing the example's source code.
 */
export function ExampleCard({
  title,
  file,
  code,
  className,
  children,
}: {
  title: string
  /** Repo-relative path of the source file, shown in the drawer. */
  file: string
  code: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <Drawer>
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-medium">{title}</h3>
          <DrawerTrigger render={<Button variant="outline" size="sm" />}>
            <Code />
            Code
          </DrawerTrigger>
        </div>
        <DrawerContent side="right" size="xl" className="max-w-2xl">
          <DrawerHeader className="flex-row items-center justify-between gap-4 border-b">
            <div className="flex min-w-0 flex-col gap-1">
              <DrawerTitle icon={<Code />}>{title}</DrawerTitle>
              <DrawerDescription className="truncate font-mono text-xs">
                {file}
              </DrawerDescription>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <CopyButton text={code} />
              <DrawerClose
                render={<Button variant="ghost" size="icon" aria-label="Close" />}
              >
                <X />
              </DrawerClose>
            </div>
          </DrawerHeader>
          <DrawerBody className="p-0">
            <pre className="h-full overflow-auto p-5 font-mono text-xs leading-relaxed">
              <code>{code}</code>
            </pre>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <div className="flex min-h-40 flex-1 items-center justify-center overflow-x-auto rounded-xl border bg-background px-6 py-10">
        {children}
      </div>
    </section>
  )
}

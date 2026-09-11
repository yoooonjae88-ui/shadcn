"use client"

import { BellIcon } from "lucide-react"

import { Button } from "@/registry/button/button"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/drawer/drawer"

// The header and footer stay pinned while the body scrolls.
export function DrawerScrollableExample() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline" />}>
        Open scrollable drawer
      </DrawerTrigger>
      <DrawerContent side="right">
        <DrawerHeader>
          <DrawerTitle icon={<BellIcon />}>Notifications</DrawerTitle>
          <DrawerDescription>
            The header and footer stay pinned while this list scrolls.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerBody className="flex flex-col gap-2">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-0.5 rounded-md bg-muted/50 p-3">
              <span className="text-sm font-medium text-foreground">
                Activity #{i + 1}
              </span>
              <span className="text-xs text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore.
              </span>
            </div>
          ))}
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose render={<Button variant="ghost" />}>Mark all read</DrawerClose>
          <DrawerClose render={<Button />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

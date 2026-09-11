"use client"

import { BellIcon, XIcon } from "lucide-react"

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

// A persistent drawer ignores backdrop clicks and Escape — it only closes via
// an explicit button.
export function DrawerPersistentExample() {
  return (
    <div className="flex flex-col items-start gap-2">
      <Drawer persistent>
        <DrawerTrigger render={<Button variant="secondary" />}>
          Open persistent drawer
        </DrawerTrigger>
        <DrawerContent side="right">
          <DrawerHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <DrawerTitle icon={<BellIcon />}>Persistent drawer</DrawerTitle>
                <DrawerDescription>
                  Backdrop clicks and Escape are ignored — you must use a button
                  to close it.
                </DrawerDescription>
              </div>
              <DrawerClose
                render={<Button variant="ghost" size="icon-sm" aria-label="Close drawer" />}
              >
                <XIcon />
              </DrawerClose>
            </div>
          </DrawerHeader>
          <DrawerBody>
            <p className="text-sm text-muted-foreground">
              Useful for forms or flows where accidental dismissal would lose the
              user&apos;s work.
            </p>
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose render={<Button>Done</Button>} />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <p className="text-xs text-muted-foreground">
        The persistent drawer only closes via its button.
      </p>
    </div>
  )
}

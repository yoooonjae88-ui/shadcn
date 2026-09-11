"use client"

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

const sides = ["left", "right", "top", "bottom"] as const

export function DrawerSidesExample() {
  return (
    <div className="flex flex-wrap gap-2">
      {sides.map((side) => (
        <Drawer key={side}>
          <DrawerTrigger render={<Button variant="outline" className="capitalize" />}>
            {side}
          </DrawerTrigger>
          <DrawerContent side={side}>
            <DrawerHeader>
              <DrawerTitle className="capitalize">{side} drawer</DrawerTitle>
              <DrawerDescription>
                Slides in from the {side}. Click the backdrop or press Escape to
                dismiss.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerBody>
              <p className="text-sm text-muted-foreground">
                The background is greyed out and locked while the drawer is open,
                and it sits above all other content.
              </p>
            </DrawerBody>
            <DrawerFooter>
              <DrawerClose render={<Button variant="ghost" />}>Cancel</DrawerClose>
              <DrawerClose render={<Button />}>Save</DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  )
}

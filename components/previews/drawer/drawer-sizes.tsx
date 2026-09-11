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

const sizes = ["sm", "md", "lg", "xl", "full"] as const

// One size prop drives both axes: width for left/right, height for top/bottom.
export function DrawerSizesExample() {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <Drawer key={size}>
          <DrawerTrigger render={<Button variant="outline" className="uppercase" />}>
            {size}
          </DrawerTrigger>
          <DrawerContent side="right" size={size}>
            <DrawerHeader>
              <DrawerTitle className="uppercase">{size} drawer</DrawerTitle>
              <DrawerDescription>
                Right drawer at the <span className="uppercase">{size}</span> size.
                <code>full</code> drops the cap for an edge-to-edge panel.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerBody>
              <p className="text-sm text-muted-foreground">
                It caps the width when the drawer opens from the left or right, and
                the height when it opens from the top or bottom.
              </p>
            </DrawerBody>
            <DrawerFooter>
              <DrawerClose render={<Button>Close</Button>} />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  )
}

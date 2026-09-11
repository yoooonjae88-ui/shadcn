"use client"

import { ShoppingCart } from "lucide-react"

import { Button } from "@/registry/button/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/empty/empty"

// variant="background" washes a soft gradient behind the state.
export function EmptyBackgroundExample() {
  return (
    <Empty variant="background" className="w-full max-w-sm">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShoppingCart aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>Your cart is empty</EmptyTitle>
        <EmptyDescription>
          Looks like you haven&apos;t added anything yet. Browse the catalog to
          find something you like.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="teal">Browse products</Button>
      </EmptyContent>
    </Empty>
  )
}

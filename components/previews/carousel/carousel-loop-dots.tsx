"use client"

import type * as React from "react"

import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/registry/carousel/carousel"

function Slide({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex aspect-square items-center justify-center rounded-xl bg-muted text-4xl font-semibold text-muted-foreground select-none">
      {children}
    </div>
  )
}

const slides = Array.from({ length: 5 }, (_, i) => i + 1)

export function CarouselLoopDotsExample() {
  return (
    <Carousel opts={{ loop: true }} className="mx-12 w-[calc(100%-6rem)] max-w-xs">
      <CarouselContent>
        {slides.map((n) => (
          <CarouselItem key={n}>
            <Slide>{n}</Slide>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots className="mt-4" />
    </Carousel>
  )
}

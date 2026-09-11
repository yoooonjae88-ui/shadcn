"use client"

import type * as React from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/registry/carousel/carousel"

function Slide({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={
        "flex aspect-square items-center justify-center rounded-xl bg-muted text-4xl font-semibold text-muted-foreground select-none " +
        (className ?? "")
      }
    >
      {children}
    </div>
  )
}

const slides = Array.from({ length: 5 }, (_, i) => i + 1)

// Several slides visible at once via per-item basis.
export function CarouselMultipleExample() {
  return (
    <Carousel opts={{ align: "start" }} className="mx-12 w-[calc(100%-6rem)]">
      <CarouselContent>
        {slides.map((n) => (
          <CarouselItem key={n} className="basis-1/2 md:basis-1/3">
            <Slide className="aspect-video text-2xl">{n}</Slide>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

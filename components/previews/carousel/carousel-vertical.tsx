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

export function CarouselVerticalExample() {
  return (
    <Carousel orientation="vertical" opts={{ align: "start" }} className="mx-auto w-full max-w-xs">
      <CarouselContent className="h-[300px]">
        {slides.map((n) => (
          <CarouselItem key={n} className="basis-1/2">
            <Slide className="aspect-auto h-full text-2xl">{n}</Slide>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

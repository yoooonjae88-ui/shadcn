"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/registry/carousel/carousel"

function Slide({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex aspect-square items-center justify-center rounded-xl bg-muted text-4xl font-semibold text-muted-foreground select-none">
      {children}
    </div>
  )
}

const slides = Array.from({ length: 5 }, (_, i) => i + 1)

// Autoplay that pauses while the pointer is over the carousel.
export function CarouselAutoplayExample() {
  const [autoplay] = React.useState(() =>
    Autoplay({ delay: 2000, stopOnInteraction: false })
  )

  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[autoplay]}
      className="mx-12 w-[calc(100%-6rem)] max-w-xs"
      onMouseEnter={() => autoplay.stop()}
      onMouseLeave={() => autoplay.play()}
    >
      <CarouselContent>
        {slides.map((n) => (
          <CarouselItem key={n}>
            <Slide>{n}</Slide>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselDots className="mt-4" />
    </Carousel>
  )
}

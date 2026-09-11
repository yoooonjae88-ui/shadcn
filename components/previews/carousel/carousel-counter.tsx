"use client"

import * as React from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/registry/carousel/carousel"

function Slide({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex aspect-square items-center justify-center rounded-xl bg-muted text-4xl font-semibold text-muted-foreground select-none">
      {children}
    </div>
  )
}

const slides = Array.from({ length: 5 }, (_, i) => i + 1)

// The Embla API reports the current slide and total count.
export function CarouselCounterExample() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) return
    const update = () => {
      setCount(api.scrollSnapList().length)
      setCurrent(api.selectedScrollSnap() + 1)
    }
    update()
    api.on("select", update)
    return () => {
      api.off("select", update)
    }
  }, [api])

  return (
    <div className="mx-12 w-[calc(100%-6rem)] max-w-xs">
      <Carousel setApi={setApi}>
        <CarouselContent>
          {slides.map((n) => (
            <CarouselItem key={n}>
              <Slide>{n}</Slide>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </p>
    </div>
  )
}

"use client"

import * as React from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
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

// A thumbnail strip that scrolls the carousel via the API.
export function CarouselThumbnailsExample() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [selected, setSelected] = React.useState(0)

  React.useEffect(() => {
    if (!api) return
    const update = () => setSelected(api.selectedScrollSnap())
    update()
    api.on("select", update)
    return () => {
      api.off("select", update)
    }
  }, [api])

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col gap-3">
      <Carousel setApi={setApi} opts={{ loop: true }}>
        <CarouselContent>
          {slides.map((n) => (
            <CarouselItem key={n}>
              <Slide>{n}</Slide>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="flex justify-center gap-2">
        {slides.map((n, index) => (
          <button
            key={n}
            type="button"
            onClick={() => api?.scrollTo(index)}
            data-active={index === selected || undefined}
            aria-label={`Go to slide ${n}`}
            className="flex size-12 items-center justify-center rounded-lg bg-muted text-sm font-medium text-muted-foreground opacity-50 transition-opacity outline-none hover:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/50 data-[active]:opacity-100 data-[active]:ring-2 data-[active]:ring-carousel-dot-active"
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}

"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/* -------------------------------------------------------------------------------------------------
 * Types
 *
 * The carousel is a thin, styled wrapper over Embla Carousel. Every part reads
 * the shared Embla instance from context, so `CarouselContent`, the prev/next
 * buttons and the dot indicators all stay in sync without prop drilling. The
 * raw Embla API is exposed via `setApi` for advanced patterns (thumbnails,
 * autoplay controls, progress, …).
 * ------------------------------------------------------------------------------------------------ */

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselOrientation = "horizontal" | "vertical"

interface CarouselProps {
  /** Embla options (loop, align, dragFree, slidesToScroll, …). */
  opts?: CarouselOptions
  /** Embla plugins, e.g. `Autoplay()` from `embla-carousel-autoplay`. */
  plugins?: CarouselPlugin
  /**
   * Scroll direction. Sets Embla's axis and flips the layout, buttons and
   * keyboard arrows accordingly.
   * @default "horizontal"
   */
  orientation?: CarouselOrientation
  /** Receives the Embla API once mounted, for external control. */
  setApi?: (api: CarouselApi) => void
}

interface CarouselContextValue extends CarouselProps {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: CarouselApi
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  selectedIndex: number
  scrollSnaps: number[]
  scrollTo: (index: number) => void
  orientation: CarouselOrientation
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null)

/**
 * Access the carousel context from any descendant of `<Carousel>`. Use it to
 * build custom controls, read the selected index, or reach the Embla `api`.
 */
function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }
  return context
}

/* -------------------------------------------------------------------------------------------------
 * Root
 * ------------------------------------------------------------------------------------------------ */

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  )
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return
    setSelectedIndex(api.selectedScrollSnap())
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api])
  const scrollNext = React.useCallback(() => api?.scrollNext(), [api])
  const scrollTo = React.useCallback(
    (index: number) => api?.scrollTo(index),
    [api]
  )

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const prevKey = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp"
      const nextKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown"
      if (event.key === prevKey) {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === nextKey) {
        event.preventDefault()
        scrollNext()
      }
    },
    [orientation, scrollPrev, scrollNext]
  )

  React.useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  React.useEffect(() => {
    if (!api) return
    const syncSnaps = () => setScrollSnaps(api.scrollSnapList())
    // Embla has already initialised by the time `api` lands in state, so its
    // "init" event can't be observed here — sync once, then follow events.
    syncSnaps()
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the already-initialised Embla instance
    onSelect(api)
    api.on("reInit", onSelect)
    api.on("reInit", syncSnaps)
    api.on("select", onSelect)

    return () => {
      api?.off("select", onSelect)
      api?.off("reInit", onSelect)
      api?.off("reInit", syncSnaps)
    }
  }, [api, onSelect])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        orientation,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        selectedIndex,
        scrollSnaps,
        scrollTo,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Content — the Embla viewport + track
 * ------------------------------------------------------------------------------------------------ */

function CarouselContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Item — a single slide
 * ------------------------------------------------------------------------------------------------ */

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel()

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Previous / Next buttons
 * ------------------------------------------------------------------------------------------------ */

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "absolute rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight />
      <span className="sr-only">Next slide</span>
    </Button>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dots — one indicator per scroll snap, the active one highlighted
 *
 * Colours are tokenised via --carousel-dot / --carousel-dot-active so the
 * indicator restyles with the theme.
 * ------------------------------------------------------------------------------------------------ */

function CarouselDots({ className, ...props }: React.ComponentProps<"div">) {
  const { scrollSnaps, selectedIndex, scrollTo, orientation } = useCarousel()

  if (scrollSnaps.length === 0) return null

  return (
    <div
      data-slot="carousel-dots"
      className={cn(
        "flex justify-center gap-2",
        orientation === "vertical" && "flex-col",
        className
      )}
      {...props}
    >
      {scrollSnaps.map((_, index) => {
        const isActive = index === selectedIndex
        return (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            aria-current={isActive || undefined}
            onClick={() => scrollTo(index)}
            data-active={isActive || undefined}
            className={cn(
              "h-2 rounded-full transition-all duration-200 outline-none",
              "focus-visible:ring-3 focus-visible:ring-ring/50",
              isActive
                ? "w-5 bg-carousel-dot-active"
                : "w-2 bg-carousel-dot hover:bg-carousel-dot-active/60"
            )}
          />
        )
      })}
    </div>
  )
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  useCarousel,
}
export type {
  CarouselApi,
  CarouselProps,
  CarouselOptions,
  CarouselPlugin,
  CarouselOrientation,
}

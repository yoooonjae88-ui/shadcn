import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { BorderBeam } from "@/registry/border-beam/border-beam"

const wrapper = () =>
  document.querySelector("[data-slot='border-beam']") as HTMLElement
const glow = () =>
  document.querySelector("[data-slot='border-beam-glow']") as HTMLElement

/** The `animation` shorthand the beam is driven by, as its parts. */
const motion = () =>
  (glow().style.getPropertyValue("--border-beam-motion") ?? "").split(" ")

describe("BorderBeam", () => {
  it("masks itself down to the border ring", () => {
    render(<BorderBeam />)

    // Two mask layers, one clipped to each box, intersected: only the ring.
    expect(wrapper().className).toContain("[mask-clip:padding-box,border-box]")
    expect(wrapper().className).toContain("[mask-composite:intersect]")
    // It fills the parent and takes the parent's radius.
    expect(wrapper().className).toContain("absolute")
    expect(wrapper().className).toContain("inset-0")
    expect(wrapper().className).toContain("rounded-[inherit]")
  })

  it("is inert decoration", () => {
    render(<BorderBeam />)
    expect(wrapper()).toHaveAttribute("aria-hidden", "true")
    expect(wrapper().className).toContain("pointer-events-none")
  })

  it("laps its parent's own border box by default", () => {
    render(<BorderBeam />)
    // The utility resolves to `border-box` where supported, with a rounded
    // rect behind it — so nothing is pinned inline.
    expect(glow().className).toContain("border-beam-track")
    expect(glow().style.offsetPath).toBe("")
  })

  it("pins the lap when given a radius", () => {
    render(<BorderBeam radius={20} />)
    expect(glow().style.offsetPath).toBe("rect(0 auto auto 0 round 20px)")
  })

  it("sizes the beam and the border it travels", () => {
    render(<BorderBeam size={120} borderWidth={4} />)
    expect(glow()).toHaveStyle({ width: "120px" })
    // The ring the beam travels is a transparent border on the overlay; the
    // mask is what makes it visible. jsdom keeps the shorthand unexpanded,
    // so it is read off the attribute React wrote.
    expect(wrapper().getAttribute("style")).toContain(
      "4px solid transparent"
    )
  })

  it("runs one lap per duration, forwards", () => {
    render(<BorderBeam duration={9} />)
    const [name, duration, , delay, count, direction] = motion()
    expect(name).toBe("border-beam")
    expect(duration).toBe("9s")
    expect(delay).toBe("0s")
    expect(count).toBe("infinite")
    expect(direction).toBe("normal")
  })

  it("reverses direction on request", () => {
    render(<BorderBeam reverse />)
    expect(motion().at(-1)).toBe("reverse")
  })

  it("starts part-way round with a negative delay", () => {
    // Half of a six-second lap is three seconds already run.
    render(<BorderBeam duration={6} initialOffset={50} />)
    expect(motion()[3]).toBe("-3s")
  })

  it("adds its own delay to that starting point", () => {
    render(<BorderBeam duration={6} initialOffset={25} delay={2} />)
    expect(motion()[3]).toBe("0.5s")
  })

  it("defaults both gradient ends to theme tokens", () => {
    render(<BorderBeam />)
    expect(glow().style.backgroundImage).toBe(
      "linear-gradient(to left, var(--border-beam-from), var(--border-beam-to), transparent)"
    )
  })

  it("takes a caller's own colours", () => {
    render(<BorderBeam colorFrom="#ff0000" colorTo="#0000ff" />)
    // The CSSOM normalises hex to rgb() on the way in.
    expect(glow().style.backgroundImage).toBe(
      "linear-gradient(to left, rgb(255, 0, 0), rgb(0, 0, 255), transparent)"
    )
  })

  it("stops moving under prefers-reduced-motion", () => {
    render(<BorderBeam />)
    expect(glow().className).toContain("motion-reduce:animate-none")
  })

  it("merges a caller's className and style", () => {
    render(<BorderBeam className="opacity-50" style={{ zIndex: 5 }} />)
    expect(wrapper().className).toContain("opacity-50")
    expect(wrapper()).toHaveStyle({ zIndex: "5" })
  })
})

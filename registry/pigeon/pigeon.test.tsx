import { act, render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

// jsdom has no WebGL, so swap only the renderer for a canvas-backed stub —
// the rest of three (scene graph, geometries, lights) runs fine in JS.
vi.mock("three", async (importOriginal) => {
  const actual = await importOriginal<typeof import("three")>()

  class FakeWebGLRenderer {
    domElement = document.createElement("canvas")
    shadowMap = { enabled: false, type: 0 }
    toneMapping = 0
    toneMappingExposure = 1
    setPixelRatio = vi.fn()
    setClearColor = vi.fn()
    setSize = vi.fn()
    render = vi.fn()
    dispose = vi.fn()
  }

  return { ...actual, WebGLRenderer: FakeWebGLRenderer }
})

import { Pigeon } from "@/registry/pigeon/pigeon"

describe("Pigeon", () => {
  it("mounts a canvas into the host element", async () => {
    const { container } = render(<Pigeon data-testid="pigeon" />)
    await act(async () => {})

    const host = container.firstElementChild as HTMLElement
    expect(host).toHaveClass("relative", "overflow-hidden")
    expect(host.querySelector("canvas")).toBeInTheDocument()
  })

  it("removes the canvas and stops the loop on unmount", async () => {
    const cancelSpy = vi.spyOn(window, "cancelAnimationFrame")
    const { container, unmount } = render(<Pigeon />)
    await act(async () => {})
    const host = container.firstElementChild as HTMLElement

    unmount()
    expect(host.querySelector("canvas")).not.toBeInTheDocument()
    expect(cancelSpy).toHaveBeenCalled()
    cancelSpy.mockRestore()
  })

  it("forwards div props to the host", () => {
    const { container } = render(
      <Pigeon aria-label="Flying pigeon" className="h-40" />
    )
    const host = container.firstElementChild as HTMLElement
    expect(host).toHaveAttribute("aria-label", "Flying pigeon")
    expect(host).toHaveClass("h-40")
  })
})

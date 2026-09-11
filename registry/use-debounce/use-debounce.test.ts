import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useDebounce } from "@/registry/use-debounce/use-debounce"

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello"))
    expect(result.current).toBe("hello")
  })

  it("does not update until the delay has elapsed", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: "a" } }
    )

    rerender({ value: "b" })
    expect(result.current).toBe("a")

    act(() => {
      vi.advanceTimersByTime(499)
    })
    expect(result.current).toBe("a")

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe("b")
  })

  it("restarts the timer on every change, keeping only the last value", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: "a" } }
    )

    rerender({ value: "b" })
    act(() => {
      vi.advanceTimersByTime(300)
    })
    rerender({ value: "c" })
    act(() => {
      vi.advanceTimersByTime(300)
    })
    // "b" was superseded before its timer fired.
    expect(result.current).toBe("a")

    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe("c")
  })

  it("uses a 500ms delay by default", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 1 },
    })

    rerender({ value: 2 })
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(result.current).toBe(2)
  })

  it("honours a custom delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 50),
      { initialProps: { value: 1 } }
    )

    rerender({ value: 2 })
    act(() => {
      vi.advanceTimersByTime(50)
    })
    expect(result.current).toBe(2)
  })
})

import { act, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { Toaster, toast } from "@/registry/sonner/sonner"

afterEach(() => {
  document.documentElement.classList.remove("dark")
})

// Sonner only mounts its toast list once the first toast fires, so every
// assertion on the toaster element shows a toast first.
function showToast(message = "Saved successfully") {
  act(() => {
    toast(message)
  })
}

describe("Toaster", () => {
  it("shows a toast fired via the exported toast()", async () => {
    render(<Toaster />)
    showToast()
    expect(await screen.findByText("Saved successfully")).toBeInTheDocument()
    expect(document.querySelector("[data-sonner-toaster]")).toBeTruthy()
  })

  it("follows the .dark class on the root element", async () => {
    document.documentElement.classList.add("dark")
    render(<Toaster />)
    showToast("Dark toast")
    await screen.findByText("Dark toast")
    expect(document.querySelector("[data-sonner-toaster]")).toHaveAttribute(
      "data-sonner-theme",
      "dark"
    )
  })

  it("maps the palette onto theme tokens instead of hardcoded colors", async () => {
    render(<Toaster />)
    showToast("Token toast")
    await screen.findByText("Token toast")
    const toaster = document.querySelector(
      "[data-sonner-toaster]"
    ) as HTMLElement
    expect(toaster.style.getPropertyValue("--normal-bg")).toBe("var(--popover)")
    expect(toaster.style.getPropertyValue("--success-bg")).toBe(
      "var(--sonner-success)"
    )
    expect(toaster.style.getPropertyValue("--error-bg")).toBe(
      "var(--sonner-error)"
    )
  })
})

import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarIndicator,
  AvatarStatus,
} from "@/registry/avatar/avatar"

describe("Avatar", () => {
  it("renders the fallback when no image loads", () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByText("AB")).toHaveAttribute(
      "data-slot",
      "avatar-fallback"
    )
  })

  it("applies size and shape variants", () => {
    render(
      <Avatar data-testid="avatar" size="xl" shape="square">
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    )
    const avatar = screen.getByTestId("avatar")
    expect(avatar).toHaveClass("size-16", "rounded-lg")
  })

  it("defaults to a medium circle", () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByTestId("avatar")).toHaveClass("size-10", "rounded-full")
  })
})

describe("AvatarStatus", () => {
  it("announces the presence variant via role and label", () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
        <AvatarIndicator position="bottom-end">
          <AvatarStatus variant="busy" />
        </AvatarIndicator>
      </Avatar>
    )
    const status = screen.getByRole("img", { name: "busy" })
    expect(status).toHaveClass("bg-avatar-busy")
  })

  it("positions the indicator in the requested corner", () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
        <AvatarIndicator data-testid="indicator" position="bottom-start">
          <AvatarStatus />
        </AvatarIndicator>
      </Avatar>
    )
    expect(screen.getByTestId("indicator")).toHaveClass("bottom-0", "left-0")
  })
})

describe("AvatarGroup", () => {
  function makeAvatars(count: number) {
    return Array.from({ length: count }).map((_, i) => (
      <Avatar key={i}>
        <AvatarFallback>U{i}</AvatarFallback>
      </Avatar>
    ))
  }

  it("shows every avatar without max", () => {
    render(<AvatarGroup data-testid="group">{makeAvatars(4)}</AvatarGroup>)
    expect(
      screen.getByTestId("group").querySelectorAll("[data-slot='avatar']")
    ).toHaveLength(4)
  })

  it("collapses extras into a +N overflow avatar", () => {
    render(
      <AvatarGroup data-testid="group" max={2}>
        {makeAvatars(5)}
      </AvatarGroup>
    )
    const group = screen.getByTestId("group")
    // 2 visible + the generated overflow avatar
    expect(group.querySelectorAll("[data-slot='avatar']")).toHaveLength(3)
    expect(screen.getByText("+3")).toBeInTheDocument()
  })

  it("renders no overflow avatar when children fit within max", () => {
    render(
      <AvatarGroup data-testid="group" max={5}>
        {makeAvatars(3)}
      </AvatarGroup>
    )
    expect(
      screen.getByTestId("group").querySelectorAll("[data-slot='avatar']")
    ).toHaveLength(3)
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument()
  })
})

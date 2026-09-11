import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { z } from "zod"

import {
  BookingForm,
  bookingSchema,
} from "@/components/previews/field/field-booking-form"

const agenda = () =>
  new File(["# Agenda"], "agenda.pdf", { type: "application/pdf" })

const leslie = { value: "lalexander", label: "Leslie Alexander", domain: "acme.com" }

function fileInput(container: HTMLElement) {
  return container.querySelector<HTMLInputElement>('input[type="file"]')!
}

// The schema is plain data in, data out: test the rules without rendering.
describe("bookingSchema", () => {
  const draft = {
    title: "Quarterly planning",
    date: new Date(2026, 8, 15),
    time: new Date(2026, 8, 15, 14, 30),
    duration: 90,
    room: "borealis",
    attendees: [leslie],
    format: "remote",
    videoLink: "meet.example.com/team-sync",
    equipment: ["whiteboard"],
    priority: 3,
    notes: "  Please loop in @kmurphy  ",
    recurring: true,
    attachments: [agenda()],
    acceptPolicy: true,
  }

  const fieldErrors = (input: unknown) =>
    z.flattenError(bookingSchema.safeParse(input).error!).fieldErrors

  it("turns a complete draft into API-ready values", () => {
    expect(bookingSchema.parse(draft)).toEqual({
      title: "Quarterly planning",
      date: "2026-09-15",
      time: "14:30",
      duration: 90,
      room: "borealis",
      attendees: ["lalexander"],
      format: "remote",
      videoLink: "https://meet.example.com/team-sync",
      equipment: ["whiteboard"],
      priority: "high",
      notes: { text: "Please loop in @kmurphy", mentions: ["kmurphy"] },
      recurring: true,
      attachments: [expect.any(File)],
      acceptPolicy: true,
    })
  })

  it("reports one message per missing field", () => {
    expect(
      fieldErrors({
        title: "",
        date: null,
        time: null,
        duration: 60,
        room: null,
        attendees: [],
        format: null,
        videoLink: "",
        equipment: [],
        priority: 0,
        notes: "",
        recurring: false,
        attachments: [],
        acceptPolicy: false,
      })
    ).toEqual({
      title: ["Give the meeting a title (3+ characters)."],
      date: ["Pick a date."],
      time: ["Pick a start time."],
      room: ["Choose a room."],
      attendees: ["Invite at least one person."],
      format: ["Choose a meeting format."],
      priority: ["Set a priority."],
      attachments: ["Attach an agenda."],
      acceptPolicy: ["Accept the booking policy to continue."],
    })
  })

  it("rejects files over 5 MB", () => {
    const big = new File([new Uint8Array(5 * 1024 * 1024 + 1)], "big.pdf")

    expect(fieldErrors({ ...draft, attachments: [big] }).attachments).toEqual([
      "Each file must be 5 MB or smaller.",
    ])
  })

  it("accepts a pasted full URL and rejects malformed links", () => {
    expect(
      bookingSchema.parse({ ...draft, videoLink: "https://meet.example.com/x" })
        .videoLink
    ).toBe("https://meet.example.com/x")
    expect(fieldErrors({ ...draft, videoLink: "not a link" }).videoLink).toEqual([
      "Enter a link like meet.example.com/team-sync.",
    ])
  })

  it("needs a video link unless the meeting is in person", () => {
    expect(fieldErrors({ ...draft, videoLink: "" }).videoLink).toEqual([
      "Remote and hybrid meetings need a video link.",
    ])
    expect(
      bookingSchema.parse({ ...draft, format: "in-person", videoLink: "" })
        .videoLink
    ).toBeNull()
  })

  it("checks the guest list against the room's seats", () => {
    const crowd = Array.from({ length: 4 }, (_, i) => ({
      value: `guest-${i}`,
      label: `Guest ${i}`,
    }))

    expect(
      fieldErrors({ ...draft, room: "atlas", attendees: crowd }).attendees
    ).toEqual(["Only 4 seats including you: remove 1 or pick a bigger room."])
  })
})

// The form is tested through its contract: values in (`defaultValues`),
// values out (`onSubmit`). Nothing here knows about its internal state.
describe("BookingForm", () => {
  beforeEach(() => {
    // Freeze "today" so the calendar opens on a known month. Only Date is
    // faked; timers stay real so user-event keeps working.
    vi.useFakeTimers({ toFake: ["Date"] })
    vi.setSystemTime(new Date(2026, 8, 10))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("submits the values picked in every control", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const { container } = render(<BookingForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText("Meeting title"), "Quarterly planning")

    await user.click(screen.getByRole("button", { name: "Date" }))
    await user.click(
      await screen.findByRole("button", { name: /September 15th, 2026/ })
    )

    // Opening the panel moves focus into it, so pick from the columns.
    await user.click(screen.getByLabelText("Start time"))
    await user.click(await screen.findByRole("option", { name: "14" }))
    await user.click(screen.getByRole("option", { name: "30" }))
    await user.click(screen.getByRole("button", { name: "OK" }))

    // Two 15-minute steps up from the 60-minute default.
    act(() => screen.getByRole("slider", { name: "Duration" }).focus())
    await user.keyboard("{ArrowRight}{ArrowRight}")

    await user.click(screen.getByLabelText("Room"))
    await user.click(await screen.findByRole("option", { name: "Borealis · 8 seats" }))

    // Attendees load from a debounced async search.
    await user.type(screen.getByLabelText("Attendees"), "les")
    await user.click(
      await screen.findByRole("option", { name: /Leslie Alexander/ }, { timeout: 3000 })
    )
    await user.keyboard("{Escape}")

    await user.click(screen.getByRole("radio", { name: "Remote" }))
    await user.type(screen.getByLabelText("Video link"), "meet.example.com/team-sync")

    await user.click(screen.getByRole("button", { name: "Filter equipment" }))
    await user.type(screen.getByPlaceholderText("Filter equipment…"), "white")
    expect(screen.queryByRole("checkbox", { name: "Projector" })).not.toBeInTheDocument()
    await user.click(screen.getByRole("checkbox", { name: "Whiteboard" }))

    await user.click(screen.getByRole("button", { name: "Rate 3 out of 3" }))

    await user.type(screen.getByLabelText("Notes for facilities"), "Please loop in @kat")
    await user.click(await screen.findByRole("option", { name: "Kathryn Murphy" }))

    await user.click(screen.getByRole("switch", { name: "Repeat weekly" }))
    await user.upload(fileInput(container), agenda())
    await user.click(
      screen.getByRole("checkbox", { name: "I agree to the room booking policy" })
    )

    await user.click(screen.getByRole("button", { name: "Book room" }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith({
      title: "Quarterly planning",
      date: "2026-09-15",
      time: "14:30",
      duration: 90,
      room: "borealis",
      attendees: ["lalexander"],
      format: "remote",
      videoLink: "https://meet.example.com/team-sync",
      equipment: ["whiteboard"],
      priority: "high",
      notes: { text: "Please loop in @kmurphy", mentions: ["kmurphy"] },
      recurring: true,
      attachments: [expect.objectContaining({ name: "agenda.pdf" })],
      acceptPolicy: true,
    })
    // Many popups open and close here; allow headroom when the whole suite runs in parallel.
  }, 30_000)

  it("blocks submit and shows errors, then clears them as fields are fixed", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<BookingForm onSubmit={onSubmit} />)

    // No errors before the first attempt.
    expect(screen.queryByText("Choose a meeting format.")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Book room" }))

    expect(onSubmit).not.toHaveBeenCalled()
    for (const message of [
      "Give the meeting a title (3+ characters).",
      "Pick a date.",
      "Pick a start time.",
      "Choose a room.",
      "Invite at least one person.",
      "Choose a meeting format.",
      "Set a priority.",
      "Attach an agenda.",
      "Accept the booking policy to continue.",
    ]) {
      expect(screen.getByText(message)).toBeInTheDocument()
    }
    // Cross-field rules wait until the fields they read are valid.
    expect(
      screen.queryByText("Remote and hybrid meetings need a video link.")
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole("radio", { name: "Hybrid" }))
    expect(screen.queryByText("Choose a meeting format.")).not.toBeInTheDocument()
    expect(
      screen.getByText("Remote and hybrid meetings need a video link.")
    ).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Rate 2 out of 3" }))
    expect(screen.queryByText("Set a priority.")).not.toBeInTheDocument()
  })

  it("pre-fills from defaultValues and resets back to them", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const { container } = render(
      <BookingForm
        onSubmit={onSubmit}
        defaultValues={{
          title: "Design review",
          date: new Date(2026, 8, 15),
          time: new Date(2026, 8, 15, 9, 0),
          room: "atlas",
          attendees: [leslie],
          format: "hybrid",
          videoLink: "meet.example.com/design",
          priority: 2,
          acceptPolicy: true,
        }}
      />
    )

    await user.click(screen.getByRole("radio", { name: "Remote" }))
    await user.clear(screen.getByLabelText("Meeting title"))
    await user.click(screen.getByRole("button", { name: "Reset" }))
    expect(screen.getByRole("radio", { name: "Hybrid" })).toBeChecked()
    expect(screen.getByLabelText("Meeting title")).toHaveValue("Design review")

    await user.upload(fileInput(container), agenda())
    await user.click(screen.getByRole("button", { name: "Book room" }))

    expect(onSubmit).toHaveBeenCalledWith({
      title: "Design review",
      date: "2026-09-15",
      time: "09:00",
      duration: 60,
      room: "atlas",
      attendees: ["lalexander"],
      format: "hybrid",
      videoLink: "https://meet.example.com/design",
      equipment: [],
      priority: "normal",
      notes: { text: "", mentions: [] },
      recurring: false,
      attachments: [expect.objectContaining({ name: "agenda.pdf" })],
      acceptPolicy: true,
    })
  })
})

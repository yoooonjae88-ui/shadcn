"use client"

import * as React from "react"
import { CalendarIcon, FlagIcon, VideoIcon } from "lucide-react"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/button/button"
import { Calendar } from "@/registry/calendar/calendar"
import { Checkbox } from "@/registry/checkbox/checkbox"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  type ComboboxOption,
} from "@/registry/combobox/combobox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/registry/field/field"
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadErrors,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  formatBytes,
  useFileUploadContext,
} from "@/registry/file-upload/file-upload"
import { Input } from "@/registry/input/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/registry/input-group/input-group"
import { getMentions, Mention, type MentionOption } from "@/registry/mention/mention"
import {
  MultiSelect,
  type MultiSelectOption,
} from "@/registry/multi-select/multi-select"
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/popover/popover"
import { RadioGroup, RadioGroupItem } from "@/registry/radio-group/radio-group"
import { Rating } from "@/registry/rating/rating"
import { SearchInput } from "@/registry/search-input/search-input"
import { Slider } from "@/registry/slider/slider"
import { Switch } from "@/registry/switch/switch"
import { formatTime, TimePicker } from "@/registry/time-picker/time-picker"

/* -------------------------------------------------------------------------- *
 * Options
 * -------------------------------------------------------------------------- */

const MAX_TITLE = 60
const MAX_NOTES = 280
const MAX_FILES = 3
const MAX_FILE_SIZE = 5 * 1024 * 1024

interface Room extends ComboboxOption {
  seats: number
}

const rooms: Room[] = [
  { value: "atlas", label: "Atlas · 4 seats", seats: 4 },
  { value: "borealis", label: "Borealis · 8 seats", seats: 8 },
  { value: "cosmos", label: "Cosmos · 12 seats", seats: 12 },
  { value: "delta", label: "Delta · 20 seats", seats: 20 },
]

/** The directory behind both the attendee picker and @mentions in the notes. */
const people: MultiSelectOption[] = [
  { value: "lalexander", label: "Leslie Alexander", domain: "acme.com" },
  { value: "kmurphy", label: "Kathryn Murphy", domain: "acme.com" },
  { value: "chenry", label: "Courtney Henry", domain: "globex.io" },
  { value: "mfoster", label: "Michael Foster", domain: "globex.io" },
  { value: "lwalton", label: "Lindsay Walton", domain: "acme.com" },
  { value: "tcook", label: "Tom Cook", domain: "initech.net" },
]

const mentionOptions: MentionOption[] = people.map(({ value, label }) => ({
  value,
  label,
}))

/** Stand-in for a directory API. Honors `signal` the way `fetch(url, { signal })` does. */
async function searchPeople(query: string, signal: AbortSignal) {
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, 200)
    signal.addEventListener("abort", () => {
      clearTimeout(timer)
      reject(new DOMException("Aborted", "AbortError"))
    })
  })
  const q = query.toLowerCase()
  return people.filter(
    (person) =>
      person.label.toLowerCase().includes(q) || person.value.includes(q)
  )
}

const formats = [
  { value: "in-person", label: "In person" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
] as const

type Format = (typeof formats)[number]["value"]

const EQUIPMENT = [
  "display",
  "projector",
  "whiteboard",
  "video-bar",
  "speakerphone",
  "clicker",
  "coffee",
  "lunch",
] as const

type Equipment = (typeof EQUIPMENT)[number]

const equipmentLabels: Record<Equipment, string> = {
  display: "Display screen",
  projector: "Projector",
  whiteboard: "Whiteboard",
  "video-bar": "Video bar",
  speakerphone: "Speakerphone",
  clicker: "Presenter clicker",
  coffee: "Coffee & tea",
  lunch: "Lunch catering",
}

/** The Rating's 1–3 flags map onto these. */
const priorities = [
  { value: "low", label: "Low · can be moved" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High · can't be moved" },
] as const

const durationMarks = [15, 60, 120, 180, 240].map((minutes) => ({
  value: minutes,
  label: minutes < 60 ? `${minutes}m` : `${minutes / 60}h`,
}))

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (!hours) return `${rest} min`
  return rest ? `${hours} h ${rest} min` : `${hours} h`
}

/** "2026-09-15" in local time (toISOString() would shift the day across time zones). */
function toDateString(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/* -------------------------------------------------------------------------- *
 * Schema — the single source of truth for rules, messages and output shape.
 * -------------------------------------------------------------------------- */

/** "meet.example.com/abc" — the InputGroup addon already shows the https://. */
const videoLinkSchema = z
  .string()
  .trim()
  // Tolerate a pasted full URL.
  .transform((link) => link.replace(/^https?:\/\//i, ""))
  .refine(
    (link) => link === "" || /^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(link),
    "Enter a link like meet.example.com/team-sync."
  )
  .transform((link) => (link ? `https://${link}` : null))

const bookingFields = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Give the meeting a title (3+ characters).")
    .max(MAX_TITLE, `Keep the title under ${MAX_TITLE} characters.`),
  date: z.date({ error: "Pick a date." }).transform(toDateString),
  time: z
    .date({ error: "Pick a start time." })
    .transform((time) => formatTime(time, "HH:mm")),
  duration: z.number().int().min(15).max(240),
  room: z.string({ error: "Choose a room." }),
  attendees: z
    .array(z.object({ value: z.string() }))
    .min(1, "Invite at least one person.")
    .transform((list) => list.map((person) => person.value)),
  format: z.enum(["in-person", "remote", "hybrid"], {
    error: "Choose a meeting format.",
  }),
  videoLink: videoLinkSchema,
  equipment: z.array(z.enum(EQUIPMENT)),
  priority: z
    .number()
    .int()
    .min(1, "Set a priority.")
    .max(priorities.length)
    .transform((level) => priorities[level - 1].value),
  notes: z
    .string()
    .trim()
    .max(MAX_NOTES, `Keep notes under ${MAX_NOTES} characters.`)
    .transform((text) => ({
      text,
      mentions: getMentions(text).map((mention) => mention.value),
    })),
  recurring: z.boolean(),
  attachments: z
    .array(z.instanceof(File))
    .min(1, "Attach an agenda.")
    .max(MAX_FILES, `Attach at most ${MAX_FILES} files.`)
    .refine(
      (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
      "Each file must be 5 MB or smaller."
    ),
  acceptPolicy: z.literal(true, {
    error: "Accept the booking policy to continue.",
  }),
})

/**
 * Cross-field rules run once the fields they read are valid on their own, so a
 * missing room doesn't also report "too many attendees". (By default zod skips
 * them while *any* field is invalid, which would hide them until the very end.)
 */
function whenValid(...keys: (keyof BookingDraft)[]) {
  return (payload: z.core.ParsePayload) =>
    !payload.issues.some((issue) =>
      keys.includes(issue.path?.[0] as keyof BookingDraft)
    )
}

export const bookingSchema = bookingFields
  .superRefine(
    (booking, ctx) => {
      if (booking.format !== "in-person" && !booking.videoLink) {
        ctx.addIssue({
          code: "custom",
          path: ["videoLink"],
          message: "Remote and hybrid meetings need a video link.",
        })
      }
    },
    { when: whenValid("format", "videoLink") }
  )
  .superRefine(
    (booking, ctx) => {
      const seats = rooms.find((room) => room.value === booking.room)?.seats
      // The organizer takes a seat too.
      const over = seats ? booking.attendees.length + 1 - seats : 0
      if (over > 0) {
        ctx.addIssue({
          code: "custom",
          path: ["attendees"],
          message: `Only ${seats} seats including you: remove ${over} or pick a bigger room.`,
        })
      }
    },
    { when: whenValid("room", "attendees") }
  )

/** What the form hands to `onSubmit`: validated, non-null and API-ready. */
export type BookingValues = z.output<typeof bookingSchema>

/** What the controls hold while the user is still filling the form in. */
export interface BookingDraft {
  title: string
  date: Date | null
  time: Date | null
  /** Minutes. */
  duration: number
  room: string | null
  attendees: MultiSelectOption[]
  format: Format | null
  /** Without the scheme; the schema adds `https://`. */
  videoLink: string
  equipment: Equipment[]
  /** 0 until a flag is picked. */
  priority: number
  notes: string
  recurring: boolean
  attachments: File[]
  acceptPolicy: boolean
}

const emptyDraft: BookingDraft = {
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
}

type FieldErrors = Partial<Record<keyof BookingDraft, { message: string }[]>>

/* -------------------------------------------------------------------------- *
 * Form
 * -------------------------------------------------------------------------- */

const pickerTriggerClassName =
  "flex h-9 w-full items-center gap-2 rounded-lg bg-input-background px-3 text-left text-sm outline-none transition-shadow focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:ring-2 aria-invalid:ring-destructive/40"

/**
 * Renders the picked files and mirrors them into form state. Synced from an
 * effect rather than FileUpload's `onFilesChange`, which fires while
 * FileUpload itself is rendering.
 */
function AttachmentList({ onChange }: { onChange: (files: File[]) => void }) {
  const { state } = useFileUploadContext()

  React.useEffect(() => {
    onChange(
      state.files.flatMap((item) => (item.file instanceof File ? [item.file] : []))
    )
  }, [state.files, onChange])

  return (
    <FileUploadList>
      {state.files.map((file) => (
        <FileUploadItem key={file.id} file={file}>
          <FileUploadItemPreview />
          <FileUploadItemMetadata />
          <FileUploadItemDelete />
        </FileUploadItem>
      ))}
    </FileUploadList>
  )
}

export interface BookingFormProps {
  /**
   * Pre-fill the form (edit screens, tests). Attachments are left out because
   * FileUpload can't be seeded with `File` objects.
   */
  defaultValues?: Partial<Omit<BookingDraft, "attachments">>
  /** Receives the validated values. Only called when the schema passes. */
  onSubmit?: (values: BookingValues) => void
}

export function BookingForm({ defaultValues, onSubmit }: BookingFormProps) {
  // Captured once on mount, like a form library's `defaultValues`.
  const [initial] = React.useState<BookingDraft>(() => ({
    ...emptyDraft,
    ...defaultValues,
  }))
  const [draft, setDraft] = React.useState(initial)
  // Errors appear after the first submit attempt, then update as the user fixes them.
  const [attempted, setAttempted] = React.useState(false)
  // FileUpload (no `value` prop) and SearchInput (expanded state) keep their
  // own state, so a reset remounts them.
  const [resetKey, setResetKey] = React.useState(0)
  const [dateOpen, setDateOpen] = React.useState(false)
  // UI-only: filters the equipment list and is never submitted.
  const [equipmentQuery, setEquipmentQuery] = React.useState("")

  function setField<K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  const setAttachments = React.useCallback((attachments: File[]) => {
    setDraft((prev) => ({ ...prev, attachments }))
  }, [])

  function toggleEquipment(item: Equipment, checked: boolean) {
    setDraft((prev) => {
      const next = new Set(prev.equipment)
      if (checked) {
        next.add(item)
      } else {
        next.delete(item)
      }
      // Keep display order, whatever order the boxes were ticked in.
      return { ...prev, equipment: EQUIPMENT.filter((id) => next.has(id)) }
    })
  }

  const result = bookingSchema.safeParse(draft)
  const errors: FieldErrors =
    attempted && !result.success
      ? z.flattenError(result.error, (issue) => ({ message: issue.message }))
          .fieldErrors
      : {}

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAttempted(true)
    const parsed = bookingSchema.safeParse(draft)
    if (parsed.success) onSubmit?.(parsed.data)
  }

  function handleReset() {
    setDraft(initial)
    setAttempted(false)
    setEquipmentQuery("")
    setResetKey((key) => key + 1)
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const selectedRoom = rooms.find((room) => room.value === draft.room) ?? null
  const priority = priorities[draft.priority - 1]
  const query = equipmentQuery.trim().toLowerCase()
  const visibleEquipment = EQUIPMENT.filter((item) =>
    equipmentLabels[item].toLowerCase().includes(query)
  )

  return (
    <form noValidate onSubmit={handleSubmit} className="w-full max-w-md">
      <FieldGroup>
        <Field data-invalid={!!errors.title}>
          <FieldLabel htmlFor="booking-title">Meeting title</FieldLabel>
          <Input
            id="booking-title"
            placeholder="Quarterly planning"
            maxLength={MAX_TITLE}
            showCount
            className="h-9"
            status={errors.title ? "error" : undefined}
            aria-invalid={!!errors.title}
            value={draft.title}
            onChange={(event) => setField("title", event.target.value)}
          />
          <FieldError errors={errors.title} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field data-invalid={!!errors.date}>
            <FieldLabel htmlFor="booking-date">Date</FieldLabel>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger
                id="booking-date"
                aria-invalid={!!errors.date}
                className={cn(
                  pickerTriggerClassName,
                  !draft.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                {draft.date
                  ? draft.date.toLocaleDateString(undefined, { dateStyle: "medium" })
                  : "Pick a date"}
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={draft.date ?? undefined}
                  defaultMonth={draft.date ?? undefined}
                  disabled={{ before: today }}
                  onSelect={(date) => {
                    setField("date", date ?? null)
                    setDateOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
            <FieldError errors={errors.date} />
          </Field>

          <Field data-invalid={!!errors.time}>
            <FieldLabel htmlFor="booking-time">Start time</FieldLabel>
            <TimePicker
              id="booking-time"
              variant="filled"
              format="HH:mm"
              minuteStep={15}
              className="h-9 w-full"
              status={errors.time ? "error" : undefined}
              value={draft.time}
              onChange={(time) => setField("time", time)}
            />
            <FieldError errors={errors.time} />
          </Field>
        </div>

        <Field>
          <div className="flex items-center justify-between">
            <FieldTitle id="booking-duration-label">Duration</FieldTitle>
            <span className="text-sm text-muted-foreground tabular-nums">
              {formatDuration(draft.duration)}
            </span>
          </div>
          {/* Slider passes aria-labelledby on to its thumb's range input. */}
          <Slider
            aria-labelledby="booking-duration-label"
            min={15}
            max={240}
            step={15}
            marks={durationMarks}
            value={draft.duration}
            onValueChange={(value) => setField("duration", value as number)}
          />
        </Field>

        <Field data-invalid={!!errors.room}>
          <FieldLabel htmlFor="booking-room">Room</FieldLabel>
          <Combobox
            items={rooms}
            value={selectedRoom}
            onValueChange={(room) => setField("room", room?.value ?? null)}
          >
            <ComboboxTrigger
              id="booking-room"
              aria-invalid={!!errors.room}
              className="aria-invalid:ring-2 aria-invalid:ring-destructive/40"
            >
              <ComboboxValue placeholder="Select a room…" />
            </ComboboxTrigger>
            <ComboboxContent>
              <ComboboxInput placeholder="Search rooms…" />
              <ComboboxEmpty>No room found.</ComboboxEmpty>
              <ComboboxList>
                {(room: Room) => (
                  <ComboboxItem key={room.value} value={room}>
                    {room.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          <FieldError errors={errors.room} />
        </Field>

        <Field data-invalid={!!errors.attendees}>
          <FieldLabel htmlFor="booking-attendees">Attendees</FieldLabel>
          {/* MultiSelect has no `status` prop, so mirror the invalid ring by hand. */}
          <MultiSelect
            id="booking-attendees"
            onSearch={searchPeople}
            value={draft.attendees}
            onValueChange={(attendees) => setField("attendees", attendees)}
            columns={["Name", "User ID", "Domain"]}
            placeholder="Search people…"
            searchPrompt="Type a name or user ID…"
            className={cn(
              "w-full",
              errors.attendees && "ring-2 ring-destructive/40"
            )}
          />
          <FieldDescription>
            {selectedRoom
              ? `${draft.attendees.length + 1} of ${selectedRoom.seats} seats taken, including yours.`
              : "You take a seat too. Pick a room to see what's left."}
          </FieldDescription>
          <FieldError errors={errors.attendees} />
        </Field>

        <FieldSet>
          <FieldLegend variant="label">Meeting format</FieldLegend>
          <RadioGroup
            value={draft.format}
            onValueChange={(value) => setField("format", value as Format)}
            className="flex flex-wrap gap-6"
          >
            {formats.map((format) => (
              <div key={format.value} className="flex items-center gap-2">
                <RadioGroupItem
                  value={format.value}
                  id={`booking-format-${format.value}`}
                  aria-invalid={!!errors.format}
                />
                <FieldLabel
                  htmlFor={`booking-format-${format.value}`}
                  className="font-normal"
                >
                  {format.label}
                </FieldLabel>
              </div>
            ))}
          </RadioGroup>
          <FieldError errors={errors.format} />
        </FieldSet>

        <Field data-invalid={!!errors.videoLink}>
          <FieldLabel htmlFor="booking-video-link">Video link</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>https://</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id="booking-video-link"
              inputMode="url"
              autoComplete="off"
              placeholder="meet.example.com/team-sync"
              aria-invalid={!!errors.videoLink}
              value={draft.videoLink}
              onChange={(event) => setField("videoLink", event.target.value)}
            />
            <InputGroupAddon align="inline-end">
              <VideoIcon aria-hidden="true" />
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription>Required for remote and hybrid meetings.</FieldDescription>
          <FieldError errors={errors.videoLink} />
        </Field>

        <FieldSet>
          <FieldLegend variant="label">Equipment</FieldLegend>
          <div className="flex items-center justify-between gap-3">
            <FieldDescription>
              {draft.equipment.length > 0
                ? `${draft.equipment.length} selected`
                : "Optional. Set up before you arrive."}
            </FieldDescription>
            <SearchInput
              key={resetKey}
              label="Filter equipment"
              placeholder="Filter equipment…"
              expandedWidth="11rem"
              className="shrink-0"
              value={equipmentQuery}
              onValueChange={setEquipmentQuery}
            />
          </div>
          <div data-slot="checkbox-group" className="grid grid-cols-2 gap-3">
            {visibleEquipment.map((item) => (
              <Field key={item} orientation="horizontal">
                <Checkbox
                  id={`booking-equipment-${item}`}
                  checked={draft.equipment.includes(item)}
                  onCheckedChange={(checked) => toggleEquipment(item, checked)}
                />
                <FieldLabel
                  htmlFor={`booking-equipment-${item}`}
                  className="font-normal"
                >
                  {equipmentLabels[item]}
                </FieldLabel>
              </Field>
            ))}
            {visibleEquipment.length === 0 && (
              <p className="col-span-2 text-sm text-muted-foreground">
                No equipment matches “{equipmentQuery.trim()}”.
              </p>
            )}
          </div>
        </FieldSet>

        <Field data-invalid={!!errors.priority}>
          <FieldTitle id="booking-priority-label">Priority</FieldTitle>
          <div className="flex items-center gap-3">
            <Rating
              editable
              maxRating={priorities.length}
              icon={FlagIcon}
              rating={draft.priority}
              onRatingChange={(level) => setField("priority", level)}
              aria-labelledby="booking-priority-label"
              aria-valuetext={priority?.label}
              aria-invalid={!!errors.priority}
            />
            <span className="text-sm text-muted-foreground">
              {priority?.label ?? "Not set"}
            </span>
          </div>
          <FieldError errors={errors.priority} />
        </Field>

        <Field data-invalid={!!errors.notes}>
          <FieldLabel htmlFor="booking-notes">Notes for facilities</FieldLabel>
          <Mention
            id="booking-notes"
            options={mentionOptions}
            autoSize={{ minRows: 2, maxRows: 6 }}
            placeholder="Type @ to mention a teammate…"
            status={errors.notes ? "error" : undefined}
            aria-invalid={!!errors.notes}
            value={draft.notes}
            onChange={(notes) => setField("notes", notes)}
          />
          <FieldDescription className="flex justify-between gap-3">
            <span>Mentioned teammates get a copy of the booking.</span>
            <span className="tabular-nums">
              {draft.notes.length} / {MAX_NOTES}
            </span>
          </FieldDescription>
          <FieldError errors={errors.notes} />
        </Field>

        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor="booking-recurring">Repeat weekly</FieldLabel>
            <FieldDescription>Book the same slot for the next 4 weeks.</FieldDescription>
          </FieldContent>
          <Switch
            id="booking-recurring"
            checked={draft.recurring}
            onCheckedChange={(checked) => setField("recurring", checked)}
          />
        </Field>

        <Field data-invalid={!!errors.attachments}>
          <FieldTitle id="booking-attachments-label">Agenda</FieldTitle>
          <FileUpload
            key={resetKey}
            multiple
            maxFiles={MAX_FILES}
            maxSize={MAX_FILE_SIZE}
            accept=".pdf,.doc,.docx,.md,.txt"
          >
            <FileUploadDropzone
              aria-labelledby="booking-attachments-label"
              description="PDF, Word or Markdown · up to 3 files, 5 MB each"
              className="min-h-24 py-5"
            />
            <FileUploadErrors />
            <AttachmentList onChange={setAttachments} />
          </FileUpload>
          <FieldError errors={errors.attachments} />
        </Field>

        <Field orientation="horizontal" data-invalid={!!errors.acceptPolicy}>
          <Checkbox
            id="booking-policy"
            checked={draft.acceptPolicy}
            onCheckedChange={(checked) => setField("acceptPolicy", checked)}
            aria-invalid={!!errors.acceptPolicy}
          />
          <FieldContent>
            <FieldLabel htmlFor="booking-policy">
              I agree to the room booking policy
            </FieldLabel>
            <FieldDescription>
              Cancel at least 2 hours ahead so others can use the room.
            </FieldDescription>
            <FieldError errors={errors.acceptPolicy} />
          </FieldContent>
        </Field>

        <Field orientation="horizontal">
          <Button type="submit">Book room</Button>
          <Button type="button" variant="ghost" onClick={handleReset}>
            Reset
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

/* -------------------------------------------------------------------------- *
 * Preview: shows what `onSubmit` receives.
 * -------------------------------------------------------------------------- */

export function FieldBookingFormExample() {
  const [submitted, setSubmitted] = React.useState<BookingValues | null>(null)

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <BookingForm onSubmit={setSubmitted} />
      {submitted && (
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
          {JSON.stringify(
            submitted,
            (_key, value) =>
              value instanceof File
                ? `${value.name} (${formatBytes(value.size)})`
                : value,
            2
          )}
        </pre>
      )}
    </div>
  )
}

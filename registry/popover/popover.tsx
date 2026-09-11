"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import {
  AngryIcon,
  CheckIcon,
  FrownIcon,
  LaughIcon,
  Loader2Icon,
  MehIcon,
  MessageSquarePlusIcon,
  SmileIcon,
  StarIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- *
 * Base popover
 *
 * A floating panel anchored to a trigger, auto-flipping to fit the viewport.
 * Compose it freely, or use the PopoverItem/PopoverLink/PopoverSeparator
 * helpers to build an action menu. The PopoverFeedback and PopoverForm
 * variants below are built on these same primitives.
 * -------------------------------------------------------------------------- */

function Popover(props: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Popup> &
  Pick<
    React.ComponentProps<typeof PopoverPrimitive.Positioner>,
    "side" | "sideOffset" | "align" | "alignOffset"
  >) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        data-slot="popover-positioner"
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className="z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            "min-w-44 origin-[var(--transform-origin)] rounded-lg bg-popover p-1 text-popover-foreground shadow-md outline-none transition-[transform,opacity] data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:scale-95 data-starting-style:scale-95",
            className
          )}
          {...props}
        >
          {children}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

const popoverItemClassName =
  "flex w-full cursor-default items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-foreground/80 no-underline transition-colors outline-none select-none hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

function PopoverItem({
  className,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Close>) {
  return (
    <PopoverPrimitive.Close
      data-slot="popover-item"
      className={cn(popoverItemClassName, className)}
      {...props}
    />
  )
}

function PopoverLink({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <PopoverPrimitive.Close
      data-slot="popover-link"
      nativeButton={false}
      render={<a {...props} />}
      className={cn(popoverItemClassName, className)}
    />
  )
}

function PopoverSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-separator"
      role="separator"
      aria-orientation="horizontal"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

/* -------------------------------------------------------------------------- *
 * Shared
 * -------------------------------------------------------------------------- */

/**
 * Controllable open/value state: uses `value` when controlled, otherwise
 * falls back to internal state seeded from `defaultValue`.
 */
function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void
): [T, (next: T) => void] {
  const [internal, setInternal] = React.useState(defaultValue)
  const isControlled = value !== undefined
  const current = isControlled ? (value as T) : internal

  const setValue = React.useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next)
      onChange?.(next)
    },
    [isControlled, onChange]
  )

  return [current, setValue]
}

/* -------------------------------------------------------------------------- *
 * Popover Feedback
 *
 * A feedback-collection popover: a trigger opens a panel that gathers a
 * sentiment (emoji faces or stars), an optional category, a comment and an
 * optional email, then runs an async onSubmit with spinner / thank-you /
 * inline-error states.
 * -------------------------------------------------------------------------- */

/**
 * The value collected by the feedback popover. Every field is optional so the
 * component works whether it is configured to collect a sentiment, a category,
 * a written comment, an email, or any combination of them.
 */
export type FeedbackValue = {
  /** 1–5 sentiment score, or `null` when the user hasn't picked one. */
  sentiment: number | null
  /** The selected category id, or `null`. */
  category: string | null
  /** The written comment. */
  message: string
  /** The reporter's email (only collected when `showEmail`). */
  email: string
}

type SentimentMode = "emoji" | "stars" | "none"

type FeedbackCategory = {
  value: string
  label: string
}

const emojiScale = [
  { value: 1, label: "Terrible", Icon: AngryIcon, color: "text-pf-1" },
  { value: 2, label: "Bad", Icon: FrownIcon, color: "text-pf-2" },
  { value: 3, label: "Okay", Icon: MehIcon, color: "text-pf-3" },
  { value: 4, label: "Good", Icon: SmileIcon, color: "text-pf-4" },
  { value: 5, label: "Amazing", Icon: LaughIcon, color: "text-pf-5" },
] as const

export type PopoverFeedbackProps = {
  /**
   * How the sentiment row is rendered: five emoji faces, a five-star rating,
   * or hidden entirely. Defaults to `"emoji"`.
   */
  sentiment?: SentimentMode
  /** Heading shown at the top of the panel. */
  title?: string
  /** Supporting line under the title. */
  description?: string
  /** Placeholder for the comment textarea. */
  placeholder?: string
  /** Optional category chips shown above the comment box. */
  categories?: FeedbackCategory[]
  /** Collect an email address alongside the comment. */
  showEmail?: boolean
  /** Make the email field required before the form can be submitted. */
  requireEmail?: boolean
  /** Require a non-empty comment before the form can be submitted. */
  requireMessage?: boolean
  /** Require a sentiment pick before the form can be submitted. */
  requireSentiment?: boolean
  /** Label for the submit button. */
  submitLabel?: string
  /** Label for the cancel button. */
  cancelLabel?: string
  /** Label / content for the default trigger button. */
  triggerLabel?: React.ReactNode
  /**
   * Replaces the default trigger entirely. Anything passed here becomes the
   * clickable element that opens the popover.
   */
  trigger?: React.ReactNode
  /**
   * Called when the user submits. May return a promise — while it is pending
   * the submit button shows a spinner, and on resolve the panel flips to a
   * thank-you state. Throwing (or rejecting) surfaces an inline error and
   * keeps the form open so the user can retry.
   */
  onSubmit?: (value: FeedbackValue) => void | Promise<void>
  /** The thank-you heading shown after a successful submit. */
  successTitle?: string
  /** The thank-you body shown after a successful submit. */
  successDescription?: string
  /** Controlled open state. */
  open?: boolean
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Fires whenever the open state changes. */
  onOpenChange?: (open: boolean) => void
  /** Positioning, forwarded to the popover content. */
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
  sideOffset?: number
  alignOffset?: number
  /** Extra classes for the popover panel. */
  className?: string
}

function PopoverFeedback({
  sentiment = "emoji",
  title = "Send feedback",
  description = "How is your experience so far?",
  placeholder = "Tell us what's on your mind…",
  categories,
  showEmail = false,
  requireEmail = false,
  requireMessage = true,
  requireSentiment = false,
  submitLabel = "Send feedback",
  cancelLabel = "Cancel",
  triggerLabel = "Feedback",
  trigger,
  onSubmit,
  successTitle = "Thanks for your feedback!",
  successDescription = "We read every note and use it to make things better.",
  open,
  defaultOpen = false,
  onOpenChange,
  side = "bottom",
  align = "end",
  sideOffset,
  alignOffset,
  className,
}: PopoverFeedbackProps) {
  const [isOpen, setIsOpen] = useControllableState(
    open,
    defaultOpen,
    onOpenChange
  )

  const [score, setScore] = React.useState<number | null>(null)
  const [hovered, setHovered] = React.useState<number | null>(null)
  const [category, setCategory] = React.useState<string | null>(null)
  const [message, setMessage] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [status, setStatus] = React.useState<
    "idle" | "submitting" | "success" | "error"
  >("idle")
  const [errorText, setErrorText] = React.useState<string | null>(null)

  const emailValid = !requireEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const canSubmit =
    status !== "submitting" &&
    (!requireMessage || message.trim().length > 0) &&
    (!requireSentiment || score !== null) &&
    emailValid

  const resetForm = React.useCallback(() => {
    setScore(null)
    setHovered(null)
    setCategory(null)
    setMessage("")
    setEmail("")
    setStatus("idle")
    setErrorText(null)
  }, [])

  const handleOpenChange = (next: boolean) => {
    setIsOpen(next)
    // When the panel closes, wait for the exit animation before wiping the
    // form so the reset isn't visible on the way out.
    if (!next) window.setTimeout(resetForm, 200)
  }

  const handleSubmit = async () => {
    if (!canSubmit) return
    setErrorText(null)
    try {
      setStatus("submitting")
      await onSubmit?.({ sentiment: score, category, message, email })
      setStatus("success")
    } catch (err) {
      setStatus("error")
      setErrorText(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      )
    }
  }

  // Roving keyboard control for the sentiment row.
  const handleSentimentKeys = (event: React.KeyboardEvent) => {
    if (sentiment === "none") return
    const max = 5
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault()
      setScore((prev) => Math.min(max, (prev ?? 0) + 1))
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault()
      setScore((prev) => Math.max(1, (prev ?? max + 1) - 1))
    } else if (event.key === "Home") {
      event.preventDefault()
      setScore(1)
    } else if (event.key === "End") {
      event.preventDefault()
      setScore(max)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          trigger ? (
            (trigger as React.ReactElement)
          ) : (
            <Button variant="outline" />
          )
        }
      >
        {trigger ? undefined : (
          <>
            <MessageSquarePlusIcon />
            {triggerLabel}
          </>
        )}
      </PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className={cn("w-80 p-0", className)}
      >
        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 px-5 py-8 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-pf-success-surface text-pf-success">
              <CheckIcon className="size-6" />
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                {successTitle}
              </p>
              <p className="text-sm text-muted-foreground">
                {successDescription}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-1"
              onClick={() => handleOpenChange(false)}
            >
              Done
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 p-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">{title}</p>
              {description ? (
                <p className="text-sm text-muted-foreground">{description}</p>
              ) : null}
            </div>

            {sentiment === "emoji" ? (
              <div
                role="radiogroup"
                aria-label="Sentiment"
                tabIndex={0}
                onKeyDown={handleSentimentKeys}
                onMouseLeave={() => setHovered(null)}
                className="flex items-center justify-between rounded-lg bg-muted/60 px-1.5 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                {emojiScale.map(({ value, label, Icon, color }) => {
                  const active = (hovered ?? score) === value
                  const selected = score === value
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      aria-label={label}
                      title={label}
                      tabIndex={-1}
                      onMouseEnter={() => setHovered(value)}
                      onClick={() => setScore(value)}
                      className={cn(
                        "flex size-11 items-center justify-center rounded-md text-muted-foreground transition-all outline-none hover:bg-background",
                        active && cn(color, "scale-110"),
                        selected && "bg-background"
                      )}
                    >
                      <Icon className="size-6" />
                    </button>
                  )
                })}
              </div>
            ) : null}

            {sentiment === "stars" ? (
              <div
                role="radiogroup"
                aria-label="Rating"
                tabIndex={0}
                onKeyDown={handleSentimentKeys}
                onMouseLeave={() => setHovered(null)}
                className="flex items-center gap-1 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                {[1, 2, 3, 4, 5].map((value) => {
                  const filled = (hovered ?? score ?? 0) >= value
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={score === value}
                      aria-label={`${value} star${value === 1 ? "" : "s"}`}
                      tabIndex={-1}
                      onMouseEnter={() => setHovered(value)}
                      onClick={() => setScore(value)}
                      className="rounded-md p-1 outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring/50"
                    >
                      <StarIcon
                        className={cn(
                          "size-6 transition-colors",
                          filled
                            ? "fill-pf-star text-pf-star"
                            : "fill-transparent text-muted-foreground/40"
                        )}
                      />
                    </button>
                  )
                })}
              </div>
            ) : null}

            {categories && categories.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {categories.map((item) => {
                  const selected = category === item.value
                  return (
                    <button
                      key={item.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        setCategory(selected ? null : item.value)
                      }
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>
            ) : null}

            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={placeholder}
              rows={4}
              className="min-h-20 w-full resize-none rounded-lg bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />

            {showEmail ? (
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={
                  requireEmail ? "Your email" : "Your email (optional)"
                }
                aria-invalid={email.length > 0 && !emailValid}
                className="h-9 w-full rounded-lg bg-muted px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50 aria-invalid:ring-2 aria-invalid:ring-destructive/40"
              />
            ) : null}

            {errorText ? (
              <p className="text-xs text-destructive">{errorText}</p>
            ) : null}

            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOpenChange(false)}
              >
                {cancelLabel}
              </Button>
              <Button size="sm" disabled={!canSubmit} onClick={handleSubmit}>
                {status === "submitting" ? (
                  <Loader2Icon className="animate-spin" />
                ) : null}
                {submitLabel}
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

/* -------------------------------------------------------------------------- *
 * Popover Form
 *
 * A generic, composable "popover with form" shell. Drop any controls you like
 * into <PopoverFormBody> — the built-in PopoverFormInput, or registry controls
 * such as @private/input, @private/slider, @private/dropdown — and the shell
 * handles the panel layout, open state, Enter-to-submit and close-on-submit.
 * -------------------------------------------------------------------------- */

type PopoverFormContextValue = {
  setOpen: (open: boolean) => void
}

const PopoverFormContext = React.createContext<PopoverFormContextValue | null>(
  null
)

function usePopoverForm() {
  const ctx = React.useContext(PopoverFormContext)
  if (!ctx) {
    throw new Error("PopoverForm.* must be used inside <PopoverForm>")
  }
  return ctx
}

export type PopoverFormProps = {
  children: React.ReactNode
  /** Controlled open state. */
  open?: boolean
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Fires whenever the open state changes. */
  onOpenChange?: (open: boolean) => void
  /**
   * Called when the form is submitted (via the submit button or Enter). The
   * popover closes afterwards unless the handler returns `false` (useful to
   * keep it open on a validation failure). Read values from your own
   * controlled state or from `event.currentTarget` inside the handler.
   */
  onSubmit?: (
    event: React.FormEvent<HTMLFormElement>
  ) => void | boolean | Promise<void | boolean>
}

// The submit handler lives in its own context so PopoverFormContent (which
// owns the <form>) can reach it without prop drilling.
const PopoverFormSubmitContext = React.createContext<
  PopoverFormProps["onSubmit"] | null
>(null)

function PopoverForm({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  onSubmit,
}: PopoverFormProps) {
  const [isOpen, setOpen] = useControllableState(
    open,
    defaultOpen,
    onOpenChange
  )

  const ctx = React.useMemo<PopoverFormContextValue>(
    () => ({ setOpen }),
    [setOpen]
  )

  return (
    <PopoverFormSubmitContext.Provider value={onSubmit ?? null}>
      <PopoverFormContext.Provider value={ctx}>
        <Popover open={isOpen} onOpenChange={setOpen}>
          {children}
        </Popover>
      </PopoverFormContext.Provider>
    </PopoverFormSubmitContext.Provider>
  )
}

function PopoverFormTrigger(
  props: React.ComponentProps<typeof PopoverTrigger>
) {
  return <PopoverTrigger data-slot="popover-form-trigger" {...props} />
}

export type PopoverFormContentProps = React.ComponentProps<
  typeof PopoverContent
>

function PopoverFormContent({
  className,
  children,
  ...props
}: PopoverFormContentProps) {
  const { setOpen } = usePopoverForm()
  const onSubmit = React.useContext(PopoverFormSubmitContext)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const result = await onSubmit?.(event)
      if (result === false) return
      setOpen(false)
    } catch {
      // Keep the popover open so the user can fix the error and retry.
    }
  }

  return (
    <PopoverContent
      data-slot="popover-form-content"
      className={cn("w-72 p-0", className)}
      {...props}
    >
      <form onSubmit={handleSubmit} className="flex flex-col">
        {children}
      </form>
    </PopoverContent>
  )
}

function PopoverFormHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-form-header"
      className={cn("space-y-1 px-4 pt-4 pb-2", className)}
      {...props}
    />
  )
}

function PopoverFormTitle({ className, ...props }: React.ComponentProps<"h4">) {
  return (
    <h4
      data-slot="popover-form-title"
      className={cn(
        "text-sm leading-none font-semibold text-foreground",
        className
      )}
      {...props}
    />
  )
}

function PopoverFormDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="popover-form-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function PopoverFormBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-form-body"
      className={cn("space-y-3 px-4 py-2", className)}
      {...props}
    />
  )
}

export type PopoverFormFieldProps = React.ComponentProps<"div"> & {
  /** Field label text. */
  label?: React.ReactNode
  /** `id` of the control the label points at. */
  htmlFor?: string
  /** Optional helper text under the control. */
  description?: React.ReactNode
  /**
   * `horizontal` (default) lays the label beside the control in a 3-column
   * grid — the classic quick-edit form row. `vertical` stacks label over
   * control.
   */
  orientation?: "horizontal" | "vertical"
}

function PopoverFormField({
  label,
  htmlFor,
  description,
  orientation = "horizontal",
  className,
  children,
  ...props
}: PopoverFormFieldProps) {
  if (orientation === "vertical") {
    return (
      <div
        data-slot="popover-form-field"
        className={cn("space-y-1.5", className)}
        {...props}
      >
        {label ? (
          <label
            htmlFor={htmlFor}
            className="text-sm font-medium text-foreground"
          >
            {label}
          </label>
        ) : null}
        {children}
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
    )
  }

  return (
    <div
      data-slot="popover-form-field"
      className={cn("grid grid-cols-3 items-center gap-3", className)}
      {...props}
    >
      {label ? (
        <label htmlFor={htmlFor} className="text-sm text-foreground">
          {label}
        </label>
      ) : (
        <span aria-hidden />
      )}
      <div className="col-span-2 space-y-1.5">
        {children}
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  )
}

/**
 * A convenience text input styled with theme tokens (no border, muted fill,
 * focus ring). Optional — swap it for @private/input or any control you like.
 */
function PopoverFormInput({
  className,
  type = "text",
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="popover-form-input"
      type={type}
      className={cn(
        "h-8 w-full rounded-md bg-muted px-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50 aria-invalid:ring-2 aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

function PopoverFormFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-form-footer"
      className={cn(
        "flex items-center justify-end gap-2 px-4 pt-2 pb-4",
        className
      )}
      {...props}
    />
  )
}

/** Closes the popover without submitting. Renders as a ghost button. */
function PopoverFormCancel({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { setOpen } = usePopoverForm()
  return (
    <Button
      data-slot="popover-form-cancel"
      type="button"
      variant="ghost"
      size="sm"
      className={className}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) setOpen(false)
      }}
      {...props}
    />
  )
}

/** Submits the surrounding form. */
function PopoverFormSubmit({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="popover-form-submit"
      type="submit"
      size="sm"
      className={className}
      {...props}
    />
  )
}

export {
  // Base
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverItem,
  PopoverLink,
  PopoverSeparator,
  // Feedback
  PopoverFeedback,
  // Form
  PopoverForm,
  PopoverFormTrigger,
  PopoverFormContent,
  PopoverFormHeader,
  PopoverFormTitle,
  PopoverFormDescription,
  PopoverFormBody,
  PopoverFormField,
  PopoverFormInput,
  PopoverFormFooter,
  PopoverFormCancel,
  PopoverFormSubmit,
}

"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/*
 * Field is a composition layer, not a control. It arranges a label, the control
 * itself, a description and validation errors into the consistent vertical /
 * horizontal / responsive layouts used across data-entry forms, modeled on
 * ReUI's Field. It composes with the registry's own controls — @private/input,
 * @private/checkbox, @private/radio-group, @private/switch, @private/slider,
 * @private/dropdown, @private/button — via the shared data-slot contract, so it
 * carries no control-specific logic of its own.
 *
 * Layout is driven entirely by container queries: FieldGroup opens a
 * `@container/field-group` context and the `responsive` orientation flips from
 * stacked to side-by-side at the `@md` boundary of that container (not the
 * viewport), so a field laid out in a narrow column stays stacked while the
 * same markup in a wide one goes horizontal.
 *
 * Every colour resolves from an existing theme token (border, muted-foreground,
 * destructive, primary, background), so the item ships no cssVars of its own.
 */

/** Groups several fields under a shared caption, rendered as a native fieldset. */
function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-6",
        "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className
      )}
      {...props}
    />
  )
}

/** Caption for a FieldSet. `label` variant reads as a form label, `legend` as a section heading. */
function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-3 font-medium",
        "data-[variant=legend]:text-base",
        "data-[variant=label]:text-sm",
        className
      )}
      {...props}
    />
  )
}

const fieldGroupVariants = cva(
  "group/field-group @container/field-group flex w-full flex-col gap-7 [&>[data-slot=field-group]]:gap-4",
  {
    variants: {
      variant: {
        default: "",
        // A carded group: fields sit inside a bordered, padded surface with
        // hairline separators between them (see FieldSeparator).
        outline:
          "gap-0 rounded-lg border bg-background [&>[data-slot=field]]:p-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Vertical stack of fields. Opens the `@container/field-group` context that the
 * `responsive` Field orientation reads, so responsive fields react to this
 * container's width rather than the viewport's.
 */
function FieldGroup({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldGroupVariants>) {
  return (
    <div
      data-slot="field-group"
      data-variant={variant}
      className={cn(fieldGroupVariants({ variant }), className)}
      {...props}
    />
  )
}

const fieldVariants = cva(
  "group/field flex w-full gap-2 data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: "flex-col [&>*]:w-full [&>.sr-only]:w-auto",
        horizontal: [
          "flex-row items-center",
          "[&>[data-slot=field-label]]:flex-auto",
          "has-[>[data-slot=field-content]]:items-start",
        ],
        responsive: [
          "flex-col [&>*]:w-full [&>.sr-only]:w-auto",
          "@md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto",
          "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
          "@md/field-group:has-[>[data-slot=field-content]]:items-start",
        ],
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
)

/** A single field: label + control (+ description + error), laid out by orientation. */
function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

/**
 * Wraps the text (label/title + description) that sits beside a control in a
 * horizontal field — e.g. a switch or checkbox row with a title and a hint.
 */
function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "group/field-content flex flex-1 flex-col gap-1 leading-snug",
        className
      )}
      {...props}
    />
  )
}

/**
 * The field's label. Rendered as a native `<label>` so `htmlFor` wires it to a
 * control. When it *wraps* a Field (the choice-card pattern) it turns into a
 * selectable, bordered card that highlights while the control inside is checked.
 */
function FieldLabel({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="field-label"
      className={cn(
        "group/field-label peer/field-label flex w-fit items-center gap-2 text-sm leading-snug font-medium select-none group-data-[disabled=true]/field:opacity-50",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:cursor-pointer has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border has-[>[data-slot=field]]:p-4",
        "has-[>[data-slot=field]]:has-[[data-checked]]:border-primary has-[>[data-slot=field]]:has-[[data-checked]]:bg-primary/5",
        className
      )}
      {...props}
    />
  )
}

/** A non-`<label>` title, for use inside a choice card where the outer FieldLabel already owns the `for`. */
function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-title"
      className={cn(
        "flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50",
        className
      )}
      {...props}
    />
  )
}

/** Muted helper text under a label or control. */
function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-sm leading-normal font-normal text-muted-foreground",
        "[[data-variant=legend]+&]:-mt-1.5",
        className
      )}
      {...props}
    />
  )
}

/** A hairline separator between fields, optionally with centered inline content ("OR"). */
function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-separator"
      data-content={children ? "true" : undefined}
      className={cn(
        "relative -my-2 h-5 text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border"
      />
      {children ? (
        <span
          data-slot="field-separator-content"
          className="relative mx-auto block w-fit bg-background px-2"
        >
          {children}
        </span>
      ) : null}
    </div>
  )
}

/**
 * Validation message(s). Pass `children` for a single custom message, or an
 * `errors` array (e.g. from react-hook-form) — one entry renders inline, several
 * render as a bulleted list. Renders nothing when there is no content.
 */
function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined | null>
}) {
  const content = React.useMemo(() => {
    if (children) {
      return children
    }

    if (!errors?.length) {
      return null
    }

    const messages = errors.filter(
      (error): error is { message: string } => !!error?.message
    )

    if (messages.length === 0) {
      return null
    }

    if (messages.length === 1) {
      return messages[0].message
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {messages.map((error, index) => (
          <li key={index}>{error.message}</li>
        ))}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("text-sm font-normal text-destructive", className)}
      {...props}
    >
      {content}
    </div>
  )
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
  fieldVariants,
  fieldGroupVariants,
}

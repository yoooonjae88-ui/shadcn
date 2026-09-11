"use client"

import * as React from "react"

import { Button } from "@/registry/button/button"
import { Spinner } from "@/registry/spinner/spinner"

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex min-w-0 flex-col gap-4">
      <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {title}
      </h3>
      {children}
    </section>
  )
}

// A labelled cell so each spinner sits under its variant/size/colour name.
function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-12 items-center justify-center">{children}</div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

const variants = ["default", "circle", "pinwheel", "dots", "bars"] as const
const sizes = ["xs", "sm", "md", "lg", "xl"] as const
const colors = [
  "default",
  "primary",
  "secondary",
  "muted",
  "destructive",
  "success",
  "warning",
  "info",
] as const

// A fake async action so the loading button has something to resolve.
function useFakeSubmit() {
  const [loading, setLoading] = React.useState(false)
  const submit = React.useCallback(() => {
    setLoading(true)
    const id = setTimeout(() => setLoading(false), 2200)
    return () => clearTimeout(id)
  }, [])
  return { loading, submit }
}

export function SpinnerDemo() {
  const { loading, submit } = useFakeSubmit()

  return (
    <div className="flex flex-col gap-10">
      <Section title="Animation variants">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          {variants.map((variant) => (
            <Cell key={variant} label={variant}>
              <Spinner variant={variant} color="primary" />
            </Cell>
          ))}
        </div>
      </Section>

      <Section title="Sizes">
        <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
          {sizes.map((size) => (
            <Cell key={size} label={size}>
              <Spinner size={size} color="primary" />
            </Cell>
          ))}
        </div>
      </Section>

      <Section title="Colors">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          {colors.map((color) => (
            <Cell key={color} label={color}>
              <Spinner color={color} />
            </Cell>
          ))}
        </div>
      </Section>

      <Section title="With label">
        <div className="flex flex-wrap items-center gap-8">
          <Spinner>Loading…</Spinner>
          <Spinner variant="dots" color="success">
            Uploading files
          </Spinner>
          <Spinner variant="circle" color="destructive" size="sm">
            Retrying
          </Spinner>
        </div>
      </Section>

      <Section title="Custom size (via className)">
        <div className="flex flex-wrap items-center gap-8">
          <Spinner
            variant="pinwheel"
            color="warning"
            className="[&_svg]:size-16"
          />
        </div>
      </Section>

      <Section title="In a button">
        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={submit} disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" className="text-current" />
                Saving…
              </>
            ) : (
              "Save changes"
            )}
          </Button>
          <Button variant="outline" disabled>
            <Spinner size="sm" className="text-current" />
            Please wait
          </Button>
        </div>
      </Section>
    </div>
  )
}

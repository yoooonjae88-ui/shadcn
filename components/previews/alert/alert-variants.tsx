"use client"

import type * as React from "react"
import {
  BadgeCheck,
  Bell,
  CircleAlert,
  CircleCheck,
  Info,
  TriangleAlert,
} from "lucide-react"

import {
  Alert,
  AlertIcon,
  AlertTitle,
  type AlertProps,
} from "@/registry/alert/alert"

const VARIANTS: NonNullable<AlertProps["variant"]>[] = [
  "primary",
  "secondary",
  "destructive",
  "success",
  "info",
  "warning",
  "mono",
]

const VARIANT_ICON: Record<NonNullable<AlertProps["variant"]>, React.ReactNode> = {
  primary: <Info />,
  secondary: <Bell />,
  destructive: <CircleAlert />,
  success: <CircleCheck />,
  info: <Info />,
  warning: <TriangleAlert />,
  mono: <BadgeCheck />,
}

export function AlertVariantsExample() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-2.5">
      {VARIANTS.map((variant) => (
        <Alert key={variant} variant={variant}>
          <AlertIcon>{VARIANT_ICON[variant]}</AlertIcon>
          <AlertTitle className="capitalize">This is a {variant} alert.</AlertTitle>
        </Alert>
      ))}
    </div>
  )
}

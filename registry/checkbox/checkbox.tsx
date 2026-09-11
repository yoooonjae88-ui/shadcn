"use client"

import type * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, Minus } from "lucide-react"

import { cn } from "@/lib/utils"

const checkboxVariants = cva(
  "group peer relative inline-flex shrink-0 items-center justify-center rounded-[0.3rem] bg-checkbox text-checkbox-indicator outline-none transition-[background-color,box-shadow] select-none after:absolute after:-inset-x-2 after:-inset-y-2 focus-visible:ring-3 focus-visible:ring-ring/50 data-checked:bg-checkbox-checked data-indeterminate:bg-checkbox-checked aria-invalid:ring-2 aria-invalid:ring-destructive/40 data-checked:aria-invalid:bg-destructive data-indeterminate:aria-invalid:bg-destructive disabled:cursor-not-allowed disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "size-4 [&_svg]:size-3",
        default: "size-4.5 [&_svg]:size-3.5",
        lg: "size-5 [&_svg]:size-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

type CheckboxSize = NonNullable<VariantProps<typeof checkboxVariants>["size"]>

interface CheckboxProps extends CheckboxPrimitive.Root.Props {
  /** Control size. Defaults to `default`. */
  size?: CheckboxSize
}

function Checkbox({ className, size = "default", ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(checkboxVariants({ size }), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        <Check
          aria-hidden="true"
          className="group-data-indeterminate:hidden"
        />
        <Minus
          aria-hidden="true"
          className="hidden group-data-indeterminate:block"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox, checkboxVariants }
export type { CheckboxProps, CheckboxSize }

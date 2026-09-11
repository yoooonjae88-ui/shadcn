"use client"

import * as React from "react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const radioGroupItemVariants = cva(
  "peer group/radio-group-item relative aspect-square shrink-0 rounded-full bg-radio outline-none transition-[background-color,box-shadow] select-none after:absolute after:-inset-x-2 after:-inset-y-2 focus-visible:ring-3 focus-visible:ring-ring/50 data-checked:bg-radio-checked aria-invalid:ring-2 aria-invalid:ring-destructive/40 data-checked:aria-invalid:bg-destructive disabled:cursor-not-allowed disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "size-3.5",
        default: "size-4",
        lg: "size-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

type RadioGroupSize = NonNullable<
  VariantProps<typeof radioGroupItemVariants>["size"]
>

const radioDotSizeClasses: Record<RadioGroupSize, string> = {
  sm: "size-1.5",
  default: "size-2",
  lg: "size-2.5",
}

const RadioGroupSizeContext = React.createContext<RadioGroupSize>("default")

interface RadioGroupProps extends RadioGroupPrimitive.Props {
  /** Control size applied to every item in the group. */
  size?: RadioGroupSize
}

function RadioGroup({ className, size = "default", ...props }: RadioGroupProps) {
  return (
    <RadioGroupSizeContext.Provider value={size}>
      <RadioGroupPrimitive
        data-slot="radio-group"
        className={cn("grid gap-3", className)}
        {...props}
      />
    </RadioGroupSizeContext.Provider>
  )
}

interface RadioGroupItemProps extends RadioPrimitive.Root.Props {
  /** Overrides the size inherited from the surrounding RadioGroup. */
  size?: RadioGroupSize
}

function RadioGroupItem({ className, size, ...props }: RadioGroupItemProps) {
  const groupSize = React.useContext(RadioGroupSizeContext)
  const resolvedSize = size ?? groupSize
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(radioGroupItemVariants({ size: resolvedSize }), className)}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="absolute inset-0 flex items-center justify-center"
      >
        <span
          className={cn(
            "rounded-full bg-radio-dot",
            radioDotSizeClasses[resolvedSize]
          )}
        />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem, radioGroupItemVariants }
export type { RadioGroupProps, RadioGroupItemProps, RadioGroupSize }

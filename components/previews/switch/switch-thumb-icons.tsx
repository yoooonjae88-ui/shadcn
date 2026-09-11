"use client"

import { Check, Moon, Sun, X } from "lucide-react"

import { Switch } from "@/registry/switch/switch"

export function SwitchThumbIconsExample() {
  return (
    <div className="flex items-center gap-6">
      <Switch
        size="lg"
        defaultChecked
        aria-label="Theme"
        thumbIconOn={<Moon />}
        thumbIconOff={<Sun />}
      />
      <Switch
        size="lg"
        aria-label="Confirm"
        variant="success"
        thumbIconOn={<Check />}
        thumbIconOff={<X />}
      />
    </div>
  )
}

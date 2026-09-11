"use client"

import { Check, X } from "lucide-react"

import { Switch } from "@/registry/switch/switch"

export function SwitchIndicatorsExample() {
  return (
    <div className="flex items-center gap-6">
      <Switch
        size="lg"
        defaultChecked
        aria-label="Power"
        indicatorOn={<Check />}
        indicatorOff={<X />}
      />
      <Switch
        size="lg"
        variant="mono"
        aria-label="Airplane mode"
        indicatorOn={<span className="text-[8px] font-bold">ON</span>}
        indicatorOff={<span className="text-[8px] font-bold">OFF</span>}
      />
    </div>
  )
}

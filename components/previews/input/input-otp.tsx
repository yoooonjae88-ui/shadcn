"use client"

import * as React from "react"

import { Input } from "@/registry/input/input"

export function InputOtpExample() {
  const [otp, setOtp] = React.useState("")

  return (
    <div className="flex flex-col gap-3">
      {otp && <p className="text-xs text-muted-foreground">entered: {otp}</p>}
      <Input.OTP length={6} onChange={setOtp} />
      <Input.OTP
        length={4}
        mask
        separator={<span className="text-muted-foreground">-</span>}
        formatter={(value) => value.toUpperCase()}
      />
    </div>
  )
}

"use client"

import { Info, User } from "lucide-react"

import { Input } from "@/registry/input/input"

export function InputPrefixSuffixExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Input prefix={<User />} placeholder="Username" />
      <Input prefix="￥" suffix="RMB" placeholder="Amount" defaultValue="128" />
      <Input suffix={<Info />} placeholder="With tooltip icon" />
    </div>
  )
}

"use client"

import { User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/registry/avatar/avatar"

export function AvatarFallbackExample() {
  return (
    <div className="flex items-center gap-4">
      {/* Invalid src → automatic initials fallback. An empty data URI fails
          to decode without firing a network request. */}
      <Avatar>
        <AvatarImage src="data:image/png;base64," alt="Marcus Lee" />
        <AvatarFallback>ML</AvatarFallback>
      </Avatar>
      {/* Icon fallback for unknown users */}
      <Avatar>
        <AvatarFallback>
          <User className="size-1/2" aria-label="Unknown user" />
        </AvatarFallback>
      </Avatar>
    </div>
  )
}

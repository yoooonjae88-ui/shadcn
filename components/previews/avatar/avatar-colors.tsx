"use client"

import { Avatar, AvatarFallback } from "@/registry/avatar/avatar"

export function AvatarColorsExample() {
  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarFallback className="bg-primary text-primary-foreground">
          AC
        </AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-secondary text-secondary-foreground">
          ML
        </AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-accent text-accent-foreground">
          PN
        </AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-destructive/10 text-destructive">
          SO
        </AvatarFallback>
      </Avatar>
    </div>
  )
}

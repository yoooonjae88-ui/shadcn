"use client"

import * as React from "react"

import { Text } from "@/registry/typography/typography"

export function TypographyEditableExample() {
  const [name, setName] = React.useState("Editable display name")

  return <Text editable={{ onChange: setName }}>{name}</Text>
}

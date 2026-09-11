import type * as React from "react"

export type PreviewExample = {
  /** Slug for the example, unique within its item. */
  name: string
  /** Heading shown above the example on the component page. */
  title: string
  component: React.ComponentType
  /** Repo-relative path of the source file shown in the code drawer. */
  file: string
}

"use client"

import { FolderOpen, Plus } from "lucide-react"

import { Button } from "@/registry/button/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/empty/empty"

// variant="outline" frames the state in a dashed border.
export function EmptyOutlineExample() {
  return (
    <Empty variant="outline" className="w-full max-w-sm">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderOpen aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>No projects</EmptyTitle>
        <EmptyDescription>
          Create your first project to organize your work into workspaces.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button variant="outline">Import</Button>
          <Button>
            <Plus aria-hidden="true" />
            New project
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  )
}

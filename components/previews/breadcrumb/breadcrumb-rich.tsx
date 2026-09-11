"use client"

import { FileText } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/registry/avatar/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/breadcrumb/breadcrumb"

// Richer, two-line crumbs for project / user / document info.
export function BreadcrumbRichExample() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="gap-3">
        <BreadcrumbItem>
          <BreadcrumbLink href="#" className="flex items-center gap-2">
            <Avatar size="xs" shape="square">
              <AvatarImage src="https://github.com/vercel.png" alt="Vercel" />
              <AvatarFallback>VC</AvatarFallback>
            </Avatar>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator>/</BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbLink href="#" className="flex items-center gap-2.5">
            <Avatar size="xs">
              <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="flex flex-col text-left">
              <span className="leading-tight font-medium text-foreground">shadcn</span>
              <span className="leading-tight text-muted-foreground">ui@shadcn.com</span>
            </span>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator>/</BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbPage className="flex items-center gap-2.5">
            <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
              <FileText className="size-3.5" />
            </span>
            <span className="flex flex-col text-left">
              <span className="leading-tight font-medium text-foreground">Document</span>
              <span className="leading-tight text-muted-foreground">agents.md</span>
            </span>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

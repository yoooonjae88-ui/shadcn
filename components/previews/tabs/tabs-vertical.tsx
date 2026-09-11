"use client"

import { CheckSquare, FileText, Folder, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/tabs/tabs"

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
      {children}
    </div>
  )
}

function Count({
  tone = "muted",
  children,
}: {
  tone?: "primary" | "destructive" | "muted"
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold",
        tone === "primary" && "bg-primary/10 text-primary",
        tone === "destructive" && "bg-destructive/10 text-destructive",
        tone === "muted" && "bg-muted-foreground/15 text-muted-foreground"
      )}
    >
      {children}
    </span>
  )
}

// A vertical line variant with icons and counts.
export function TabsVerticalExample() {
  return (
    <Tabs defaultValue="projects" orientation="vertical" className="w-full max-w-lg gap-5">
      <TabsList variant="line" className="w-48 shrink-0">
        <TabsTrigger value="projects">
          <Folder />
          Projects
          <Count tone="muted">8</Count>
        </TabsTrigger>
        <TabsTrigger value="tasks">
          <CheckSquare />
          Tasks
          <Count tone="primary">24</Count>
        </TabsTrigger>
        <TabsTrigger value="team">
          <Users />
          Team
        </TabsTrigger>
        <TabsTrigger value="reports">
          <FileText />
          Reports
        </TabsTrigger>
      </TabsList>
      <TabsContent value="projects">
        <Panel>8 projects are currently in progress across your workspace.</Panel>
      </TabsContent>
      <TabsContent value="tasks">
        <Panel>24 tasks need your attention this week.</Panel>
      </TabsContent>
      <TabsContent value="team">
        <Panel>Manage your team and their access permissions.</Panel>
      </TabsContent>
      <TabsContent value="reports">
        <Panel>View generated reports and export data.</Panel>
      </TabsContent>
    </Tabs>
  )
}

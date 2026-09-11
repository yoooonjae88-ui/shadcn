"use client"

import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/tabs/tabs"

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
      {children}
    </div>
  )
}

// A small inline count pill; colours resolve from theme tokens.
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
        "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold",
        tone === "primary" && "bg-primary/10 text-primary",
        tone === "destructive" && "bg-destructive/10 text-destructive",
        tone === "muted" && "bg-muted-foreground/15 text-muted-foreground"
      )}
    >
      {children}
    </span>
  )
}

// The line variant with inline badge counts.
export function TabsBadgesExample() {
  return (
    <Tabs defaultValue="inbox" className="w-full max-w-lg">
      <TabsList variant="line" className="mb-3.5 w-full">
        <TabsTrigger value="inbox">
          Inbox
          <Count tone="primary">12</Count>
        </TabsTrigger>
        <TabsTrigger value="drafts">
          Drafts
          <Count tone="muted">3</Count>
        </TabsTrigger>
        <TabsTrigger value="sent">Sent</TabsTrigger>
        <TabsTrigger value="spam">
          Spam
          <Count tone="destructive">24</Count>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="inbox">
        <Panel>12 unread messages in your inbox.</Panel>
      </TabsContent>
      <TabsContent value="drafts">
        <Panel>3 drafts waiting to be sent.</Panel>
      </TabsContent>
      <TabsContent value="sent">
        <Panel>All sent messages appear here.</Panel>
      </TabsContent>
      <TabsContent value="spam">
        <Panel>24 spam messages detected.</Panel>
      </TabsContent>
    </Tabs>
  )
}

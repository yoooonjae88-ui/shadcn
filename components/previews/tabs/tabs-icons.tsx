"use client"

import { BarChart3, LayoutDashboard, Settings } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/tabs/tabs"

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
      {children}
    </div>
  )
}

export function TabsIconsExample() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-lg">
      <TabsList className="w-full">
        <TabsTrigger value="overview">
          <LayoutDashboard />
          Overview
        </TabsTrigger>
        <TabsTrigger value="analytics">
          <BarChart3 />
          Analytics
        </TabsTrigger>
        <TabsTrigger value="settings">
          <Settings />
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Panel>Overview dashboard content goes here.</Panel>
      </TabsContent>
      <TabsContent value="analytics">
        <Panel>Analytics charts and metrics.</Panel>
      </TabsContent>
      <TabsContent value="settings">
        <Panel>Application settings and preferences.</Panel>
      </TabsContent>
    </Tabs>
  )
}

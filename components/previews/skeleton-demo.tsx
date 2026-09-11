"use client"

import type * as React from "react"

import {
  Skeleton,
  SkeletonCard,
  SkeletonCardGrid,
  SkeletonChat,
  SkeletonDialog,
  SkeletonForm,
  SkeletonList,
  SkeletonProfile,
  SkeletonStats,
  SkeletonTable,
  SkeletonText,
  SkeletonUserInfo,
} from "@/registry/skeleton/skeleton"

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex min-w-0 flex-col gap-4">
      <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {title}
      </h3>
      {children}
    </section>
  )
}

function ShapesDemo() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <Skeleton className="h-12 w-12 rounded-md" />
      <Skeleton className="h-4 flex-1" />
    </div>
  )
}

export function SkeletonDemo() {
  return (
    <div className="grid w-full max-w-4xl gap-x-10 gap-y-12 sm:grid-cols-2">
      <Section title="Shapes">
        <ShapesDemo />
      </Section>
      <Section title="Avatar & user info">
        <SkeletonUserInfo />
      </Section>
      <Section title="Text & paragraphs">
        <SkeletonText />
      </Section>
      <Section title="Form">
        <SkeletonForm />
      </Section>
      <Section title="Card">
        <SkeletonCard />
      </Section>
      <Section title="Card grid item">
        <SkeletonCardGrid />
      </Section>
      <Section title="Data table">
        <SkeletonTable />
      </Section>
      <Section title="Dashboard stats">
        <SkeletonStats />
      </Section>
      <Section title="List with actions">
        <SkeletonList />
      </Section>
      <Section title="Chat messages">
        <SkeletonChat />
      </Section>
      <Section title="Profile page">
        <SkeletonProfile />
      </Section>
      <Section title="Dialog feedback">
        <SkeletonDialog />
      </Section>
    </div>
  )
}

import { ComponentsSidebar } from "@/components/site/components-sidebar"
import { SiteHeader } from "@/components/site/site-header"
import { groupedRegistryItems } from "@/lib/registry-groups"

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const groups = groupedRegistryItems().map(([category, items]) => ({
    category,
    items: items.map(({ name, title }) => ({ name, title })),
  }))

  return (
    <>
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-screen-2xl flex-1 items-start gap-8 px-6">
        <aside className="sticky top-14 hidden max-h-[calc(100svh-3.5rem)] w-60 shrink-0 overflow-y-auto py-8 md:block">
          <ComponentsSidebar groups={groups} />
        </aside>
        <main className="min-w-0 flex-1 py-8">{children}</main>
      </div>
    </>
  )
}

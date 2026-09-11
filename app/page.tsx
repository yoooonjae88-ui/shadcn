import registry from "@/registry.json"
import { ComponentCard } from "@/components/site/component-card"
import { SiteHeader } from "@/components/site/site-header"
import { groupedRegistryItems } from "@/lib/registry-groups"

export default function Home() {
  const groups = groupedRegistryItems()

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col gap-12 px-6 py-12">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Components</h1>
          <p className="max-w-2xl text-muted-foreground">
            {registry.items.length} components served from this private
            registry. Click a component to browse its examples and copy the
            code.
          </p>
        </header>

        {groups.map(([category, items]) => (
          <section key={category} className="flex flex-col gap-5">
            <h2
              id={category.toLowerCase().replace(/\s+/g, "-")}
              className="text-xl font-semibold tracking-tight"
            >
              {category}
            </h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {items.map((item) => (
                <ComponentCard
                  key={item.name}
                  name={item.name}
                  title={item.title}
                />
              ))}
            </div>
          </section>
        ))}
      </main>
    </>
  )
}

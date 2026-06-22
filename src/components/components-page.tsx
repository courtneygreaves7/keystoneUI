import { useEffect, useState } from "react"
import { BookOpen, Layers, Palette, Search } from "lucide-react"

import { ComponentPreview, hasComponentPreview } from "@/components/components-doc/component-previews"
import {
  CodeBlock,
  ComponentDocBlock,
  DocCallout,
  PropsTable,
} from "@/components/components-doc/doc-primitives"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  componentCategories,
  componentsCatalog,
  figureStyleTokens,
  uiPrimitivesCatalog,
} from "@/lib/components-catalog"
import { cn } from "@/lib/utils"

function TableOfContents({
  activeId,
  onNavigate,
}: {
  activeId: string
  onNavigate: (id: string) => void
}) {
  return (
    <nav className="space-y-6 text-sm">
      {componentCategories.map((category) => {
        const items = componentsCatalog.filter((entry) => entry.category === category.id)

        if (items.length === 0) return null

        return (
          <div key={category.id}>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {category.title}
            </p>
            <ul className="space-y-0.5">
              {items.map((entry) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(entry.id)}
                    className={cn(
                      "w-full rounded-md px-2 py-1.5 text-left text-[13px] transition-colors hover:bg-accent",
                      activeId === entry.id
                        ? "bg-accent font-medium text-accent-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {entry.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )
      })}

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Reference
        </p>
        <ul className="space-y-0.5">
          {["ui-primitives", "design-tokens"].map((id) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => onNavigate(id)}
                className={cn(
                  "w-full rounded-md px-2 py-1.5 text-left text-[13px] transition-colors hover:bg-accent",
                  activeId === id
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                {id === "ui-primitives" ? "UI primitives" : "Design tokens"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export function ComponentsPage() {
  const [query, setQuery] = useState("")
  const [activeId, setActiveId] = useState(componentsCatalog[0]?.id ?? "")

  const normalizedQuery = query.trim().toLowerCase()

  const filteredCatalog = componentsCatalog.filter((entry) => {
    if (!normalizedQuery) return true
    const haystack = [
      entry.name,
      entry.description,
      entry.whenToUse,
      entry.filePath,
      ...entry.props.map((prop) => `${prop.name} ${prop.description}`),
    ]
      .join(" ")
      .toLowerCase()
    return haystack.includes(normalizedQuery)
  })

  const filteredCategories = componentCategories
    .map((category) => ({
      ...category,
      entries: filteredCatalog.filter((entry) => entry.category === category.id),
    }))
    .filter((category) => category.entries.length > 0)

  function scrollToSection(id: string) {
    setActiveId(id)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  useEffect(() => {
    const sections = [
      ...componentsCatalog.map((entry) => entry.id),
      "ui-primitives",
      "design-tokens",
    ]

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) {
          setActiveId(visible.target.id)
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5] }
    )

    sections.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [filteredCatalog.length])

  return (
    <TooltipProvider>
      <div className="mx-auto flex max-w-6xl gap-10 pb-16">
        {/* Sidebar — Notion-style page nav */}
        <aside className="hidden w-52 shrink-0 lg:block">
          <div className="sticky top-8 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <BookOpen className="size-4 text-muted-foreground" />
              <span>On this page</span>
            </div>
            <TableOfContents activeId={activeId} onNavigate={scrollToSection} />
          </div>
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1 space-y-10">
          {/* Page header */}
          <header className="space-y-4 border-b border-border pb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Layers className="size-4" />
              <span>Keystone design system</span>
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Components</h1>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                A living library of Keystone UI components — stored, documented, and refined here.
                Each entry includes a preview, props reference, usage example, and source file for
                developers.
              </p>
            </div>

            <div className="relative max-w-md">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search components, props, or files…"
                className="pl-9"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {componentCategories.map((category) => (
                <span
                  key={category.id}
                  className="rounded-md border border-border bg-muted/30 px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {category.title}
                </span>
              ))}
            </div>
          </header>

          {/* Category sections */}
          {filteredCategories.length === 0 ? (
            <DocCallout>No components match &ldquo;{query}&rdquo;.</DocCallout>
          ) : (
            filteredCategories.map((category) => (
              <section key={category.id} id={category.id} className="scroll-mt-24 space-y-8">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold tracking-tight">{category.title}</h2>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>

                <div className="space-y-12">
                  {category.entries.map((entry) => (
                    <ComponentDocBlock
                      key={entry.id}
                      entry={entry}
                      preview={
                        hasComponentPreview(entry.id) ? (
                          <ComponentPreview id={entry.id} />
                        ) : undefined
                      }
                    />
                  ))}
                </div>
              </section>
            ))
          )}

          <Separator />

          {/* UI primitives */}
          <section id="ui-primitives" className="scroll-mt-24 space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Palette className="size-5 text-muted-foreground" />
                <h2 className="text-xl font-semibold tracking-tight">UI primitives</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                ShadCN components in{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">src/components/ui/</code>.
                Extend these rather than adding one-off styles.
              </p>
            </div>

            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                      Component
                    </th>
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">File</th>
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                      Exports / variants
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {uiPrimitivesCatalog.map((item) => (
                    <tr key={item.name} className="border-b border-border last:border-b-0">
                      <td className="px-4 py-3 font-medium">{item.name}</td>
                      <td className="px-4 py-3">
                        <code className="text-xs text-muted-foreground">{item.filePath}</code>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{item.variants}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <CodeBlock
              code={`import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>
    <Button variant="outline" size="sm">Action</Button>
  </CardContent>
</Card>`}
            />
          </section>

          <Separator />

          {/* Design tokens */}
          <section id="design-tokens" className="scroll-mt-24 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight">Design tokens</h2>
              <p className="text-sm text-muted-foreground">
                Shared typography and layout constants used across widgets and charts.
              </p>
            </div>

            <PropsTable
              props={figureStyleTokens.map((token) => ({
                name: token.name,
                type: "string | number",
                description: `${token.usage} — \`${token.value}\``,
              }))}
            />

            <CodeBlock
              code={`import { FIGURE_20PX_CLASS, FIGURE_30PX_CLASS } from "@/lib/figure-styles"
import { CHART_HEIGHT } from "@/lib/chart-styles"

<HeadlineDataWidget valueClassName={FIGURE_20PX_CLASS} ... />
<ResponsiveContainer width="100%" height={CHART_HEIGHT} />`}
            />
          </section>
        </div>
      </div>
    </TooltipProvider>
  )
}

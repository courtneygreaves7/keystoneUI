import { useEffect, useState } from "react"
import { BookOpen, Palette, Search } from "lucide-react"

import { ComponentDocBlock, CodeBlock, DocCallout, PropsTable } from "@/components/components-doc/doc-primitives"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  componentCategories,
  componentsCatalog,
  figureStyleTokens,
} from "@/lib/components-catalog"
import { componentsCatalogExtra } from "@/lib/components-catalog-extra"
import {
  colorPaletteTokens,
  typographyScale,
  typographyTokens,
} from "@/lib/design-foundations"
import { cn } from "@/lib/utils"

const fullCatalog = [...componentsCatalog, ...componentsCatalogExtra]

const referenceNavItems = [
  { id: "color-palette", label: "Colour palette" },
  { id: "typography", label: "Typography" },
  { id: "design-tokens", label: "Design tokens" },
]

const navSections = [
  ...componentCategories.map((category) => ({
    id: category.id,
    title: category.title,
    items: fullCatalog
      .filter((entry) => entry.category === category.id)
      .map((entry) => ({ id: entry.id, label: entry.name })),
  })),
  {
    id: "reference",
    title: "Reference",
    items: referenceNavItems,
  },
].filter((section) => section.items.length > 0)

const colorGroups = ["Brand", "Surface", "Action", "UI", "Semantic"] as const

function ColorSwatch({ token }: { token: (typeof colorPaletteTokens)[number] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="h-14 w-full border-b border-border" style={{ backgroundColor: `var(${token.variable})` }} />
      <div className="space-y-1 p-3">
        <p className="text-sm font-medium">{token.name}</p>
        <p className="font-mono text-[11px] text-muted-foreground">{token.variable}</p>
        <p className="font-mono text-[11px] text-muted-foreground">{token.hex}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">{token.usage}</p>
      </div>
    </div>
  )
}

function TableOfContents({
  activeId,
  onNavigate,
}: {
  activeId: string
  onNavigate: (id: string) => void
}) {
  return (
    <nav className="space-y-0 text-sm">
      {navSections.map((section, index) => (
        <div
          key={section.id}
          className={cn(
            "py-3",
            index > 0 && "border-t border-border"
          )}
        >
          <button
            type="button"
            onClick={() =>
              onNavigate(
                section.id === "reference" ? referenceNavItems[0].id : section.id
              )
            }
            className={cn(
              "mb-2 w-full rounded-md px-2 py-1 text-left text-[11px] font-semibold uppercase tracking-wider transition-colors hover:bg-accent hover:text-foreground",
              activeId === section.id ||
                (section.id === "reference" &&
                  referenceNavItems.some((item) => item.id === activeId))
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            {section.title}
          </button>
          <ul className="space-y-0.5">
            {section.items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    "w-full rounded-md py-1.5 pr-2 pl-3 text-left text-[13px] transition-colors hover:bg-accent",
                    activeId === item.id
                      ? "bg-accent font-medium text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export function ComponentsPage() {
  const [query, setQuery] = useState("")
  const [activeId, setActiveId] = useState(fullCatalog[0]?.id ?? "")

  const normalizedQuery = query.trim().toLowerCase()

  const filteredCatalog = fullCatalog.filter((entry) => {
    if (!normalizedQuery) return true
    const haystack = [
      entry.name,
      entry.description,
      entry.whenToUse,
      entry.filePath,
      entry.category,
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
      ...componentCategories.map((category) => category.id),
      ...fullCatalog.map((entry) => entry.id),
      ...referenceNavItems.map((item) => item.id),
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
  }, [])

  return (
    <TooltipProvider>
      <div className="mx-auto max-w-6xl pb-16">
        <div className="flex gap-10">
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-8 flex max-h-[calc(100vh-2rem)] flex-col">
              <div className="flex h-9 shrink-0 items-center gap-2 text-sm font-medium">
                <BookOpen className="size-4 text-muted-foreground" />
                <span>On this page</span>
              </div>
              <div className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-2 [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border">
                <TableOfContents activeId={activeId} onNavigate={scrollToSection} />
              </div>
            </div>
          </aside>

          <div className="min-w-0 flex-1 space-y-10">
            <header className="space-y-4 border-b border-border pb-8">
              <div className="flex h-9 items-center gap-2 text-sm text-muted-foreground">
                <Palette className="size-4 shrink-0" />
                <span>Keystone design system</span>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight leading-9">Design system</h1>
              <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                Colours, typography, tokens, and a living library of every Keystone component —
                documented with live previews, props, usage examples, and source files.
              </p>

              <div className="relative max-w-md">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search components, tokens, or files…"
                  className="pl-9"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                {fullCatalog.length} components documented
              </p>
            </header>

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
                    <ComponentDocBlock key={entry.id} entry={entry} />
                  ))}
                </div>
              </section>
            ))
          )}

          <Separator />

          <section id="color-palette" className="scroll-mt-24 space-y-8">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight">Colour palette</h2>
              <p className="text-sm text-muted-foreground">
                CSS custom properties defined in <code className="text-xs">src/index.css</code>.
                Swatches reflect the active theme (light or dark).
              </p>
            </div>

            {colorGroups.map((group) => {
              const tokens = colorPaletteTokens.filter((token) => token.group === group)
              if (tokens.length === 0) return null

              return (
                <div key={group} className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {group}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {tokens.map((token) => (
                      <ColorSwatch key={token.variable} token={token} />
                    ))}
                  </div>
                </div>
              )
            })}

            <CodeBlock
              code={`/* Brand */
--brand-pink: #ee2a7b;
--brand-dark-blue: #243748;

/* Surfaces */
--background: #ffffff;
--foreground: #18181b;

/* Use in Tailwind */
<div className="bg-background text-foreground border-border" />
<div style={{ color: "var(--brand-pink)" }} />`}
            />
          </section>

          <Separator />

          <section id="typography" className="scroll-mt-24 space-y-8">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight">Typography</h2>
              <p className="text-sm text-muted-foreground">
                Plus Jakarta Sans is the primary typeface across Keystone, loaded from Google Fonts.
              </p>
            </div>

            <div className="rounded-lg border border-border p-6">
              <p className="text-sm font-medium text-muted-foreground">Font family</p>
              <p className="mt-2 text-4xl font-semibold tracking-tight">{typographyTokens.fontFamily}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {typographyTokens.fallback}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {typographyTokens.weights.map((weight) => (
                  <span
                    key={weight}
                    className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium"
                    style={{ fontWeight: weight }}
                  >
                    {weight}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {typographyScale.map((entry) => (
                <div
                  key={entry.name}
                  className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className={entry.className}>{entry.sample}</p>
                  </div>
                  <div className="shrink-0 space-y-1 sm:max-w-xs sm:text-right">
                    <p className="text-sm font-medium">{entry.name}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{entry.className}</p>
                    <p className="text-xs text-muted-foreground">{entry.specs}</p>
                    <p className="text-xs text-muted-foreground">{entry.usage}</p>
                  </div>
                </div>
              ))}
            </div>

            <CodeBlock
              code={`/* index.css */
@theme inline {
  --font-sans: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
}

/* index.html */
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" />

import { FIGURE_20PX_CLASS, FIGURE_30PX_CLASS } from "@/lib/figure-styles"`}
            />
          </section>

          <Separator />

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
      </div>
    </TooltipProvider>
  )
}

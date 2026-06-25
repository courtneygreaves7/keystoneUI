import { useId, useMemo, useState, type ReactNode } from "react"
import { Search, Tag } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { PartnerBookingsTable } from "@/components/booking-engine/partner-bookings-table"
import { PolicyRatesTable } from "@/components/booking-engine/policy-rates-table"
import { PropertiesTable } from "@/components/booking-engine/properties-table"
import { Input } from "@/components/ui/input"
import {
  formatCompactCount,
  formatCompactCurrency,
  formatCount,
  getBookingsForPartner,
  getPartnerBookingTrend,
  getPartnerTags,
  type Partner,
} from "@/lib/booking-engine-data"
import { getPropertiesForPartner, type PropertyListItem } from "@/lib/properties-list-data"
import { cn } from "@/lib/utils"

export type PartnerDetailTab =
  | "overview"
  | "brands"
  | "rates"
  | "bookings"
  | "properties"

type PartnerDetailPanelProps = {
  partner: Partner
  onViewProperty: (propertyId: string) => void
  activeTab: PartnerDetailTab
  onTabChange: (tab: PartnerDetailTab) => void
}

const TAB_ITEMS: { id: PartnerDetailTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "brands", label: "Brands" },
  { id: "rates", label: "Policy rates" },
  { id: "bookings", label: "Bookings" },
  { id: "properties", label: "Properties" },
]

function PartnerTag({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded border border-border bg-muted/30 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
      {label}
    </span>
  )
}

function PartnerStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums text-foreground">{value}</p>
    </div>
  )
}

function TabSummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col justify-center px-5 py-4">
      <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1.5 text-2xl font-semibold tracking-tight tabular-nums text-foreground">
        {value}
      </p>
    </div>
  )
}

function TabSearchInput({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative w-full sm:min-w-[220px] sm:max-w-xs">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input className="h-10 bg-background pl-9 text-xs" placeholder={placeholder} />
    </div>
  )
}

function TabSummaryBar({
  metrics,
  searchPlaceholder,
}: {
  metrics: { label: string; value: string }[]
  searchPlaceholder: string
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
      <div className="grid min-w-0 flex-1 grid-cols-1 divide-y divide-border overflow-hidden rounded-lg border border-border bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {metrics.map((metric) => (
          <TabSummaryMetric key={metric.label} label={metric.label} value={metric.value} />
        ))}
      </div>
      <div className="flex shrink-0 items-center lg:w-64">
        <TabSearchInput placeholder={searchPlaceholder} />
      </div>
    </div>
  )
}

function SectionCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn("rounded-lg border border-border bg-card", className)}>
      <div className="border-b border-border/60 px-4 py-3">
        <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
          {title}
        </p>
        {subtitle ? <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p> : null}
      </div>
      <div className="p-4">{children}</div>
    </section>
  )
}

function OverviewTab({ partner }: { partner: Partner }) {
  const gradientId = `pas-trend-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`
  const trend = getPartnerBookingTrend(partner.id)
  const activePolicies = partner.policies.filter((policy) => policy.status === "active")

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_240px]">
      <SectionCard title="Booking trend" subtitle="12-month volume">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">Daily booking volume</p>
          <span className="rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            +12.0% YoY
          </span>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--foreground)" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="var(--foreground)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                width={32}
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                tickFormatter={(value) => `${value}k`}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--foreground)"
                strokeWidth={1.5}
                fill={`url(#${gradientId})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <div className="flex flex-col gap-4">
        <SectionCard title="Brands">
          <ul className="space-y-3">
            {partner.brands.map((brand) => (
              <li key={brand.id} className="flex items-start gap-2">
                <Tag className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{brand.name}</p>
                  <p className="text-xs text-muted-foreground">{brand.policyGroup}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Active policies">
          <ul className="space-y-3">
            {activePolicies.map((policy) => (
              <li key={policy.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-xs text-foreground">
                    {policy.validFrom} → {policy.validTo}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xs font-medium tabular-nums text-muted-foreground">
                    {policy.calCommission.toFixed(1)}%
                  </span>
                  <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {policy.currency}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  )
}

function RatesTab({ partner }: { partner: Partner }) {
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(
    partner.brands[0]?.id ?? null
  )

  return (
    <div className="grid min-h-[420px] gap-0 overflow-hidden rounded-lg border border-border lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="flex flex-col gap-4 border-b border-border bg-muted/20 p-4 lg:border-r lg:border-b-0">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            Currencies
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {partner.currencies.map((currency) => (
              <span
                key={currency}
                className="rounded-md border border-border bg-background px-2 py-0.5 text-xs font-medium"
              >
                {currency}
              </span>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1">
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            Brands
          </p>
          <ul className="mt-2 space-y-1.5">
            {partner.brands.map((brand) => (
              <li key={brand.id}>
                <button
                  type="button"
                  onClick={() => setSelectedBrandId(brand.id)}
                  className={cn(
                    "w-full rounded-lg px-3 py-2.5 text-left transition-colors",
                    selectedBrandId === brand.id
                      ? "bg-muted ring-1 ring-foreground/15"
                      : "hover:bg-muted/50"
                  )}
                >
                  <p className="text-sm font-semibold text-foreground">{brand.name}</p>
                  <p className="text-xs text-muted-foreground">{brand.policyGroup}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="min-w-0 bg-[var(--panel-bg)] p-5 dark:bg-canvas">
        <p className="mb-4 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          Policy rates
        </p>
        <PolicyRatesTable policies={partner.policies} selectedBrandId={selectedBrandId} />
      </div>
    </div>
  )
}

function BrandsTab({ partner }: { partner: Partner }) {
  return (
    <div className="space-y-4">
      {partner.brands.map((brand) => {
        const brandPolicies = partner.policies.filter((policy) => policy.brandId === brand.id)
        const activeCount = brandPolicies.filter((policy) => policy.status === "active").length
        const expiredCount = brandPolicies.length - activeCount

        return (
          <section key={brand.id} className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 px-5 py-4">
              <div>
                <p className="text-base font-semibold text-foreground">{brand.name}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">Policy: {brand.policyGroup}</p>
              </div>
              <p className="text-sm font-medium text-foreground">
                {activeCount} active · {expiredCount} expired
              </p>
            </div>
            <div className="p-4">
              <PolicyRatesTable policies={brandPolicies} selectedBrandId={brand.id} compact />
            </div>
          </section>
        )
      })}
    </div>
  )
}

function BookingsTab({ partner }: { partner: Partner }) {
  const bookings = getBookingsForPartner(partner.id)
  const [filter, setFilter] = useState<"all" | "cal" | "confirmed">("all")

  const filtered = useMemo(() => {
    return bookings.filter((booking) => {
      if (filter === "cal") return booking.hasCal
      if (filter === "confirmed") return booking.status === "confirmed"
      return true
    })
  }, [bookings, filter])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: "all", label: `All (${bookings.length})` },
              { id: "cal", label: `CAL (${bookings.filter((b) => b.hasCal).length})` },
              {
                id: "confirmed",
                label: `Confirmed (${bookings.filter((b) => b.status === "confirmed").length})`,
              },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                filter === item.id
                  ? "border-foreground/20 bg-muted text-foreground"
                  : "border-border bg-background text-muted-foreground hover:bg-muted/40"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <TabSearchInput placeholder="Search bookings…" />
      </div>
      <PartnerBookingsTable bookings={filtered} />
    </div>
  )
}

function PropertiesTab({
  partner,
  properties,
  onViewProperty,
}: {
  partner: Partner
  properties: PropertyListItem[]
  onViewProperty: (propertyId: string) => void
}) {
  const listedBookings = properties.reduce((sum, property) => sum + property.bookings, 0)

  return (
    <div className="space-y-4">
      <TabSummaryBar
        searchPlaceholder="Search properties…"
        metrics={[
          { label: "Properties", value: formatCount(properties.length) },
          { label: "Bookings", value: formatCount(partner.activity.bookings) },
          { label: "With CAL", value: formatCount(partner.activity.withCal) },
        ]}
      />
      <PropertiesTable properties={properties} onViewProperty={onViewProperty} embedded />
      <p className="text-xs text-muted-foreground">
        {formatCount(listedBookings)} bookings across listed properties
      </p>
    </div>
  )
}

export function PartnerDetailPanel({
  partner,
  onViewProperty,
  activeTab,
  onTabChange,
}: PartnerDetailPanelProps) {
  const properties = getPropertiesForPartner(partner.id)
  const bookings = getBookingsForPartner(partner.id)
  const tags = getPartnerTags(partner)

  const tabCounts: Record<PartnerDetailTab, number | null> = {
    overview: null,
    brands: partner.brands.length,
    rates: partner.policies.length,
    bookings: bookings.length,
    properties: properties.length,
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground">
              {partner.initials.slice(0, 2)}
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-foreground">{partner.name}</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <PartnerTag key={tag} label={tag} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <PartnerStat label="Bookings" value={formatCompactCount(partner.activity.bookings)} />
            <PartnerStat
              label="Revenue"
              value={formatCompactCurrency(partner.activity.revenue)}
            />
            <PartnerStat label="CAL" value={formatCount(partner.activity.withCal)} />
            <PartnerStat label="Brands" value={String(partner.brands.length)} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1 border-b border-border/60 pb-0">
          {TAB_ITEMS.map((tab) => {
            const count = tabCounts[tab.id]
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-t-lg px-4 py-2.5 transition-colors",
                  isActive
                    ? "bg-muted/70 text-foreground"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "font-medium",
                    tab.id === "overview" ? "text-sm" : "text-sm font-semibold"
                  )}
                >
                  {tab.label}
                </span>
                {count != null ? (
                  <span
                    className={cn(
                      "min-w-[1.25rem] rounded-md px-1.5 py-0.5 text-center text-xs font-bold tabular-nums",
                      isActive
                        ? "bg-foreground/10 text-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {count}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {activeTab === "overview" ? <OverviewTab partner={partner} /> : null}
        {activeTab === "brands" ? <BrandsTab partner={partner} /> : null}
        {activeTab === "rates" ? <RatesTab partner={partner} /> : null}
        {activeTab === "bookings" ? <BookingsTab partner={partner} /> : null}
        {activeTab === "properties" ? (
          <PropertiesTab
            partner={partner}
            properties={properties}
            onViewProperty={onViewProperty}
          />
        ) : null}
      </div>
    </div>
  )
}

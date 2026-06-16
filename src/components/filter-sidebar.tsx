import { useState } from "react"
import { Ban, RefreshCw, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ActiveFilters } from "@/lib/chart-data"
import { SectionNav } from "@/components/section-nav"

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const metricOptions = [
  { label: "Sales", value: "sales", icon: TrendingUp },
  { label: "Cancellations", value: "cancellations", icon: Ban },
  { label: "Re-lets", value: "re-lets", icon: RefreshCw },
] as const

type FilterSidebarProps = {
  onRun: (filters: ActiveFilters) => void
  hasRun: boolean
}

export function FilterSidebar({ onRun, hasRun }: FilterSidebarProps) {
  const [partner, setPartner] = useState("all-partners")
  const [brand, setBrand] = useState("all-brands")
  const [dateRange, setDateRange] = useState("year-to-month-end")
  const [year, setYear] = useState("2026")
  const [month, setMonth] = useState("June")
  const [metric, setMetric] = useState<(typeof metricOptions)[number]["value"]>("sales")
  const [sortBy, setSortBy] = useState("revenue-desc")

  function handleRun() {
    onRun({ partner, brand, dateRange, year, month, metric, sortBy })
  }

  return (
    <aside className="relative flex min-h-0 flex-col overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-px bg-border" />

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
        <div>
          <h2 className="text-sm font-semibold">Filters</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Refine metrics by partner, brand, and period.
          </p>
        </div>

        <div className="space-y-3">
          <Label htmlFor="partner-filter">Partner</Label>
          <Select value={partner} onValueChange={setPartner}>
            <SelectTrigger id="partner-filter">
              <SelectValue placeholder="Select partner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-partners">All partners</SelectItem>
              <SelectItem value="partner-a">Partner A</SelectItem>
              <SelectItem value="partner-b">Partner B</SelectItem>
              <SelectItem value="partner-c">Partner C</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label htmlFor="brand-filter">Brand</Label>
          <Select value={brand} onValueChange={setBrand}>
            <SelectTrigger id="brand-filter">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-brands">All brands</SelectItem>
              <SelectItem value="brand-a">Brand A</SelectItem>
              <SelectItem value="brand-b">Brand B</SelectItem>
              <SelectItem value="brand-c">Brand C</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label htmlFor="date-range-filter">Date range</Label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger id="date-range-filter">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="calendar-month">Calendar month</SelectItem>
              <SelectItem value="year-to-month-end">Year to month-end</SelectItem>
              <SelectItem value="custom-range">Custom range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-3">
            <Label htmlFor="year-filter">Year</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger id="year-filter">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="month-filter">Month</Label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger id="month-filter">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((monthName) => (
                  <SelectItem key={monthName} value={monthName}>
                    {monthName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h2 className="text-sm font-semibold">Metrics</h2>
          <div className="flex flex-col gap-2">
            {metricOptions.map(({ label, value, icon: Icon }) => (
              <Button
                key={value}
                type="button"
                variant={metric === value ? "default" : "outline"}
                className="w-full justify-start gap-2"
                onClick={() => setMetric(value)}
              >
                <Icon className="size-3.5 shrink-0" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 id="sort-filter-heading" className="text-sm font-semibold">
            Sort by
          </h2>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger id="sort-filter" aria-labelledby="sort-filter-heading">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue-desc">Revenue (high to low)</SelectItem>
              <SelectItem value="revenue-asc">Revenue (low to high)</SelectItem>
              <SelectItem value="partner-name">Partner name</SelectItem>
              <SelectItem value="date-desc">Date (newest first)</SelectItem>
              <SelectItem value="date-asc">Date (oldest first)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="shrink-0">
        {hasRun && <SectionNav />}
        <div className="relative px-6 pb-6">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border" />
          <div className="pt-4">
            <Button className="w-full" onClick={handleRun}>Run</Button>
          </div>
        </div>
      </div>
    </aside>
  )
}

import { useState } from "react"
import { BarChart3, Ban, CalendarDays, ChevronLeft, ChevronRight, Filter, Play, RefreshCw, SlidersHorizontal, Tag, TrendingUp } from "lucide-react"

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
  open: boolean
  onToggle: () => void
  onRun: (filters: ActiveFilters) => void
}

export function FilterSidebar({ open, onToggle, onRun }: FilterSidebarProps) {
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
    <aside className="relative flex min-h-0 flex-col border-l border-border bg-card">
      <button
        type="button"
        aria-label={open ? "Collapse right sidebar" : "Expand right sidebar"}
        onClick={onToggle}
        className="absolute top-[calc(50vh-4rem)] left-0 z-20 flex h-16 w-5 -translate-x-full -translate-y-1/2 items-center justify-center rounded-l-md border border-r-0 border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
      >
        {open ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
      </button>

      {!open && (
        <div className="flex flex-col items-center gap-3 pt-5">
          <span title="Partner"><Filter className="size-4 text-muted-foreground" /></span>
          <span title="Brand"><Tag className="size-4 text-muted-foreground" /></span>
          <span title="Date range"><CalendarDays className="size-4 text-muted-foreground" /></span>
          <span title="Year / Month"><SlidersHorizontal className="size-4 text-muted-foreground" /></span>
          <Separator className="w-6" />
          <span title="Metrics"><BarChart3 className="size-4 text-muted-foreground" /></span>
          <Separator className="w-6" />
          <button
            type="button"
            onClick={handleRun}
            title="Run report"
            className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Play className="size-3.5" />
          </button>
        </div>
      )}

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6 data-[hidden=true]:hidden" data-hidden={!open}>
        <div>
          <h2 className="text-sm font-semibold">Filters</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Refine metrics by partner, brand, and period.
          </p>
        </div>

        <div className="space-y-2">
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

        <div className="space-y-2">
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

        <div className="space-y-2">
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
          <div className="space-y-2">
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

          <div className="space-y-2">
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

        <div className="space-y-2">
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

        <div className="space-y-2">
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

      <div className="border-t border-border p-6 data-[hidden=true]:hidden" data-hidden={!open}>
        <Button className="w-full" onClick={handleRun}>Run</Button>
      </div>
    </aside>
  )
}

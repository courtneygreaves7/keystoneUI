import { useRef, useState, type ReactNode } from "react"
import {
  CalendarCheck,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  FileText,
  Gauge,
  Info,
  Percent,
  PoundSterling,
  Timer,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import { getPartnerRows } from "@/components/bookings-snapshot"
import { AbvPerDayChart } from "@/components/charts/abv-per-day-chart"
import { BookingsMadePerDayChart } from "@/components/charts/bookings-made-per-day-chart"
import { BookingsVsStaysChart } from "@/components/charts/bookings-vs-stays-chart"
import { CalDdlTakeupChart } from "@/components/charts/cal-ddl-takeup-chart"
import { LeadTimeChart } from "@/components/charts/lead-time-chart"
import { DashboardFilterBar } from "@/components/dashboard-filter-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { buildSnapshotFilename, exportElementSnapshot } from "@/lib/export-snapshot"
import {
  type ActiveFilters,
  getAbvProfile,
  getBookingProfile,
  getCalFinProfile,
  getTimingProfile,
} from "@/lib/chart-data"

type InsightsDashboardPageProps = {
  filters: ActiveFilters
  hasRun: boolean
  onRun: (filters: ActiveFilters) => void
}

type KpiCard = {
  label: string
  value: string
  subtext?: string
  icon: LucideIcon
  description: string
}

type DashboardSlide = {
  id: string
  title: string
  content: ReactNode
}

function DashboardKpiCard({ label, value, subtext, icon: Icon, description }: KpiCard) {
  return (
    <Card className="bg-card shadow-xs">
      <CardContent className="relative p-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="absolute top-3 right-3 shrink-0 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={`More information about ${label}`}
            >
              <Info className="size-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>{description}</TooltipContent>
        </Tooltip>
        <div className="grid size-7 place-items-center rounded-md bg-muted text-muted-foreground">
          <Icon className="size-3.5" />
        </div>
        <p className="mt-2 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className="mt-2 text-xl font-medium tracking-tight tabular-nums">{value}</p>
        <p className="mt-1 min-h-4 text-[11px] text-muted-foreground">{subtext ?? "\u00a0"}</p>
      </CardContent>
    </Card>
  )
}

function KpiGrid({ kpis, columns }: { kpis: KpiCard[]; columns: string }) {
  return (
    <TooltipProvider>
      <div className={cn("grid gap-3", columns)}>
        {kpis.map((kpi) => (
          <DashboardKpiCard key={kpi.label} {...kpi} />
        ))}
      </div>
    </TooltipProvider>
  )
}

function DashboardPanel({
  slides,
  className,
}: {
  slides: DashboardSlide[]
  className?: string
}) {
  const [index, setIndex] = useState(0)
  const current = slides[index]

  function goPrev() {
    setIndex((i) => (i === 0 ? slides.length - 1 : i - 1))
  }

  function goNext() {
    setIndex((i) => (i === slides.length - 1 ? 0 : i + 1))
  }

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xs",
        className
      )}
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-border px-3 py-2.5">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-7 shrink-0"
          onClick={goPrev}
          aria-label="Previous section"
        >
          <ChevronLeft className="size-3.5" />
        </Button>

        <div className="min-w-0 flex-1 text-center">
          <h2 className="truncate text-sm font-semibold">{current.title}</h2>
          <p className="text-[10px] text-muted-foreground">
            {index + 1} of {slides.length}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-7 shrink-0"
          onClick={goNext}
          aria-label="Next section"
        >
          <ChevronRight className="size-3.5" />
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--panel-bg)]">
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4" data-snapshot-scroll>
          <div className="w-full">{current.content}</div>
        </div>
      </div>
    </div>
  )
}

function DashboardGrid({
  topLeftSlides,
  topRightSlides,
  bottomSlides,
}: {
  topLeftSlides: DashboardSlide[]
  topRightSlides: DashboardSlide[]
  bottomSlides: DashboardSlide[]
}) {
  return (
    <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-[minmax(0,1fr)_minmax(0,1.15fr)] gap-3">
      <DashboardPanel slides={topLeftSlides} className="min-h-0" />
      <DashboardPanel slides={topRightSlides} className="min-h-0" />
      <DashboardPanel slides={bottomSlides} className="col-span-2 min-h-0" />
    </div>
  )
}

function formatFilterLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function InsightsDashboardPage({ filters, hasRun, onRun }: InsightsDashboardPageProps) {
  const snapshotRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const booking = getBookingProfile(filters)
  const abv = getAbvProfile(filters)
  const calFin = getCalFinProfile(filters)
  const timing = getTimingProfile(filters)
  const partnerRows = getPartnerRows(filters)

  const bookingKpis: KpiCard[] = [
    {
      label: "Total bookings",
      value: booking.total,
      icon: CalendarCheck,
      description: "Total number of bookings across all selected partners and brands.",
    },
    {
      label: "CAL sales",
      value: booking.calSales,
      icon: TrendingUp,
      description: "Sales completed through the CAL payment method for the selected period.",
    },
    {
      label: "CAL take-up %",
      value: booking.calPct,
      icon: Percent,
      description: "Percentage of eligible bookings that converted to CAL sales.",
    },
    {
      label: "DDL sales",
      value: booking.ddlSales,
      icon: CreditCard,
      description: "Sales completed through direct debit (DDL) for the selected period.",
    },
    {
      label: "DDL take-up %",
      value: booking.ddlPct,
      icon: Gauge,
      description: "Percentage of eligible bookings that converted to DDL sales.",
    },
  ]

  const abvKpis: KpiCard[] = [
    {
      label: "ABV (excl. fee) GBP",
      value: abv.gbpAbv,
      subtext: abv.gbpCal,
      icon: Wallet,
      description: "Average booking value excluding the booking fee, in GBP.",
    },
    {
      label: "ABV (excl. fee) EUR",
      value: abv.eurAbv,
      subtext: abv.eurCal,
      icon: Wallet,
      description: "Average booking value excluding the booking fee, in EUR.",
    },
    {
      label: "ABV inc. fee GBP",
      value: abv.gbpAbvFee,
      subtext: abv.gbpCalFee,
      icon: FileText,
      description: "Average booking value including the booking fee, in GBP.",
    },
    {
      label: "ABV inc. fee EUR",
      value: abv.eurAbvFee,
      subtext: abv.eurCalFee,
      icon: FileText,
      description: "Average booking value including the booking fee, in EUR.",
    },
    {
      label: "CAL customer price",
      value: abv.calPct,
      subtext: "% of ABV inc. booking fee",
      icon: Percent,
      description: "Share of customer price against ABV including booking fee.",
    },
  ]

  const calFinancialKpis: KpiCard[] = [
    {
      label: "Total payable",
      value: calFin.totalPayable,
      icon: PoundSterling,
      description: "Total amount payable to partners in GBP for the selected period.",
    },
    {
      label: "IPT",
      value: calFin.ipt,
      icon: PoundSterling,
      description: "Insurance premium tax amount in GBP for the selected period.",
    },
    {
      label: "PISL comm",
      value: calFin.pislComm,
      icon: PoundSterling,
      description: "PISL commission amount in GBP for the selected period.",
    },
    {
      label: "Capacity net",
      value: calFin.capacityNet,
      icon: PoundSterling,
      description: "Net capacity value in GBP after deductions for the selected period.",
    },
    {
      label: "PISL payable",
      value: calFin.pislPayable,
      icon: PoundSterling,
      description: "Total PISL amount payable in GBP for the selected period.",
    },
    {
      label: "Premium inc. IPT",
      value: calFin.premiumInc,
      icon: PoundSterling,
      description: "Total premium including insurance premium tax in GBP.",
    },
    {
      label: "GWP",
      value: calFin.gwp,
      subtext: "Gross written premium",
      icon: PoundSterling,
      description: "Gross written premium in GBP for the selected period.",
    },
  ]

  const timingKpis: KpiCard[] = [
    {
      label: "Avg booking to stay GBP",
      value: timing.gbpDays,
      subtext: timing.gbpCal,
      icon: Clock,
      description: "Average number of days between booking date and stay start date, in GBP.",
    },
    {
      label: "Avg booking to stay EUR",
      value: timing.eurDays,
      subtext: timing.eurCal,
      icon: Clock,
      description: "Average number of days between booking date and stay start date, in EUR.",
    },
    {
      label: "Avg cancel to stay",
      value: "—",
      subtext: "Days from cancellation to stay start",
      icon: Timer,
      description: "Average number of days between cancellation date and stay start date.",
    },
  ]

  const topLeftSlides: DashboardSlide[] = [
    {
      id: "bookings",
      title: "Bookings",
      content: <KpiGrid kpis={bookingKpis} columns="grid-cols-2" />,
    },
    {
      id: "abv",
      title: "Average booking value",
      content: <KpiGrid kpis={abvKpis} columns="grid-cols-2" />,
    },
  ]

  const topRightSlides: DashboardSlide[] = [
    {
      id: "cal-financials",
      title: "CAL financials (GBP)",
      content: <KpiGrid kpis={calFinancialKpis} columns="grid-cols-2" />,
    },
    {
      id: "timing",
      title: "Timing",
      content: <KpiGrid kpis={timingKpis} columns="grid-cols-1" />,
    },
  ]

  const bottomSlides: DashboardSlide[] = [
    {
      id: "bookings-vs-stays",
      title: "Bookings vs stays per day",
      content: <BookingsVsStaysChart filters={filters} compact />,
    },
    {
      id: "cal-ddl-takeup",
      title: "CAL & DDL take-up %",
      content: <CalDdlTakeupChart filters={filters} compact />,
    },
    {
      id: "lead-time",
      title: "Lead time per day",
      content: <LeadTimeChart filters={filters} compact />,
    },
    {
      id: "abv-per-day",
      title: "ABV per day",
      content: <AbvPerDayChart filters={filters} compact />,
    },
    {
      id: "bookings-per-day",
      title: "Bookings made per day",
      content: <BookingsMadePerDayChart filters={filters} compact />,
    },
    {
      id: "partners",
      title: "Partner performance",
      content: (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="h-11 px-5">Brand</TableHead>
              <TableHead className="px-5">CCY</TableHead>
              <TableHead className="px-5 text-right">Bookings</TableHead>
              <TableHead className="px-5 text-right">CAL</TableHead>
              <TableHead className="px-5 text-right">DDL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partnerRows.map((row) => (
              <TableRow key={row.brand}>
                <TableCell className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${row.color}`} />
                    <span className="text-sm">{row.brand}</span>
                  </div>
                </TableCell>
                <TableCell className="px-5 py-3 text-sm text-muted-foreground">{row.ccy}</TableCell>
                <TableCell className="px-5 py-3 text-right text-sm tabular-nums">
                  {row.bookings}
                </TableCell>
                <TableCell className="px-5 py-3 text-right text-sm tabular-nums text-primary dark:text-blue-400">
                  {row.cal}
                </TableCell>
                <TableCell className="px-5 py-3 text-right text-sm tabular-nums text-amber-600 dark:text-amber-400">
                  {row.ddl}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ),
    },
  ]

  async function handleExportSnapshot() {
    if (!snapshotRef.current || isExporting) return

    setIsExporting(true)
    try {
      await exportElementSnapshot(
        snapshotRef.current,
        buildSnapshotFilename("dashboard", filters)
      )
    } finally {
      setIsExporting(false)
    }
  }

  const filterChips = [
    formatFilterLabel(filters.partner),
    formatFilterLabel(filters.brand),
    filters.dateRange.replace(/-/g, " "),
    `${filters.month} ${filters.year}`,
  ]

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div
        ref={hasRun ? snapshotRef : undefined}
        data-snapshot-capture={hasRun ? true : undefined}
        className="flex min-h-0 flex-1 flex-col gap-3"
      >
        {false && hasRun && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {filterChips.map((chip) => (
              <span
                key={chip}
                className="text-muted-foreground"
                data-snapshot-filter-chip
              >
                {chip}
              </span>
            ))}
          </div>
        )}

        <div className="flex min-h-0 flex-1 gap-5">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            {!hasRun ? (
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/10 text-center">
                <p className="text-sm font-medium">No data to display</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Adjust filters on the right, then press <strong>Run</strong> to load the dashboard.
                </p>
              </div>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col gap-3">
                <DashboardGrid
                  topLeftSlides={topLeftSlides}
                  topRightSlides={topRightSlides}
                  bottomSlides={bottomSlides}
                />
                <div className="flex shrink-0 justify-end" data-snapshot-exclude>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={handleExportSnapshot}
                    disabled={isExporting}
                  >
                    <Camera className="size-3.5" />
                    {isExporting ? "Exporting…" : "Export snapshot"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex w-56 shrink-0 flex-col min-h-0" data-snapshot-exclude>
            <DashboardFilterBar filters={filters} onRun={onRun} />
          </div>
        </div>
      </div>
    </div>
  )
}

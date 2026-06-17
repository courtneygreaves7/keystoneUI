import type { ReactNode } from "react"
import {
  CalendarCheck,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  Gauge,
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
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  type ActiveFilters,
  getAbvProfile,
  getBookingProfile,
  getCalFinProfile,
  getTimingProfile,
} from "@/lib/chart-data"

type InsightsDashboardPageProps = {
  filters: ActiveFilters
}

type KpiCard = {
  label: string
  value: string
  subtext?: string
  icon: LucideIcon
}

function DashboardKpiCard({ label, value, subtext, icon: Icon }: KpiCard) {
  return (
    <Card className="shadow-none">
      <CardHeader className="items-center p-3 pb-2">
        <div className="flex items-center gap-2">
          <div className="grid size-7 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
            <Icon className="size-3.5" />
          </div>
          <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-xl font-medium tracking-tight tabular-nums">{value}</p>
        <p className="mt-1 min-h-4 text-[11px] text-muted-foreground">{subtext ?? "\u00a0"}</p>
      </CardContent>
    </Card>
  )
}

function DashboardSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      {children}
    </section>
  )
}

function formatFilterLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function InsightsDashboardPage({ filters }: InsightsDashboardPageProps) {
  const booking = getBookingProfile(filters)
  const abv = getAbvProfile(filters)
  const calFin = getCalFinProfile(filters)
  const timing = getTimingProfile(filters)
  const partnerRows = getPartnerRows(filters)

  const bookingKpis: KpiCard[] = [
    { label: "Total bookings", value: booking.total, icon: CalendarCheck },
    { label: "CAL sales", value: booking.calSales, icon: TrendingUp },
    { label: "CAL take-up %", value: booking.calPct, icon: Percent },
    { label: "DDL sales", value: booking.ddlSales, icon: CreditCard },
    { label: "DDL take-up %", value: booking.ddlPct, icon: Gauge },
  ]

  const abvKpis: KpiCard[] = [
    {
      label: "ABV (excl. fee) GBP",
      value: abv.gbpAbv,
      subtext: abv.gbpCal,
      icon: Wallet,
    },
    {
      label: "ABV (excl. fee) EUR",
      value: abv.eurAbv,
      subtext: abv.eurCal,
      icon: Wallet,
    },
    {
      label: "ABV inc. fee GBP",
      value: abv.gbpAbvFee,
      subtext: abv.gbpCalFee,
      icon: FileText,
    },
    {
      label: "ABV inc. fee EUR",
      value: abv.eurAbvFee,
      subtext: abv.eurCalFee,
      icon: FileText,
    },
    {
      label: "CAL customer price",
      value: abv.calPct,
      subtext: "% of ABV inc. booking fee",
      icon: Percent,
    },
  ]

  const calFinancialKpis: KpiCard[] = [
    { label: "Total payable", value: calFin.totalPayable, icon: DollarSign },
    { label: "IPT", value: calFin.ipt, icon: DollarSign },
    { label: "PISL comm", value: calFin.pislComm, icon: DollarSign },
    { label: "Capacity net", value: calFin.capacityNet, icon: DollarSign },
    { label: "PISL payable", value: calFin.pislPayable, icon: DollarSign },
    { label: "Premium inc. IPT", value: calFin.premiumInc, icon: PoundSterling },
    { label: "GWP", value: calFin.gwp, subtext: "Gross written premium", icon: PoundSterling },
  ]

  const timingKpis: KpiCard[] = [
    {
      label: "Avg booking to stay GBP",
      value: timing.gbpDays,
      subtext: timing.gbpCal,
      icon: Clock,
    },
    {
      label: "Avg booking to stay EUR",
      value: timing.eurDays,
      subtext: timing.eurCal,
      icon: Clock,
    },
    {
      label: "Avg cancel to stay",
      value: "—",
      subtext: "Days from cancellation to stay start",
      icon: Timer,
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {[
          formatFilterLabel(filters.partner),
          formatFilterLabel(filters.brand),
          filters.dateRange.replace(/-/g, " "),
          `${filters.month} ${filters.year}`,
        ].map((chip) => (
          <span
            key={chip}
            className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            {chip}
          </span>
        ))}
      </div>

      <DashboardSection title="Bookings">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {bookingKpis.map((kpi) => (
            <DashboardKpiCard key={kpi.label} {...kpi} />
          ))}
        </div>
      </DashboardSection>

      <DashboardSection title="Average booking value">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {abvKpis.map((kpi) => (
            <DashboardKpiCard key={kpi.label} {...kpi} />
          ))}
        </div>
      </DashboardSection>

      <DashboardSection title="CAL financials (GBP)">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {calFinancialKpis.map((kpi) => (
            <DashboardKpiCard key={kpi.label} {...kpi} />
          ))}
        </div>
      </DashboardSection>

      <DashboardSection title="Timing">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {timingKpis.map((kpi) => (
            <DashboardKpiCard key={kpi.label} {...kpi} />
          ))}
        </div>
      </DashboardSection>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <BookingsVsStaysChart filters={filters} />
        </div>
        <CalDdlTakeupChart filters={filters} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <LeadTimeChart filters={filters} />
        <AbvPerDayChart filters={filters} />
      </div>

      <BookingsMadePerDayChart filters={filters} />

      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold">Partner performance</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Bookings, CAL and DDL by partner for the selected filters
          </p>
        </div>
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
      </section>
    </div>
  )
}

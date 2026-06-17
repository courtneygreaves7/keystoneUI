import {
  Ban,
  CalendarClock,
  CalendarX2,
  Clock,
  CreditCard,
  Gauge,
  Moon,
  Percent,
  Timer,
  Trophy,
  UserCheck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { SortedChartTooltip } from "@/components/charts/sorted-chart-tooltip"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  PROPERTY_INSIGHT_METRICS,
  PROPERTY_MONTHLY_TRENDS,
  PROPERTY_RANKED_BOOKING_SOURCES,
  type BookingSourceItem,
  type PropertyInsightMetric,
} from "@/lib/property-insights-data"

const TICK_STYLE = { fontSize: 11, fill: "var(--color-muted-foreground)" }

const METRIC_ICONS: Record<string, LucideIcon> = {
  "avg-lead-days": Clock,
  "avg-cancel-from-booking": CalendarX2,
  "avg-cancel-to-stay": Timer,
  "avg-booking-value": Wallet,
  "cal-coverage": Percent,
  "ddl-coverage": CreditCard,
  "avg-nights": Moon,
  "avg-guests": Users,
  occupancy: Gauge,
  "cancellation-rate": Ban,
  "repeat-guests": UserCheck,
}

export function PropertyInsights() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {PROPERTY_INSIGHT_METRICS.map((metric) => (
          <InsightMetricCard
            key={metric.id}
            metric={metric}
            icon={METRIC_ICONS[metric.id] ?? CalendarClock}
          />
        ))}
      </div>

      <section className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold">Monthly booking trends</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Bookings made each month vs. stay start month
          </p>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={PROPERTY_MONTHLY_TRENDS} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="month"
              tick={TICK_STYLE}
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={50}
            />
            <YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} width={32} allowDecimals={false} />
            <Tooltip content={<SortedChartTooltip />} />
            <Legend iconType="plainline" wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Line
              type="monotone"
              dataKey="bookingsMade"
              name="Bookings made"
              stroke="#3b82f6"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="stayStartMonth"
              name="Stay start month"
              stroke="#10b981"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section>
        <div className="mb-4">
          <h3 className="text-sm font-semibold">Booking sources</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Top channels and website traffic
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {PROPERTY_RANKED_BOOKING_SOURCES.map((source, index) => (
            <BookingSourceCard key={source.label} source={source} rank={index + 1} />
          ))}
        </div>
      </section>
    </div>
  )
}

function InsightMetricCard({
  metric,
  icon: Icon,
}: {
  metric: PropertyInsightMetric
  icon: LucideIcon
}) {
  return (
    <Card className="flex h-full flex-col shadow-none">
      <CardHeader className="items-center p-3 pb-2">
        <div className="flex items-center gap-2">
          <div className="grid size-6 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
            <Icon className="size-3" />
          </div>
          <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            {metric.label}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-3 pt-0">
        <p className="text-base font-medium tracking-tight">{metric.value}</p>
        <p className="mt-1 min-h-4 text-[11px] text-muted-foreground">{metric.subtext ?? "\u00a0"}</p>
      </CardContent>
    </Card>
  )
}

function formatRank(rank: number) {
  if (rank >= 11 && rank <= 13) return `${rank}th`
  const last = rank % 10
  if (last === 1) return `${rank}st`
  if (last === 2) return `${rank}nd`
  if (last === 3) return `${rank}rd`
  return `${rank}th`
}

const RANK_TROPHY_COLORS: Record<number, string> = {
  1: "text-[#D4AF37]",
  2: "text-[#A8A9AD]",
  3: "text-[#CD7F32]",
}

function BookingSourceCard({ source, rank }: { source: BookingSourceItem; rank: number }) {
  if (source.isWebTraffic) {
    return (
      <Card className="flex h-full flex-col shadow-none">
        <CardHeader className="items-center p-3 pb-2">
          <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            Booking stream
          </p>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col p-3 pt-0">
          <p className="text-base font-medium tracking-tight">{source.label}</p>
          <p className="mt-1 min-h-4 text-[11px] text-muted-foreground">
            {source.value} visits · vs other · {source.vsOther ?? 0}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex h-full flex-col shadow-none">
      <CardHeader className="items-center p-3 pb-2">
        <div className="flex items-center gap-1.5">
          {rank <= 3 && (
            <Trophy className={`size-3.5 ${RANK_TROPHY_COLORS[rank]}`} />
          )}
          <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            {formatRank(rank)}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-3 pt-0">
        <p className="text-base font-medium tracking-tight">{source.label}</p>
        <p className="mt-1 min-h-4 text-[11px] text-muted-foreground">
          {source.value} bookings · {source.type}
        </p>
      </CardContent>
    </Card>
  )
}

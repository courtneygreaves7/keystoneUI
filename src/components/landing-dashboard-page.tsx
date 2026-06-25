import {
  BarChart3,
  ChevronRight,
  Crosshair,
  Download,
  FileText,
  Plus,
  Settings,
  ShieldCheck,
  Tags,
  type LucideIcon,
} from "lucide-react"

import { getProductSplit } from "@/components/bookings-snapshot"
import { DualDataWidget } from "@/components/dual-data-widget"
import { TooltipProvider } from "@/components/ui/tooltip"
import { BreakdownDataWidget } from "@/components/widgets/breakdown-data-widget"
import { HeadlineDataWidget } from "@/components/widgets/headline-data-widget"
import { MetricTrendWidget } from "@/components/widgets/metric-trend-widget"
import { ProductSplitWidget } from "@/components/widgets/product-split-widget"
import {
  BOOKING_ENGINE_SUMMARY,
  formatCount,
  formatCurrency,
} from "@/lib/booking-engine-data"
import {
  type ActiveFilters,
  buildBookingTrendChart,
  buildFinancialTrendChart,
  deriveBookingTrendMeta,
  getBookingProfile,
} from "@/lib/chart-data"
import { metricCardGridClass } from "@/lib/card-layout"
import { FIGURE_20PX_CLASS } from "@/lib/figure-styles"
import { INSIGHTS_WIDGET_HELP_TEXT } from "@/lib/insights-widget-labels"
import { cn } from "@/lib/utils"

export type LandingDestination =
  | { section: "booking-engine" }
  | { section: "insights"; anchor?: string }
  | { section: "admin" }

type LandingDashboardPageProps = {
  filters: ActiveFilters
  onNavigate: (destination: LandingDestination) => void
}

const PANEL_BORDER_CLASS = "border-border bg-card"

const PAS_WIDGET_HELP_TEXT =
  "Policy admin metrics across connected partners, brands, and platform properties."

function formatFilterContext(filters: ActiveFilters) {
  const partner =
    filters.partner === "all-partners"
      ? "All partners"
      : filters.partner.replace("partner-", "Partner ").replace(/\b\w/g, (c) => c.toUpperCase())
  const brand =
    filters.brand === "all-brands"
      ? "all brands"
      : filters.brand.replace("brand-", "Brand ").replace(/\b\w/g, (c) => c.toUpperCase())
  const range =
    filters.dateRange === "year-to-month-end"
      ? `YTD to ${filters.month} ${filters.year}`
      : `${filters.month} ${filters.year}`

  return `${partner} · ${brand} · ${range}`
}

function formatProductShare(count: number, bookings: number) {
  const pct = bookings > 0 ? Math.round((count / bookings) * 100) : 0
  return `${formatCount(count)} (${pct}%)`
}

function DashboardPanel({
  label,
  subtitle,
  linkLabel,
  onLinkClick,
  children,
  className,
  variant = "fill",
}: {
  label: string
  subtitle: string
  linkLabel?: string
  onLinkClick?: () => void
  children?: React.ReactNode
  className?: string
  variant?: "fill" | "compact"
}) {
  const hasBody = children != null

  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border shadow-xs",
        variant === "fill" && hasBody ? "h-full min-h-0" : "",
        PANEL_BORDER_CLASS,
        className
      )}
    >
      <header className="flex items-start justify-between gap-4 px-5 py-4">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">{label}</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{subtitle}</p>
        </div>
        {linkLabel && onLinkClick ? (
          <button
            type="button"
            onClick={onLinkClick}
            className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          >
            {linkLabel}
            <ChevronRight className="size-3.5" />
          </button>
        ) : null}
      </header>
      {hasBody ? (
        <div
          className={cn(
            "flex flex-col border-t border-border/50 px-5 py-4",
            variant === "fill" && "min-h-0 flex-1"
          )}
        >
          {children}
        </div>
      ) : null}
    </article>
  )
}

function QuickActionTile({
  label,
  icon: Icon,
  onClick,
}: {
  label: string
  icon: LucideIcon
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1 rounded-lg border border-border/60 px-1.5 py-2.5 text-center text-muted-foreground transition-colors hover:border-border hover:bg-muted/40 hover:text-foreground"
    >
      <Icon className="size-3.5 shrink-0" />
      <span className="text-[10px] font-medium leading-tight">{label}</span>
    </button>
  )
}

export function LandingDashboardPage({ filters, onNavigate }: LandingDashboardPageProps) {
  const booking = getBookingProfile(filters)
  const productSplit = getProductSplit(booking)
  const bookingTrend = deriveBookingTrendMeta(booking.total)
  const bookingChart = buildBookingTrendChart(booking.total)
  const operationsRevenueChart = buildFinancialTrendChart(
    formatCurrency(BOOKING_ENGINE_SUMMARY.totalRevenue, "GBP")
  )

  return (
    <TooltipProvider>
    <div className="flex min-h-full flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">Welcome back, Courtney</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            A quick overview across policy admin and insights — pick a snapshot to dive deeper.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          <BarChart3 className="size-3.5 shrink-0" />
          <span>{formatFilterContext(filters)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-8 items-start gap-3">
        {/* Operations */}
        <DashboardPanel
          className="col-span-4"
          label="Operations"
          subtitle="Partners, policies & connectivity"
          linkLabel="Manage"
          onLinkClick={() => onNavigate({ section: "booking-engine" })}
        >
          <div className="@container flex flex-col gap-4">
            <div className={cn(metricCardGridClass, "min-w-0 grid-cols-1 @md:grid-cols-2")}>
              <BreakdownDataWidget
                title="Sales"
                primaryValue={formatCount(BOOKING_ENGINE_SUMMARY.totalBookings)}
                primaryLabel={`${BOOKING_ENGINE_SUMMARY.partners} partners · ${BOOKING_ENGINE_SUMMARY.activeBrands} brands`}
                subdataA={{
                  label: "With CAL",
                  value: formatProductShare(
                    BOOKING_ENGINE_SUMMARY.totalWithCal,
                    BOOKING_ENGINE_SUMMARY.totalBookings
                  ),
                  helpText: PAS_WIDGET_HELP_TEXT,
                }}
                subdataB={{
                  label: "With DDL",
                  value: formatProductShare(
                    BOOKING_ENGINE_SUMMARY.totalWithDdl,
                    BOOKING_ENGINE_SUMMARY.totalBookings
                  ),
                  helpText: PAS_WIDGET_HELP_TEXT,
                }}
                subdataDivider
              />
              <HeadlineDataWidget
                className="min-w-0"
                title="Revenue"
                value={formatCurrency(BOOKING_ENGINE_SUMMARY.totalRevenue, "GBP")}
                label="GBP · all partners"
                helpText={PAS_WIDGET_HELP_TEXT}
                valueClassName={FIGURE_20PX_CLASS}
                chartData={operationsRevenueChart}
              />
            </div>

            <div className={cn(metricCardGridClass, "min-w-0 grid-cols-1 @md:grid-cols-2")}>
              <DualDataWidget
                className="min-w-0"
                datasetA={{
                  title: "Partners",
                  value: formatCount(BOOKING_ENGINE_SUMMARY.partners),
                  clarification: "Connected to engine",
                }}
                datasetB={{
                  title: "Active brands",
                  value: formatCount(BOOKING_ENGINE_SUMMARY.activeBrands),
                  clarification: "Across all partners",
                }}
                helpText={PAS_WIDGET_HELP_TEXT}
                valueClassName={FIGURE_20PX_CLASS}
              />
              <DualDataWidget
                className="min-w-0"
                datasetA={{
                  title: "Properties",
                  value: formatCount(BOOKING_ENGINE_SUMMARY.totalProperties),
                  clarification: "On platform",
                }}
                datasetB={{
                  title: "Cancellations",
                  value: formatCount(BOOKING_ENGINE_SUMMARY.totalCancellations),
                  clarification: "Year to date",
                }}
                helpText={PAS_WIDGET_HELP_TEXT}
                valueClassName={FIGURE_20PX_CLASS}
              />
            </div>
          </div>
        </DashboardPanel>

        {/* Intelligence */}
        <DashboardPanel
          className="col-span-4"
          label="Intelligence"
          subtitle="Insights, trends & benchmarks"
          linkLabel="Full report"
          onLinkClick={() => onNavigate({ section: "insights" })}
        >
          <div className="@container flex flex-col gap-4">
            <div className={cn(metricCardGridClass, "min-w-0 grid-cols-2")}>
              <MetricTrendWidget
                className="min-w-0"
                title="Total bookings"
                value={booking.total}
                trendLabel={bookingTrend.trendLabel}
                trend={bookingTrend.trend}
                comparisonLabel={bookingTrend.comparisonLabel}
                chartData={bookingChart}
                scopeLabel="All selected partners and brands"
                rateLabel={bookingTrend.dailyAverage}
                helpText={INSIGHTS_WIDGET_HELP_TEXT}
              />
              <ProductSplitWidget
                className="min-w-0"
                totalLabel={productSplit.totalLabel}
                segmentA={{
                  label: "CAL",
                  value: booking.calSales,
                  sharePercent: productSplit.calSharePercent,
                  takeUpLabel: `${booking.calPct} take-up`,
                  trend: productSplit.calTrend,
                }}
                segmentB={{
                  label: "DDL",
                  value: booking.ddlSales,
                  sharePercent: productSplit.ddlSharePercent,
                  takeUpLabel: `${booking.ddlPct} take-up`,
                  trend: productSplit.ddlTrend,
                }}
                helpText={INSIGHTS_WIDGET_HELP_TEXT}
              />
            </div>
          </div>
        </DashboardPanel>
        </div>

        <div className="grid grid-cols-8 items-start gap-3">
        <DashboardPanel
          className="col-span-6"
          label="Admin"
          subtitle="Policy rates, financials & compliance"
          linkLabel="Review"
          onLinkClick={() => onNavigate({ section: "admin" })}
        />

        {/* Quick links */}
        <DashboardPanel
          className="col-span-2"
          label="Quick links"
          subtitle="Common tasks"
        >
          <div className="grid grid-cols-2 gap-2">
            <QuickActionTile
              label="Add partner"
              icon={Plus}
              onClick={() => onNavigate({ section: "booking-engine" })}
            />
            <QuickActionTile
              label="Add targets"
              icon={Crosshair}
              onClick={() => onNavigate({ section: "insights" })}
            />
            <QuickActionTile
              label="Review rates"
              icon={FileText}
              onClick={() => onNavigate({ section: "booking-engine" })}
            />
            <QuickActionTile
              label="Export report"
              icon={Download}
              onClick={() => onNavigate({ section: "insights" })}
            />
            <QuickActionTile
              label="Manage brands"
              icon={Tags}
              onClick={() => onNavigate({ section: "booking-engine" })}
            />
            <QuickActionTile
              label="Partner settings"
              icon={Settings}
              onClick={() => onNavigate({ section: "admin" })}
            />
            <QuickActionTile
              label="Policy audit"
              icon={ShieldCheck}
              onClick={() => onNavigate({ section: "admin" })}
            />
          </div>
        </DashboardPanel>
        </div>
      </div>
    </div>
    </TooltipProvider>
  )
}

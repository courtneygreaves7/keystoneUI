import { useEffect, useRef, useState } from "react"
import {
  BarChart3,
  Building2,
  ChevronRight,
  PencilLine,
  Plus,
  Users,
  type LucideIcon,
} from "lucide-react"

import { getProductSplit } from "@/components/bookings-snapshot"
import { ScaledPartnerPanelPreview } from "@/components/booking-engine/partner-panel-preview"
import { TargetsSnapshot } from "@/components/targets-snapshot"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { MetricTrendWidget } from "@/components/widgets/metric-trend-widget"
import { ProductSplitWidget } from "@/components/widgets/product-split-widget"
import { BOOKING_ENGINE_PARTNERS } from "@/lib/booking-engine-data"
import {
  type ActiveFilters,
  buildBookingTrendChart,
  deriveBookingTrendMeta,
  getBookingProfile,
} from "@/lib/chart-data"
import { metricCardGridClass } from "@/lib/card-layout"
import { INSIGHTS_WIDGET_HELP_TEXT } from "@/lib/insights-widget-labels"
import { cn } from "@/lib/utils"

export type BookingEngineView = "partners" | "properties" | "editor"

export type LandingDestination =
  | { section: "booking-engine"; view?: BookingEngineView }
  | { section: "insights"; anchor?: string }
  | { section: "admin" }

type LandingDashboardPageProps = {
  filters: ActiveFilters
  onNavigate: (destination: LandingDestination) => void
}

const PANEL_BORDER_CLASS = "border-border bg-card"

type TeamWorkStatus = "in_progress" | "completed" | "in_review" | "blocked"

type TeamMember = {
  id: string
  name: string
  initials: string
  online: boolean
  lastWorkedOn: string
  status: TeamWorkStatus
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "courtney",
    name: "Courtney Greaves",
    initials: "CG",
    online: true,
    lastWorkedOn: "Partner Alpha rate review",
    status: "in_progress",
  },
  {
    id: "james",
    name: "James O'Brien",
    initials: "JO",
    online: true,
    lastWorkedOn: "Q2 insights export",
    status: "completed",
  },
  {
    id: "sarah",
    name: "Sarah Chen",
    initials: "SC",
    online: false,
    lastWorkedOn: "Brand Beta policy setup",
    status: "in_progress",
  },
  {
    id: "marcus",
    name: "Marcus Webb",
    initials: "MW",
    online: false,
    lastWorkedOn: "DDL take-up analysis",
    status: "in_review",
  },
  {
    id: "elena",
    name: "Elena Vasquez",
    initials: "EV",
    online: true,
    lastWorkedOn: "Partner Gamma onboarding",
    status: "in_progress",
  },
  {
    id: "tom",
    name: "Tom Fletcher",
    initials: "TF",
    online: false,
    lastWorkedOn: "API webhook configuration",
    status: "completed",
  },
  {
    id: "priya",
    name: "Priya Nair",
    initials: "PN",
    online: true,
    lastWorkedOn: "YTD target adjustments",
    status: "blocked",
  },
]

const TEAM_STATUS_LABELS: Record<TeamWorkStatus, string> = {
  in_progress: "In progress",
  completed: "Completed",
  in_review: "In review",
  blocked: "Blocked",
}

const ADMIN_ACTIVITIES = [
  {
    id: "users",
    label: "User management",
    description: "Roles, access and invitations",
  },
  {
    id: "api",
    label: "API & integrations",
    description: "Keys, webhooks and connections",
  },
  {
    id: "logs",
    label: "System logs",
    description: "Audit trail and error monitoring",
  },
  {
    id: "platform",
    label: "Platform settings",
    description: "Environment and feature flags",
  },
] as const

function TeamWorkStatusBadge({ status }: { status: TeamWorkStatus }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums",
        status === "completed" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
        status === "in_progress" && "bg-muted text-muted-foreground",
        status === "in_review" && "bg-amber-500/10 text-amber-700 dark:text-amber-400",
        status === "blocked" && "bg-red-500/10 text-red-700 dark:text-red-400"
      )}
    >
      {TEAM_STATUS_LABELS[status]}
    </span>
  )
}

function TeamMemberAvatar({
  initials,
  online,
}: {
  initials: string
  online: boolean
}) {
  return (
    <div className="relative shrink-0">
      <div
        className="flex size-9 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground"
        aria-hidden
      >
        {initials}
      </div>
      <span
        className={cn(
          "absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-card",
          online ? "bg-emerald-500" : "bg-muted-foreground/35"
        )}
        aria-label={online ? "Online" : "Offline"}
      />
    </div>
  )
}

function TeamMemberRow({ member }: { member: TeamMember }) {
  return (
    <li className="flex items-center gap-3 py-2.5">
      <TeamMemberAvatar initials={member.initials} online={member.online} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{member.name}</p>
        <p className="truncate text-xs text-muted-foreground">{member.lastWorkedOn}</p>
      </div>
      <TeamWorkStatusBadge status={member.status} />
    </li>
  )
}

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

function OpsActionButton({
  label,
  icon: Icon,
  onClick,
}: {
  label: string
  icon: LucideIcon
  onClick: () => void
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className="flex h-auto w-full flex-col items-center justify-center gap-1 px-2 py-2.5 text-center text-xs"
    >
      <Icon className="size-3.5 shrink-0" />
      {label}
    </Button>
  )
}

function PanelHeaderAccent({ colors }: { colors: string[] }) {
  return (
    <div className="flex shrink-0 items-stretch gap-1.5 self-stretch" aria-hidden>
      {colors.map((colorClass, index) => (
        <span key={index} className={cn("w-0.5 shrink-0 rounded-full", colorClass)} />
      ))}
    </div>
  )
}

function DashboardPanel({
  label,
  subtitle,
  linkLabel,
  onLinkClick,
  headerAction,
  headerAccentColors,
  children,
  className,
  variant = "fill",
}: {
  label: string
  subtitle: string
  linkLabel?: string
  onLinkClick?: () => void
  headerAction?: React.ReactNode
  headerAccentColors?: string[]
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
        <div className="flex min-w-0 flex-1 items-stretch gap-3">
          {headerAccentColors?.length ? (
            <PanelHeaderAccent colors={headerAccentColors} />
          ) : null}
          <div className="min-w-0">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">{label}</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        {headerAction ? (
          <div className="shrink-0">{headerAction}</div>
        ) : linkLabel && onLinkClick ? (
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
            variant === "fill" && "min-h-0 flex-1 overflow-hidden"
          )}
        >
          {children}
        </div>
      ) : null}
    </article>
  )
}

export function LandingDashboardPage({ filters, onNavigate }: LandingDashboardPageProps) {
  const booking = getBookingProfile(filters)
  const productSplit = getProductSplit(booking)
  const bookingTrend = deriveBookingTrendMeta(booking.total)
  const bookingChart = buildBookingTrendChart(booking.total)
  const snapshotPartner = BOOKING_ENGINE_PARTNERS[0]
  const intelRef = useRef<HTMLDivElement>(null)
  const [intelHeight, setIntelHeight] = useState<number>()

  useEffect(() => {
    const element = intelRef.current
    if (!element) return

    const updateHeight = () => {
      setIntelHeight(element.getBoundingClientRect().height)
    }

    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

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
        <div className="flex items-start gap-3">
        {/* Operations */}
        <div
          className="min-w-0 flex-1"
          style={intelHeight !== undefined ? { height: intelHeight } : undefined}
        >
        <DashboardPanel
          className="h-full"
          variant="fill"
          label="Operations"
          subtitle="Partners, policies & connectivity"
          headerAccentColors={["bg-green-500"]}
          linkLabel="Manage"
          onLinkClick={() => onNavigate({ section: "booking-engine" })}
        >
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="grid grid-cols-3 gap-2">
              <OpsActionButton
                label="View partners"
                icon={Users}
                onClick={() => onNavigate({ section: "booking-engine", view: "partners" })}
              />
              <OpsActionButton
                label="View properties"
                icon={Building2}
                onClick={() => onNavigate({ section: "booking-engine", view: "properties" })}
              />
              <OpsActionButton
                label="Editor mode"
                icon={PencilLine}
                onClick={() => onNavigate({ section: "booking-engine", view: "editor" })}
              />
            </div>

            {snapshotPartner ? (
              <div className="mt-4 -mx-5 -mb-4 flex min-h-0 flex-1 flex-col overflow-hidden px-5">
                <ScaledPartnerPanelPreview partner={snapshotPartner} className="min-h-0 flex-1" />
              </div>
            ) : null}
          </div>
        </DashboardPanel>
        </div>

        {/* Intelligence */}
        <div ref={intelRef} className="min-w-0 flex-1">
        <DashboardPanel
          variant="compact"
          label="Intelligence"
          subtitle="Insights, trends & benchmarks"
          headerAccentColors={["bg-purple-500"]}
          linkLabel="Full report"
          onLinkClick={() => onNavigate({ section: "insights" })}
        >
          <div className="@container flex min-h-0 flex-1 flex-col gap-4">
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

            <p className="mt-auto border-t border-border/50 pt-3 text-xs text-muted-foreground">
              Explore timing, ABV, lead time and more in the{" "}
              <button
                type="button"
                onClick={() => onNavigate({ section: "insights" })}
                className="font-medium text-foreground underline-offset-2 hover:underline"
              >
                full insights report
              </button>
              .
            </p>
          </div>
        </DashboardPanel>
        </div>
        </div>

        <div className="grid grid-cols-8 items-stretch gap-3">
        <DashboardPanel
          className="col-span-4"
          label="Targets"
          subtitle="Progress against this period's goals"
          headerAccentColors={["bg-rose-500"]}
          linkLabel="Manage targets"
          onLinkClick={() => onNavigate({ section: "insights" })}
        >
          <TargetsSnapshot />
        </DashboardPanel>

        <DashboardPanel
          className="col-span-4"
          label="Team"
          subtitle="Who's working on what"
          headerAccentColors={["bg-indigo-500"]}
          headerAction={
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <Plus className="size-3.5" />
              Add team member
            </Button>
          }
        >
          <ul className="divide-y divide-border">
            {TEAM_MEMBERS.map((member) => (
              <TeamMemberRow key={member.id} member={member} />
            ))}
          </ul>
        </DashboardPanel>
        </div>

        <div className="grid grid-cols-8 items-stretch gap-3">
        <DashboardPanel
          className="col-span-8"
          label="Admin"
          subtitle="Backend administration, users & platform configuration"
          headerAccentColors={["bg-amber-500"]}
          linkLabel="Open admin"
          onLinkClick={() => onNavigate({ section: "admin" })}
        >
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ADMIN_ACTIVITIES.map((activity) => (
              <li
                key={activity.id}
                className="rounded-lg border border-border/60 bg-muted/20 px-3 py-3"
              >
                <p className="text-sm font-medium text-foreground">{activity.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{activity.description}</p>
              </li>
            ))}
          </ul>
        </DashboardPanel>
        </div>
      </div>
    </div>
    </TooltipProvider>
  )
}

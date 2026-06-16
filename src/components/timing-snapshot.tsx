import { useState } from "react"
import { Clock, Info, LayoutList, Timer } from "lucide-react"

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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { type ActiveFilters, getTimingProfile } from "@/lib/chart-data"

type CurrencyTiming = {
  currency: "GBP" | "EUR"
  flag: "uk" | "eu"
  value: string
  cal: string
}

type TimingCard = {
  label: string
  icon: typeof Clock
  description: string
  columns?: [CurrencyTiming, CurrencyTiming]
  emptyNote?: string
}

const BASE_TIMING_ROWS = [
  { brand: "Partner Alpha",       ccy: "GBP", color: "bg-blue-500"   },
  { brand: "Partner Beta",        ccy: "GBP", color: "bg-cyan-500"   },
  { brand: "Partner Gamma (DK)",  ccy: "EUR", color: "bg-amber-500"  },
  { brand: "Partner Gamma (EUR)", ccy: "EUR", color: "bg-violet-500" },
  { brand: "Partner Delta (EUR)", ccy: "EUR", color: "bg-rose-500"   },
  { brand: "Partner Epsilon",     ccy: "GBP", color: "bg-lime-500"   },
  { brand: "Partner Zeta (DK)",   ccy: "EUR", color: "bg-pink-500"   },
  { brand: "Partner Zeta (EUR)",  ccy: "EUR", color: "bg-orange-500" },
]

const TIMING_ROW_DATA: Record<string, Array<{ avgLead: string; calAvgLead: string }>> = {
  "all-partners:all-brands": [
    { avgLead: "92.4 days",  calAvgLead: "118.7 days" },
    { avgLead: "86.1 days",  calAvgLead: "—"          },
    { avgLead: "101.3 days", calAvgLead: "142.0 days" },
    { avgLead: "115.6 days", calAvgLead: "—"          },
    { avgLead: "128.4 days", calAvgLead: "—"          },
    { avgLead: "134.2 days", calAvgLead: "—"          },
    { avgLead: "109.8 days", calAvgLead: "138.5 days" },
    { avgLead: "97.3 days",  calAvgLead: "124.9 days" },
  ],
  "partner-a:all-brands": [
    { avgLead: "85.2 days",  calAvgLead: "108.4 days" },
    { avgLead: "79.8 days",  calAvgLead: "—"          },
    { avgLead: "94.6 days",  calAvgLead: "132.1 days" },
    { avgLead: "108.3 days", calAvgLead: "—"          },
    { avgLead: "121.0 days", calAvgLead: "—"          },
    { avgLead: "127.5 days", calAvgLead: "—"          },
    { avgLead: "102.4 days", calAvgLead: "129.3 days" },
    { avgLead: "90.1 days",  calAvgLead: "116.7 days" },
  ],
  "partner-b:all-brands": [
    { avgLead: "98.7 days",  calAvgLead: "126.2 days" },
    { avgLead: "92.4 days",  calAvgLead: "—"          },
    { avgLead: "108.5 days", calAvgLead: "151.4 days" },
    { avgLead: "122.9 days", calAvgLead: "—"          },
    { avgLead: "136.1 days", calAvgLead: "—"          },
    { avgLead: "142.0 days", calAvgLead: "—"          },
    { avgLead: "117.3 days", calAvgLead: "147.8 days" },
    { avgLead: "103.8 days", calAvgLead: "133.1 days" },
  ],
  "partner-c:all-brands": [
    { avgLead: "89.0 days",  calAvgLead: "113.5 days" },
    { avgLead: "83.6 days",  calAvgLead: "—"          },
    { avgLead: "97.8 days",  calAvgLead: "137.2 days" },
    { avgLead: "111.4 days", calAvgLead: "—"          },
    { avgLead: "124.6 days", calAvgLead: "—"          },
    { avgLead: "130.9 days", calAvgLead: "—"          },
    { avgLead: "106.1 days", calAvgLead: "133.8 days" },
    { avgLead: "93.7 days",  calAvgLead: "120.4 days" },
  ],
}

function getTimingRows(filters: ActiveFilters) {
  const key = `${filters.partner}:${filters.brand}`
  const rowData = TIMING_ROW_DATA[key] ?? TIMING_ROW_DATA["all-partners:all-brands"]
  return BASE_TIMING_ROWS.map((base, i) => ({ ...base, ...rowData[i] }))
}

function FlagBadge({ type }: { type: "uk" | "eu" }) {
  const src = type === "uk" ? "https://flagcdn.com/w40/gb.png" : "https://flagcdn.com/w40/eu.png"
  const alt = type === "uk" ? "United Kingdom flag" : "European Union flag"
  return (
    <span className="inline-flex size-4 overflow-hidden rounded-full border border-border/80 bg-background">
      <img src={src} alt={alt} className="size-full object-cover" />
    </span>
  )
}

export function TimingSnapshot({ filters }: { filters: ActiveFilters }) {
  const [showBreakdown, setShowBreakdown] = useState(false)
  const profile = getTimingProfile(filters)
  const timingRows = getTimingRows(filters)
  const timingCards: TimingCard[] = [
    {
      label: "Avg booking to stay",
      icon: Clock,
      description: "Average number of days between booking date and stay start date.",
      columns: [
        { currency: "GBP", flag: "uk", value: profile.gbpDays, cal: profile.gbpCal },
        { currency: "EUR", flag: "eu", value: profile.eurDays, cal: profile.eurCal },
      ],
    },
    {
      label: "Avg cancellation to stay",
      icon: Timer,
      description: "Average number of days between cancellation date and stay start date.",
      emptyNote: "Days from cancellation to stay start",
    },
  ]

  return (
    <TooltipProvider>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold tracking-wide uppercase">Timing</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setShowBreakdown((prev) => !prev)}
                aria-label={showBreakdown ? "Hide timing breakdown" : "Show timing breakdown"}
                className={`rounded-md p-1.5 transition-colors hover:bg-accent ${showBreakdown ? "text-foreground" : "text-muted-foreground"}`}
              >
                <LayoutList className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {showBreakdown
                ? "Hide partner breakdown"
                : "View avg booking lead time per partner — includes CAL avg lead days by brand"}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {timingCards.map(({ label, icon: Icon, description, columns, emptyNote }) => (
            <Card key={label}>
              <CardHeader className="items-center">
                <div className="flex items-center gap-2">
                  <div className="grid size-7 place-items-center rounded-md bg-muted text-muted-foreground">
                    <Icon className="size-3.5" />
                  </div>
                  <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                    {label}
                  </p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={`More information about ${label}`}
                    >
                      <Info className="size-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{description}</TooltipContent>
                </Tooltip>
              </CardHeader>

              <CardContent>
                <div className="border-t border-border pt-4">
                  {columns ? (
                    <div className="grid grid-cols-2 divide-x divide-border">
                      {columns.map((col, i) => (
                        <div key={col.currency} className={i === 0 ? "pr-4" : "pl-4"}>
                          <div className="mb-1 flex items-center gap-1.5">
                            <FlagBadge type={col.flag} />
                            <span className="text-sm font-medium tracking-wide text-muted-foreground">
                              {col.currency}
                            </span>
                          </div>
                          <p className="text-xl font-medium tracking-tight">{col.value}</p>
                          <p className="mt-1 text-[11px] font-normal text-emerald-600 dark:text-emerald-400">
                            {col.cal}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <p className="text-xl font-medium tracking-tight text-muted-foreground">—</p>
                      <p className="mt-2 text-sm text-muted-foreground">{emptyNote}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {showBreakdown && (
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand</TableHead>
                  <TableHead>CCY</TableHead>
                  <TableHead className="text-right">Avg lead</TableHead>
                  <TableHead className="text-right">CAL avg lead</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timingRows.map((row) => (
                  <TableRow key={row.brand}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`size-2 rounded-full ${row.color}`} />
                        <span>{row.brand}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{row.ccy}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.avgLead}</TableCell>
                    <TableCell className="text-right tabular-nums text-emerald-600 dark:text-emerald-400">
                      {row.calAvgLead}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </TooltipProvider>
  )
}

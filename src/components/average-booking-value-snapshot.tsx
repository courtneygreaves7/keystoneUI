import { useState } from "react"
import { FileText, Info, LayoutList, Percent, Wallet, type LucideIcon } from "lucide-react"

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
import { cn } from "@/lib/utils"
import { type ActiveFilters, getAbvProfile } from "@/lib/chart-data"

type CurrencyColumn = {
  currency: "GBP" | "EUR"
  flag: "uk" | "eu"
  value: string
  cal: string
}

type CurrencyAbvMetric = {
  label: string
  icon: LucideIcon
  description: string
  columns: [CurrencyColumn, CurrencyColumn]
}

const BASE_ABV_ROWS = [
  { brand: "Partner Alpha",       ccy: "GBP", color: "bg-blue-500"   },
  { brand: "Partner Beta",        ccy: "GBP", color: "bg-cyan-500"   },
  { brand: "Partner Gamma (DK)",  ccy: "EUR", color: "bg-amber-500"  },
  { brand: "Partner Gamma (EUR)", ccy: "EUR", color: "bg-violet-500" },
  { brand: "Partner Delta (EUR)", ccy: "EUR", color: "bg-rose-500"   },
  { brand: "Partner Epsilon",     ccy: "GBP", color: "bg-lime-500"   },
  { brand: "Partner Zeta (DK)",   ccy: "EUR", color: "bg-pink-500"   },
  { brand: "Partner Zeta (EUR)",  ccy: "EUR", color: "bg-orange-500" },
]

const ABV_ROW_DATA: Record<string, Array<{ abv: string; calAbv: string; abvIncFee: string; calPricePct: string }>> = {
  "all-partners:all-brands": [
    { abv: "£742",   calAbv: "£890",   abvIncFee: "£768",   calPricePct: "7.2%" },
    { abv: "£615",   calAbv: "—",      abvIncFee: "£638",   calPricePct: "—"    },
    { abv: "€1,180", calAbv: "€1,340", abvIncFee: "€1,210", calPricePct: "9.4%" },
    { abv: "€1,320", calAbv: "—",      abvIncFee: "€1,365", calPricePct: "—"    },
    { abv: "€2,850", calAbv: "—",      abvIncFee: "€2,920", calPricePct: "—"    },
    { abv: "£3,100", calAbv: "—",      abvIncFee: "£3,180", calPricePct: "—"    },
    { abv: "€1,050", calAbv: "€1,210", abvIncFee: "€1,085", calPricePct: "9.8%" },
    { abv: "€1,140", calAbv: "€1,255", abvIncFee: "€1,175", calPricePct: "9.9%" },
  ],
  "partner-a:all-brands": [
    { abv: "£680",   calAbv: "£810",   abvIncFee: "£704",   calPricePct: "6.6%" },
    { abv: "£572",   calAbv: "—",      abvIncFee: "£594",   calPricePct: "—"    },
    { abv: "€1,020", calAbv: "€1,160", abvIncFee: "€1,048", calPricePct: "8.7%" },
    { abv: "€1,200", calAbv: "—",      abvIncFee: "€1,240", calPricePct: "—"    },
    { abv: "€2,620", calAbv: "—",      abvIncFee: "€2,685", calPricePct: "—"    },
    { abv: "£2,900", calAbv: "—",      abvIncFee: "£2,975", calPricePct: "—"    },
    { abv: "€960",   calAbv: "€1,095", abvIncFee: "€990",   calPricePct: "9.0%" },
    { abv: "€1,060", calAbv: "€1,160", abvIncFee: "€1,090", calPricePct: "9.2%" },
  ],
  "partner-b:all-brands": [
    { abv: "£820",   calAbv: "£980",   abvIncFee: "£850",   calPricePct: "8.0%" },
    { abv: "£680",   calAbv: "—",      abvIncFee: "£705",   calPricePct: "—"    },
    { abv: "€1,310", calAbv: "€1,490", abvIncFee: "€1,345", calPricePct: "10.1%"},
    { abv: "€1,460", calAbv: "—",      abvIncFee: "€1,510", calPricePct: "—"    },
    { abv: "€3,100", calAbv: "—",      abvIncFee: "€3,175", calPricePct: "—"    },
    { abv: "£3,380", calAbv: "—",      abvIncFee: "£3,465", calPricePct: "—"    },
    { abv: "€1,155", calAbv: "€1,330", abvIncFee: "€1,190", calPricePct: "10.5%"},
    { abv: "€1,250", calAbv: "€1,380", abvIncFee: "€1,290", calPricePct: "10.7%"},
  ],
  "partner-c:all-brands": [
    { abv: "£725",   calAbv: "£870",   abvIncFee: "£750",   calPricePct: "7.0%" },
    { abv: "£600",   calAbv: "—",      abvIncFee: "£622",   calPricePct: "—"    },
    { abv: "€1,140", calAbv: "€1,295", abvIncFee: "€1,170", calPricePct: "9.0%" },
    { abv: "€1,270", calAbv: "—",      abvIncFee: "€1,310", calPricePct: "—"    },
    { abv: "€2,750", calAbv: "—",      abvIncFee: "€2,820", calPricePct: "—"    },
    { abv: "£3,020", calAbv: "—",      abvIncFee: "£3,100", calPricePct: "—"    },
    { abv: "€1,020", calAbv: "€1,175", abvIncFee: "€1,055", calPricePct: "9.6%" },
    { abv: "€1,100", calAbv: "€1,210", abvIncFee: "€1,135", calPricePct: "9.7%" },
  ],
}

function getAbvRows(filters: ActiveFilters) {
  const key = `${filters.partner}:${filters.brand}`
  const rowData = ABV_ROW_DATA[key] ?? ABV_ROW_DATA["all-partners:all-brands"]
  return BASE_ABV_ROWS.map((base, i) => ({ ...base, ...rowData[i] }))
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

export function AverageBookingValueSnapshot({ filters }: { filters: ActiveFilters }) {
  const [showBreakdown, setShowBreakdown] = useState(false)
  const profile = getAbvProfile(filters)
  const abvRows = getAbvRows(filters)
  const currencyAbvMetrics: CurrencyAbvMetric[] = [
    {
      label: "ABV (excl. booking fee)",
      icon: Wallet,
      description: "Average booking value excluding the booking fee.",
      columns: [
        { currency: "GBP", flag: "uk", value: profile.gbpAbv, cal: profile.gbpCal },
        { currency: "EUR", flag: "eu", value: profile.eurAbv, cal: profile.eurCal },
      ],
    },
    {
      label: "ABV inc. booking fee",
      icon: FileText,
      description: "Average booking value including the booking fee.",
      columns: [
        { currency: "GBP", flag: "uk", value: profile.gbpAbvFee, cal: profile.gbpCalFee },
        { currency: "EUR", flag: "eu", value: profile.eurAbvFee, cal: profile.eurCalFee },
      ],
    },
  ]

  return (
    <TooltipProvider>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold tracking-wide uppercase">Average booking value</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setShowBreakdown((prev) => !prev)}
                aria-label={showBreakdown ? "Hide ABV breakdown" : "Show ABV breakdown"}
                className={`rounded-md p-1.5 transition-colors hover:bg-accent ${showBreakdown ? "text-foreground" : "text-muted-foreground"}`}
              >
                <LayoutList className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {showBreakdown
                ? "Hide partner breakdown"
                : "View ABV per partner — shows ABV, CAL ABV, ABV inc. fee and CAL price % by brand"}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {currencyAbvMetrics.map(({ label, icon: Icon, description, columns }) => (
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
                  <div className="grid grid-cols-2 divide-x divide-border">
                    {columns.map((column, index) => (
                      <div
                        key={column.currency}
                        className={cn("min-w-0 px-4", index === 0 && "pl-0", index === 1 && "pr-0")}
                      >
                        <div className="mb-1 flex items-center gap-1.5">
                          <FlagBadge type={column.flag} />
                          <span className="text-sm font-medium tracking-wide text-muted-foreground">
                            {column.currency}
                          </span>
                        </div>
                        <p className="text-xl font-medium tracking-tight">{column.value}</p>
                        <p className="mt-1 text-[11px] font-normal text-emerald-600 dark:text-emerald-400">
                          {column.cal}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader className="items-center">
              <div className="flex items-center gap-2">
                <div className="grid size-7 place-items-center rounded-md bg-muted text-muted-foreground">
                  <Percent className="size-3.5" />
                </div>
                <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                  CAL customer price
                </p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="More information about CAL customer price"
                  >
                    <Info className="size-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Share of customer price against ABV including booking fee.</TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent>
              <div className="border-t border-border pt-4">
                <p className="text-xl font-medium tracking-tight">{profile.calPct}</p>
                <p className="mt-2 text-sm text-muted-foreground">% of ABV inc. booking fee</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {showBreakdown && (
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand</TableHead>
                  <TableHead>CCY</TableHead>
                  <TableHead className="text-right">ABV</TableHead>
                  <TableHead className="text-right">CAL ABV</TableHead>
                  <TableHead className="text-right">ABV inc. fee</TableHead>
                  <TableHead className="text-right">CAL price %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {abvRows.map((row) => (
                  <TableRow key={row.brand}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`size-2 rounded-full ${row.color}`} />
                        <span>{row.brand}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{row.ccy}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.abv}</TableCell>
                    <TableCell className="text-right tabular-nums text-emerald-600 dark:text-emerald-400">{row.calAbv}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.abvIncFee}</TableCell>
                    <TableCell className="text-right tabular-nums text-emerald-600 dark:text-emerald-400">{row.calPricePct}</TableCell>
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

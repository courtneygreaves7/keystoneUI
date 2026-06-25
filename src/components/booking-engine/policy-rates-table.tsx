import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  formatCurrency,
  formatRate,
  type PolicyRate,
} from "@/lib/booking-engine-data"
import { cn } from "@/lib/utils"

type PolicyRatesTableProps = {
  policies: PolicyRate[]
  selectedBrandId: string | null
  compact?: boolean
  /** Renders at natural height for a parent with overflow-hidden (no scroll wrappers). */
  clipped?: boolean
  /** Fixed column layout for scaled dashboard previews. */
  preview?: boolean
}

export function PolicyRatesTable({
  policies,
  selectedBrandId,
  compact = false,
  clipped = false,
  preview = false,
}: PolicyRatesTableProps) {
  const tableContent = (
    <>
      <TableHeader>
        <TableRow className="bg-card hover:bg-card dark:bg-card dark:hover:bg-card">
          <TableHead className={cn(compact ? "h-8 px-3 text-xs" : "h-12 px-5", preview && "h-7 px-2 text-[10px]")}>
            Name / valid dates
          </TableHead>
          <TableHead className={cn("text-right", compact ? "h-8 px-3 text-xs" : "px-5", preview && "h-7 px-2 text-[10px]")}>
            Net rate
          </TableHead>
          <TableHead className={cn("text-right", compact ? "h-8 px-3 text-xs" : "px-5", preview && "h-7 px-2 text-[10px]")}>
            Gross rate
          </TableHead>
          <TableHead className={cn("text-right", compact ? "h-8 px-3 text-xs" : "px-5", preview && "h-7 px-2 text-[10px]")}>
            CAL commission
          </TableHead>
          <TableHead className={cn("text-right", compact ? "h-8 px-3 text-xs" : "px-5", preview && "h-7 px-2 text-[10px]")}>
            Max liability
          </TableHead>
          <TableHead className={cn(compact ? "h-8 px-3 text-xs" : "px-5", preview && "h-7 px-2 text-[10px]")}>
            Currency
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {policies.map((policy) => {
          const isHighlighted = selectedBrandId === policy.brandId
          const isActive = policy.status === "active"

          return (
            <TableRow
              key={policy.id}
              className={cn(isHighlighted && "bg-muted/40")}
            >
              <TableCell className={cn(compact ? "px-3 py-2" : "px-5 py-4", preview && "px-2 py-1.5")}>
                <div className="flex items-start gap-1.5">
                  <span
                    className={cn(
                      "shrink-0 rounded-full",
                      compact ? "mt-1 size-1.5" : "mt-1.5 size-2",
                      preview && "mt-0.5 size-1",
                      isActive ? "bg-primary" : "bg-muted-foreground/40"
                    )}
                  />
                  <div className="min-w-0">
                    <p
                      className={cn(
                        compact ? "text-xs" : "font-medium text-foreground",
                        preview && "truncate text-[10px] leading-tight",
                        !isActive && "font-normal text-muted-foreground",
                        isActive && !compact && "font-medium text-foreground"
                      )}
                    >
                      {policy.name}
                    </p>
                    <p
                      className={cn(
                        "text-muted-foreground",
                        compact ? "text-[11px]" : "text-xs",
                        preview && "truncate text-[9px] leading-tight"
                      )}
                    >
                      {policy.validFrom} – {policy.validTo}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell
                className={cn(
                  "text-right font-mono tabular-nums text-foreground",
                  compact ? "px-3 py-2 text-xs" : "px-5 py-4 text-sm",
                  preview && "px-2 py-1.5 text-[10px]"
                )}
              >
                {formatRate(policy.netRate)}
              </TableCell>
              <TableCell
                className={cn(
                  "text-right font-mono tabular-nums text-foreground",
                  compact ? "px-3 py-2 text-xs" : "px-5 py-4 text-sm",
                  preview && "px-2 py-1.5 text-[10px]"
                )}
              >
                {formatRate(policy.grossRate)}
              </TableCell>
              <TableCell
                className={cn(
                  "text-right font-mono tabular-nums text-foreground",
                  compact ? "px-3 py-2 text-xs" : "px-5 py-4 text-sm",
                  preview && "px-2 py-1.5 text-[10px]"
                )}
              >
                {policy.calCommission > 0 ? `${formatRate(policy.calCommission)}%` : "—"}
              </TableCell>
              <TableCell
                className={cn(
                  "text-right font-mono tabular-nums text-foreground",
                  compact ? "px-3 py-2 text-xs" : "px-5 py-4 text-sm",
                  preview && "px-2 py-1.5 text-[10px]"
                )}
              >
                {formatCurrency(policy.maxLiability, policy.currency)}
              </TableCell>
              <TableCell className={cn(compact ? "px-3 py-2 text-xs" : "px-5 py-4 text-sm", preview && "px-2 py-1.5 text-[10px]")}>
                {policy.currency}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </>
  )

  if (clipped) {
    return (
      <table
        className={cn(
          "w-full caption-bottom text-sm",
          preview && "table-fixed text-[10px]"
        )}
      >
        {preview ? (
          <colgroup>
            <col className="w-[30%]" />
            <col className="w-[12%]" />
            <col className="w-[12%]" />
            <col className="w-[14%]" />
            <col className="w-[20%]" />
            <col className="w-[12%]" />
          </colgroup>
        ) : null}
        {tableContent}
      </table>
    )
  }

  return (
    <div className={cn("overflow-hidden", !compact && "rounded-lg border border-border")}>
      <Table>{tableContent}</Table>
    </div>
  )
}

import { ArrowRight } from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type DataSnapshotRow = {
  label: string
  value: string
}

export type DataSnapshotWidgetProps = {
  title: string
  rows: DataSnapshotRow[]
  overviewHref?: string
  overviewLabel?: string
  className?: string
}

export function DataSnapshotWidget({
  title,
  rows,
  overviewHref,
  overviewLabel = "Link to Overview",
  className,
}: DataSnapshotWidgetProps) {
  return (
    <Card className={cn("bg-muted/30 shadow-xs", className)}>
      <CardHeader className={cn("pb-3", !overviewHref && "flex-row items-center")}>
        <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
        {overviewHref ? (
          <a
            href={overviewHref}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {overviewLabel}
            <ArrowRight className="size-3" />
          </a>
        ) : null}
      </CardHeader>

      <CardContent className="px-0 pb-0">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 border-t border-border px-5 py-3"
          >
            <span className="text-sm italic text-muted-foreground">{row.label}</span>
            <span className="text-sm font-semibold tabular-nums text-foreground">{row.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

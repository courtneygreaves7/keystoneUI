import { ArrowLeft, X } from "lucide-react"

import { PropertiesTable } from "@/components/booking-engine/properties-table"
import { Button } from "@/components/ui/button"
import { formatCount, type Partner } from "@/lib/booking-engine-data"
import { type PropertyListItem } from "@/lib/properties-list-data"

type PropertiesListPageProps = {
  partner: Partner
  properties: PropertyListItem[]
  onBack: () => void
  onViewProperty: (propertyId: string) => void
}

export function PropertiesListPage({
  partner,
  properties,
  onBack,
  onViewProperty,
}: PropertiesListPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-3 flex items-center justify-between gap-4">
          <nav className="text-xs text-muted-foreground">
            <span>Booking engine</span>
            <span className="mx-2">/</span>
            <span className="text-foreground">Properties</span>
          </nav>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onBack}
            className="shrink-0 text-xs"
          >
            <ArrowLeft className="size-3.5" />
            Back to partners
          </Button>
        </div>

        <h1 className="text-[22px] font-semibold tracking-tight">Properties</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatCount(partner.activity.properties)} properties
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-500/30 dark:bg-emerald-500/10">
        <p className="text-sm text-emerald-900 dark:text-emerald-100">
          Showing properties for <span className="font-semibold">{partner.name}</span>
        </p>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-emerald-800 transition-colors hover:text-emerald-950 dark:text-emerald-200 dark:hover:text-emerald-50"
        >
          Clear filter
          <X className="size-3.5" />
        </button>
      </div>

      <PropertiesTable properties={properties} onViewProperty={onViewProperty} />

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>
          Showing 1–{properties.length} of {formatCount(partner.activity.properties)}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs" disabled>
            ← Prev
          </Button>
          <span className="text-xs">Page 1 of 1</span>
          <Button variant="outline" size="sm" className="h-8 text-xs" disabled>
            Next →
          </Button>
        </div>
      </div>
    </div>
  )
}

import { ReportSection } from "@/components/report-section"
import { DataSnapshotWidget } from "@/components/widgets/data-snapshot-widget"
import { HeadlineDataWidget } from "@/components/widgets/headline-data-widget"
import { TooltipProvider } from "@/components/ui/tooltip"
import { type ActiveFilters, getCalFinProfile } from "@/lib/chart-data"

export function CalFinancials({ filters }: { filters: ActiveFilters }) {
  const profile = getCalFinProfile(filters)

  const breakdownRows = [
    { label: "IPT (GBP)", value: profile.ipt },
    { label: "PISL comm (GBP)", value: profile.pislComm },
    { label: "Capacity net (GBP)", value: profile.capacityNet },
    { label: "PISL amount payable (GBP)", value: profile.pislPayable },
    { label: "Premium inc. IPT (GBP)", value: profile.premiumInc },
    { label: "GWP (GBP)", value: profile.gwp },
  ]

  return (
    <TooltipProvider>
      <ReportSection
        title="CAL financials (GBP)"
        exportSlug="cal-financials"
        filters={filters}
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
          <HeadlineDataWidget
            title="Total payable"
            value={profile.totalPayable}
            label="GBP · primary liability"
            helpText="Total amount payable to partners in GBP for the selected period."
          />
          <DataSnapshotWidget
            title="Financial breakdown"
            rows={breakdownRows}
          />
        </div>
      </ReportSection>
    </TooltipProvider>
  )
}

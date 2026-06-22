import { DualDataWidget } from "@/components/dual-data-widget"
import { PartnerVolumeWidget } from "@/components/booking-engine/partner-volume-widget"
import { BreakdownDataWidget } from "@/components/widgets/breakdown-data-widget"
import { DataSnapshotWidget } from "@/components/widgets/data-snapshot-widget"
import { DualDataListWidget } from "@/components/widgets/dual-data-list-widget"
import { GraphWidget } from "@/components/widgets/graph-widget"
import { HeadlineDataWidget } from "@/components/widgets/headline-data-widget"
import { WidgetHelpButton } from "@/components/widgets/widget-help-button"
import { FIGURE_30PX_CLASS } from "@/lib/figure-styles"

const graphSampleData = [
  { label: "Jan", layer1: 12, layer2: 8, layer3: 4 },
  { label: "Feb", layer1: 18, layer2: 11, layer3: 6 },
  { label: "Mar", layer1: 24, layer2: 15, layer3: 9 },
  { label: "Apr", layer1: 31, layer2: 19, layer3: 11 },
  { label: "May", layer1: 38, layer2: 23, layer3: 13 },
  { label: "Jun", layer1: 46, layer2: 28, layer3: 15 },
]

const snapshotRows = [
  { label: "Property type", value: "Cottage" },
  { label: "Bedrooms", value: "4" },
  { label: "Bathrooms", value: "2" },
  { label: "Max occupancy", value: "6 guests" },
]

export function ComponentPreview({ id }: { id: string }) {
  switch (id) {
    case "headline-data-widget":
      return (
        <HeadlineDataWidget
          title="Total bookings"
          value="128,450"
          label="All selected partners and brands"
          helpText="Supporting context for this headline metric."
          valueClassName={FIGURE_30PX_CLASS}
        />
      )
    case "dual-data-widget":
      return (
        <DualDataWidget
          primaryTitle="Product split"
          datasetA={{
            title: "CAL",
            value: "23,304",
            clarification: "3% take-up",
          }}
          datasetB={{
            title: "DDL",
            value: "18,422",
            clarification: "2% take-up",
          }}
          helpText="Supporting context for this headline metric."
        />
      )
    case "dual-data-list-widget":
      return (
        <DualDataListWidget
          title="Engagement"
          rows={[
            { label: "Cancellation rate", value: "4.2%" },
            { label: "Repeat guests", value: "18%" },
          ]}
          helpText="Each row represents a separate metric."
        />
      )
    case "breakdown-data-widget":
      return (
        <BreakdownDataWidget
          title="Total volume"
          primaryValue="94,200"
          primaryLabel="All partners"
          subdataA={{ label: "CAL attach", value: "12,480", helpText: "Bookings with CAL." }}
          subdataB={{ label: "DDL attach", value: "8,920" }}
        />
      )
    case "data-snapshot-widget":
      return <DataSnapshotWidget title="Overview" rows={snapshotRows} />
    case "graph-widget":
      return (
        <GraphWidget
          title="Daily trend"
          explanation="Multi-series line chart with toggleable layers"
          xAxisKey="label"
          layers={[
            { id: "l1", label: "Series A", color: "#2563eb", dataKey: "layer1" },
            { id: "l2", label: "Series B", color: "#dc2626", dataKey: "layer2" },
            { id: "l3", label: "Series C", color: "#71717a", dataKey: "layer3" },
          ]}
          data={graphSampleData}
        />
      )
    case "widget-help-button":
      return (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
          <span className="text-sm text-muted-foreground">Hover the icon →</span>
          <WidgetHelpButton
            title="Example metric"
            helpText="Supporting context for this headline metric."
          />
        </div>
      )
    case "partner-volume-widget":
      return (
        <PartnerVolumeWidget
          volume={{
            datasetA: { title: "Sales", value: "42,310", clarification: "Total bookings" },
            datasetB: { title: "Properties", value: "8,420", clarification: "On platform" },
          }}
          productSplit={{
            datasetA: { title: "With CAL", value: "1,104", clarification: "2.6% of bookings" },
            datasetB: { title: "With DDL", value: "12", clarification: "0.0% of bookings" },
          }}
        />
      )
    default:
      return null
  }
}

export function hasComponentPreview(id: string) {
  return [
    "headline-data-widget",
    "dual-data-widget",
    "dual-data-list-widget",
    "breakdown-data-widget",
    "data-snapshot-widget",
    "graph-widget",
    "widget-help-button",
    "partner-volume-widget",
  ].includes(id)
}

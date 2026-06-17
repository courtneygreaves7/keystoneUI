import { useState } from "react"
import {
  ArrowLeft,
  Ban,
  BedDouble,
  CalendarCheck,
  MapPin,
  Moon,
  Users,
} from "lucide-react"

import { PropertyBookingsTable } from "@/components/booking-engine/property-bookings-table"
import { PropertyDetailsPanel } from "@/components/booking-engine/property-details"
import { PropertyInsights } from "@/components/booking-engine/property-insights"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Property } from "@/lib/property-data"
import { WILLOWCROFT_HOUSE_DETAILS } from "@/lib/property-details-data"

type PropertyPageProps = {
  property: Property
  onBack: () => void
}

type SnapshotCard = {
  label: string
  value: string
  subtext?: string
  icon: typeof Users
}

export function PropertyPage({ property, onBack }: PropertyPageProps) {
  const [listView, setListView] = useState<"list" | "timeline">("list")

  const cancellationCount = property.bookings.filter(
    (booking) => booking.status === "cancelled"
  ).length
  const avgNightsBooked = (
    property.bookings.reduce((sum, booking) => sum + booking.nights, 0) /
    property.bookings.length
  ).toFixed(1)

  const snapshotCards: SnapshotCard[] = [
    {
      label: "Partner / brand",
      value: property.partner,
      subtext: property.brand,
      icon: Users,
    },
    {
      label: "Location",
      value: property.location,
      subtext: property.country,
      icon: MapPin,
    },
    {
      label: "Max occupancy",
      value: property.maxOccupancy,
      icon: BedDouble,
    },
    {
      label: "Bookings",
      value: String(property.bookingCount),
      subtext: "total bookings",
      icon: CalendarCheck,
    },
    {
      label: "Avg nights booked",
      value: avgNightsBooked,
      subtext: "per booking",
      icon: Moon,
    },
    {
      label: "Cancellations",
      value: String(cancellationCount),
      subtext: "all time",
      icon: Ban,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-3 flex items-center justify-between gap-4">
          <nav className="text-xs text-muted-foreground">
            <span>Booking engine</span>
            <span className="mx-2">/</span>
            <span>Properties</span>
            <span className="mx-2">/</span>
            <span className="text-foreground">{property.id}</span>
          </nav>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onBack}
            className="shrink-0 text-xs"
          >
            <ArrowLeft className="size-3.5" />
            Back to properties
          </Button>
        </div>

        <h1 className="text-[22px] font-semibold tracking-tight">{property.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {property.postcode}, {property.county}
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2 lg:items-stretch">
        <div className="flex h-full min-h-0 flex-col gap-3 sm:flex-row">
          <div className="relative min-h-48 flex-1 overflow-hidden rounded-xl border border-border bg-muted/20 sm:min-h-0">
            <img
              src={property.imageUrl}
              alt={`${property.name} exterior`}
              className="absolute inset-0 h-full w-full object-cover object-[center_62%]"
            />
          </div>

          <div className="relative min-h-48 flex-1 overflow-hidden rounded-xl border border-border bg-[#f3f6f9] dark:bg-muted/20 sm:min-h-0">
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(to_right,rgb(36_55_72/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(36_55_72/0.06)_1px,transparent_1px)] bg-size-[28px_28px]"
            />
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
                <div className="grid size-10 place-items-center rounded-full bg-background shadow-xs">
                  <MapPin className="size-5 text-emerald-600" />
                </div>
                <p className="text-sm font-medium text-foreground">{property.location}</p>
                <p className="text-xs">{property.country}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid auto-rows-fr grid-cols-1 gap-3 min-[900px]:grid-cols-3">
          {snapshotCards.map((card) => (
            <SnapshotCard key={card.label} {...card} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Tabs defaultValue="bookings" className="gap-5">
          <TabsList className="bg-[var(--brand-grey-blue)] dark:bg-muted">
            <TabsTrigger value="bookings">Bookings ({property.bookingCount})</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="details">Property details</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-5">
            <div className="flex items-center gap-2">
              <Button
                variant={listView === "list" ? "default" : "ghost"}
                size="sm"
                className="h-8 text-xs"
                onClick={() => setListView("list")}
              >
                List
              </Button>
              <Button
                variant={listView === "timeline" ? "default" : "ghost"}
                size="sm"
                className="h-8 text-xs"
                onClick={() => setListView("timeline")}
              >
                Timeline
              </Button>
            </div>

            {listView === "list" ? (
              <>
                <PropertyBookingsTable bookings={property.bookings} />
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                  <p>
                    Showing 1–{property.bookings.length} of {property.bookings.length}
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
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/10 py-14 text-center">
                <p className="text-sm font-medium">Timeline view</p>
                <p className="text-sm text-muted-foreground">
                  Booking timeline will be available in a future release.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="insights">
            <PropertyInsights />
          </TabsContent>

          <TabsContent value="details">
            <PropertyDetailsPanel details={WILLOWCROFT_HOUSE_DETAILS} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function SnapshotCard({ label, value, subtext, icon: Icon }: SnapshotCard) {
  return (
    <Card className="flex h-full flex-col shadow-none">
      <CardHeader className="items-center p-3 pb-2">
        <div className="flex items-center gap-2">
          <div className="grid size-6 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
            <Icon className="size-3" />
          </div>
          <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-3 pt-0">
        <p className="text-base font-medium tracking-tight">{value}</p>
        <p className="mt-1 min-h-4 text-[11px] text-muted-foreground">{subtext ?? "\u00a0"}</p>
      </CardContent>
    </Card>
  )
}

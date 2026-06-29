import { useMemo, useState } from "react"
import {
  Download,
  PencilLine,
  Plus,
  Search,
} from "lucide-react"

import {
  PartnerDetailPanel,
  type PartnerDetailTab,
} from "@/components/booking-engine/partner-detail-panel"
import { AddPartnerPage } from "@/components/booking-engine/add-partner-page"
import { PartnerListItem } from "@/components/booking-engine/partner-list-item"
import { PropertyPage } from "@/components/booking-engine/property-page"
import type { BookingEngineAction, BookingEngineView } from "@/components/landing-dashboard-page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  BOOKING_ENGINE_PARTNERS,
  getPartnerTags,
  type Partner,
} from "@/lib/booking-engine-data"
import { MOCK_PROPERTY } from "@/lib/property-data"

const DEFAULT_PARTNER_ID = BOOKING_ENGINE_PARTNERS[0]?.id ?? ""

function partnerMatchesSearch(partner: Partner, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true

  const haystack = [
    partner.name,
    partner.initials,
    partner.dataRoute,
    partner.connectionType,
    ...partner.currencies,
    ...partner.products,
    ...getPartnerTags(partner),
    ...partner.brands.map((brand) => brand.name),
    ...partner.brands.map((brand) => brand.policyGroup),
  ]
    .join(" ")
    .toLowerCase()

  return haystack.includes(q)
}

function getInitialPasState(initialView: BookingEngineView) {
  switch (initialView) {
    case "properties":
      return {
        selectedPartnerId: DEFAULT_PARTNER_ID,
        initialTab: "properties" as PartnerDetailTab,
        editorMode: false,
      }
    case "bookings":
      return {
        selectedPartnerId: DEFAULT_PARTNER_ID,
        initialTab: "bookings" as PartnerDetailTab,
        editorMode: false,
      }
    case "partners":
    default:
      return {
        selectedPartnerId: DEFAULT_PARTNER_ID,
        initialTab: "overview" as PartnerDetailTab,
        editorMode: false,
      }
  }
}

type BookingEnginePageProps = {
  initialView?: BookingEngineView
  initialAction?: BookingEngineAction
}

export function BookingEnginePage({
  initialView = "partners",
  initialAction,
}: BookingEnginePageProps) {
  const initialState = getInitialPasState(initialView)
  const [selectedPartnerId, setSelectedPartnerId] = useState(initialState.selectedPartnerId)
  const [activeTab, setActiveTab] = useState<PartnerDetailTab>(initialState.initialTab)
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [editorMode] = useState(initialState.editorMode)
  const [partnerSearch, setPartnerSearch] = useState("")
  const [showAddPartner, setShowAddPartner] = useState(initialAction === "add-partner")

  const filteredPartners = useMemo(
    () => BOOKING_ENGINE_PARTNERS.filter((partner) => partnerMatchesSearch(partner, partnerSearch)),
    [partnerSearch]
  )

  const selectedPartner =
    BOOKING_ENGINE_PARTNERS.find((partner) => partner.id === selectedPartnerId) ??
    filteredPartners[0] ??
    BOOKING_ENGINE_PARTNERS[0]

  const maxPartnerBookings = useMemo(
    () => Math.max(...BOOKING_ENGINE_PARTNERS.map((partner) => partner.activity.bookings)),
    []
  )

  if (showAddPartner) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <AddPartnerPage onBack={() => setShowAddPartner(false)} />
      </div>
    )
  }

  if (selectedPropertyId) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <PropertyPage
          property={MOCK_PROPERTY}
          onBack={() => setSelectedPropertyId(null)}
        />
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="flex min-h-0 flex-1 flex-col gap-5">
        <div className="shrink-0 border-b border-border pb-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-[180px]">
              <h1 className="text-[22px] font-semibold tracking-tight">Partners &amp; policies</h1>
              <p className="mt-1 text-sm text-muted-foreground">YTD to June 2026</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" className="h-9 gap-2 text-xs">
                <Download className="size-3.5" />
                Export
              </Button>
              <Button
                className="h-9 gap-2 text-xs"
                onClick={() => setShowAddPartner(true)}
              >
                <Plus className="size-3.5" />
                Add partner
              </Button>
            </div>
          </div>
        </div>

        {editorMode ? (
          <div className="flex shrink-0 items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground">
            <PencilLine className="size-3.5 shrink-0 text-foreground" />
            <span>
              Editor mode — open the Brands tab and use Edit rates to update policy values.
            </span>
          </div>
        ) : null}

        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[232px_minmax(0,1fr)] lg:items-stretch">
          <aside className="flex min-h-0 flex-col overflow-hidden">
            <div className="relative mb-3 shrink-0">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={partnerSearch}
                onChange={(event) => {
                  const query = event.target.value
                  setPartnerSearch(query)
                  const matches = BOOKING_ENGINE_PARTNERS.filter((partner) =>
                    partnerMatchesSearch(partner, query)
                  )
                  if (
                    matches.length > 0 &&
                    !matches.some((partner) => partner.id === selectedPartnerId)
                  ) {
                    setSelectedPartnerId(matches[0].id)
                  }
                }}
                className="h-9 pl-9 text-xs"
                placeholder="Search partners…"
                aria-label="Search partners"
              />
            </div>
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
              {filteredPartners.length > 0 ? (
                filteredPartners.map((partner) => (
                  <PartnerListItem
                    key={partner.id}
                    partner={partner}
                    selected={partner.id === selectedPartner?.id}
                    maxBookings={maxPartnerBookings}
                    onSelect={() => setSelectedPartnerId(partner.id)}
                  />
                ))
              ) : (
                <p className="px-1 py-6 text-center text-xs text-muted-foreground">
                  No partners match your search.
                </p>
              )}
            </div>
          </aside>

          <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            {selectedPartner ? (
              <PartnerDetailPanel
                partner={selectedPartner}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onViewProperty={setSelectedPropertyId}
              />
            ) : null}
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}

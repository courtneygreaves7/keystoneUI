import { useEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"

import { type Partner } from "@/lib/booking-engine-data"
import { cn } from "@/lib/utils"

/** Design canvas width before scale-to-fit; content may extend past the clip frame. */
export const PARTNER_PANEL_PREVIEW_WIDTH = 760

const POLICY_TABLE_COLUMNS =
  "minmax(0,2.2fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1.1fr) minmax(0,0.8fr)"

type PartnerPanelPreviewProps = {
  partner: Partner
  className?: string
}

type ScaledPartnerPanelPreviewProps = {
  partner: Partner
  clipHeight?: number
  className?: string
}

type WireframeBarVariant = "subtle" | "default" | "emphasis"

function WireframeBar({
  className,
  variant = "default",
}: {
  className?: string
  variant?: WireframeBarVariant
}) {
  return (
    <div
      className={cn(
        "rounded-md",
        variant === "subtle" && "bg-muted-foreground/18",
        variant === "default" && "bg-muted-foreground/28",
        variant === "emphasis" && "bg-muted-foreground/38",
        className
      )}
      aria-hidden="true"
    />
  )
}

const STAT_SHAPES = [
  { label: "w-9", value: "w-[4.25rem]", sub: "w-12" },
  { label: "w-11", value: "w-[3.75rem]", sub: "w-10" },
  { label: "w-10", value: "w-[4rem]", sub: "w-14" },
  { label: "w-8", value: "w-7", sub: "w-11" },
] as const

function WireframeStat({ shape }: { shape: (typeof STAT_SHAPES)[number] }) {
  return (
    <div className="min-w-0 space-y-1">
      <WireframeBar variant="subtle" className={cn("h-1.5", shape.label)} />
      <WireframeBar variant="emphasis" className={cn("h-3.5", shape.value)} />
      <WireframeBar variant="subtle" className={cn("h-1.5", shape.sub)} />
    </div>
  )
}

function PreviewStatsWireframe() {
  return (
    <div className="rounded-lg border border-border bg-card p-2.5 shadow-xs">
      <div className="grid grid-cols-2 gap-x-2.5 gap-y-2.5">
        {STAT_SHAPES.map((shape, index) => (
          <WireframeStat key={index} shape={shape} />
        ))}
      </div>
    </div>
  )
}

function CurrenciesWireframe() {
  return (
    <div>
      <WireframeBar variant="subtle" className="mb-1.5 h-1.5 w-16" />
      <div className="flex gap-1.5">
        <div className="h-5 w-9 rounded-md border border-border/70 bg-card/70" />
        <div className="h-5 w-9 rounded-md border border-border/70 bg-card/70" />
      </div>
    </div>
  )
}

function BrandsWireframe() {
  return (
    <div>
      <WireframeBar variant="subtle" className="mb-1.5 h-1.5 w-12" />
      <div className="space-y-1">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className={cn(
              "rounded-md px-2 py-1.5",
              index === 0 ? "bg-muted/40" : index === 2 && "opacity-55"
            )}
          >
            <WireframeBar
              variant={index === 0 ? "default" : "subtle"}
              className="mb-1 h-2 w-14"
            />
            <WireframeBar variant="subtle" className="h-1.5 w-[4.5rem]" />
          </div>
        ))}
      </div>
    </div>
  )
}

function SidebarWireframe() {
  return (
    <div className="flex flex-col gap-2.5">
      <PreviewStatsWireframe />
      <CurrenciesWireframe />
      <BrandsWireframe />
    </div>
  )
}

function PolicyRatesRow({ faded = false }: { faded?: boolean }) {
  const barVariant = faded ? "subtle" : "default"

  return (
    <div
      className={cn(
        "grid items-center gap-1 rounded-md px-1.5 py-1.5",
        faded ? "opacity-55" : "bg-muted/35"
      )}
      style={{ gridTemplateColumns: POLICY_TABLE_COLUMNS }}
    >
      <div className="flex min-w-0 items-center gap-1 overflow-hidden">
        <div
          className={cn(
            "size-1.5 shrink-0 rounded-full",
            faded ? "bg-muted-foreground/20" : "bg-muted-foreground/35"
          )}
        />
        <WireframeBar variant={barVariant} className="h-2 min-w-0 flex-1" />
      </div>
      <WireframeBar variant={barVariant} className="h-2 w-full min-w-0" />
      <WireframeBar variant={barVariant} className="h-2 w-full min-w-0" />
      <WireframeBar variant={faded ? "subtle" : "emphasis"} className="h-2 w-full min-w-0" />
      <WireframeBar variant={barVariant} className="h-2 w-full min-w-0" />
      <WireframeBar variant="subtle" className="h-2 w-full min-w-0" />
    </div>
  )
}

function PolicyRatesWireframe() {
  return (
    <div className="min-w-0 overflow-hidden">
      <WireframeBar variant="subtle" className="mb-2 h-1.5 w-14" />

      <div className="space-y-1 overflow-hidden rounded-lg border border-border/70 bg-card/60 p-1.5">
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: POLICY_TABLE_COLUMNS }}
        >
          {Array.from({ length: 6 }, (_, index) => (
            <WireframeBar key={`header-${index}`} variant="subtle" className="h-1.5 w-full min-w-0" />
          ))}
        </div>

        <div className="space-y-1">
          <PolicyRatesRow />
          <PolicyRatesRow />
          <PolicyRatesRow faded />
        </div>
      </div>
    </div>
  )
}

export function ScaledPartnerPanelPreview({
  partner,
  className,
}: ScaledPartnerPanelPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const updateScale = () => {
      const width = element.clientWidth
      if (width > 0) {
        setScale(width / PARTNER_PANEL_PREVIEW_WIDTH)
      }
    }

    updateScale()
    const observer = new ResizeObserver(updateScale)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn(
        "h-full w-full overflow-hidden rounded-t-xl border border-b-0 border-border bg-card shadow-xs",
        className
      )}
    >
      <div
        className="pointer-events-none"
        style={{ width: PARTNER_PANEL_PREVIEW_WIDTH * scale }}
      >
        <div
          className="origin-top-left"
          style={{
            width: PARTNER_PANEL_PREVIEW_WIDTH,
            transform: `scale(${scale})`,
          }}
        >
          <PartnerPanelPreview partner={partner} className="rounded-none border-0 shadow-none" />
        </div>
      </div>
    </div>
  )
}

export function PartnerPanelPreview({ partner, className }: PartnerPanelPreviewProps) {
  return (
    <div
      className={cn("overflow-hidden rounded-xl border border-border bg-card", className)}
      style={{ width: PARTNER_PANEL_PREVIEW_WIDTH }}
    >
      <div className="flex items-center gap-3 border-b border-border px-4 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold">{partner.name}</p>
          <p className="text-[11px] text-muted-foreground">Data route: {partner.dataRoute}</p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <span className="inline-flex h-6 items-center gap-1 rounded-md border border-border px-2 text-[10px] text-muted-foreground">
            View bookings
            <ArrowRight className="size-2.5" />
          </span>
          <span className="inline-flex h-6 items-center gap-1 rounded-md border border-border px-2 text-[10px] text-muted-foreground">
            View properties
            <ArrowRight className="size-2.5" />
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,0.3fr)_minmax(0,0.7fr)] items-start gap-3 px-4 py-2.5">
        <SidebarWireframe />

        <div className="min-w-0 overflow-hidden bg-[var(--panel-bg)] px-2.5 py-2.5 dark:bg-canvas">
          <PolicyRatesWireframe />
        </div>
      </div>
    </div>
  )
}

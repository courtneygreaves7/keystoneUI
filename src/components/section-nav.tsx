import { useState } from "react"
import { ArrowRight, Layers, MapPin } from "lucide-react"

const NAV_ITEMS = [
  { label: "Bookings", anchor: "section-bookings" },
  { label: "Avg booking value", anchor: "section-abv" },
  { label: "Cal financials", anchor: "section-cal" },
  { label: "Timing", anchor: "section-timing" },
  { label: "Bookings vs stays", anchor: "section-bookings-vs-stays" },
  { label: "ABV (excl. fees) per day", anchor: "section-abv-per-day" },
  { label: "Avg lead time per day", anchor: "section-lead-time" },
  { label: "Bookings made per day", anchor: "section-bookings-per-day" },
  { label: "CAL & DDL take-up % per day", anchor: "section-cal-ddl-takeup" },
]

export function SectionNav() {
  const [open, setOpen] = useState(false)

  function scrollTo(anchor: string) {
    const el = document.getElementById(anchor)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="px-4 pb-2">
      {open && (
        <div className="mb-2 overflow-hidden rounded-xl border border-border bg-card text-foreground shadow-xs">
          <div className="flex items-center gap-2.5 px-4 py-3.5">
            <Layers className="size-3.5 shrink-0 text-muted-foreground" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Jump to section
            </p>
          </div>

          <div className="mx-4 h-px bg-border" />

          <nav className="py-2">
            {NAV_ITEMS.map(({ label, anchor }) => (
              <button
                key={anchor}
                type="button"
                onClick={() => scrollTo(anchor)}
                className="flex w-full items-center gap-3 px-4 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <ArrowRight className="size-3 shrink-0 text-muted-foreground" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle section navigation"
        className="flex h-9 w-full items-center justify-center gap-2 rounded-md border border-border bg-card px-4 text-sm font-medium transition-colors hover:bg-accent"
      >
        <MapPin className="size-4" />
        Jump to section
      </button>
    </div>
  )
}

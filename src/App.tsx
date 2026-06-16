import { useEffect, useState } from "react"
import {
  ArrowUpRight,
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  LayoutDashboard,
  MoonStar,
  Mountain,
  ShieldCheck,
  Sun,
} from "lucide-react"

import { FilterSidebar } from "@/components/filter-sidebar"
import { AverageBookingValueSnapshot } from "@/components/average-booking-value-snapshot"
import { BookingsSnapshot } from "@/components/bookings-snapshot"
import { CalFinancials } from "@/components/cal-financials"
import { SectionNav } from "@/components/section-nav"
import { TimingSnapshot } from "@/components/timing-snapshot"
import { AbvPerDayChart } from "@/components/charts/abv-per-day-chart"
import { BookingsMadePerDayChart } from "@/components/charts/bookings-made-per-day-chart"
import { BookingsVsStaysChart } from "@/components/charts/bookings-vs-stays-chart"
import { CalDdlTakeupChart } from "@/components/charts/cal-ddl-takeup-chart"
import { LeadTimeChart } from "@/components/charts/lead-time-chart"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { cn } from "@/lib/utils"
import { type ActiveFilters, DEFAULT_FILTERS } from "@/lib/chart-data"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Insights", icon: BarChart3, active: true },
  { label: "Admin", icon: ShieldCheck },
]

function App() {
  const [isDark, setIsDark] = useState(false)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)
  const [hasRun, setHasRun] = useState(false)
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(DEFAULT_FILTERS)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="h-screen overflow-hidden bg-background text-foreground">
      <div
        className={cn(
          "grid h-full transition-[grid-template-columns] duration-200",
          leftSidebarOpen ? "grid-cols-[230px_1fr]" : "grid-cols-[52px_1fr]"
        )}
      >
        <aside className="relative flex h-full flex-col border-r border-border bg-card">
          <button
            type="button"
            aria-label={leftSidebarOpen ? "Collapse left sidebar" : "Expand left sidebar"}
            onClick={() => setLeftSidebarOpen((prev) => !prev)}
            className="absolute top-1/2 right-0 z-20 flex h-16 w-5 translate-x-full -translate-y-1/2 items-center justify-center rounded-r-md border border-l-0 border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
          >
            {leftSidebarOpen ? (
              <ChevronLeft className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </button>

          {leftSidebarOpen ? (
            <div className="flex flex-1 flex-col overflow-hidden">
              <div className="px-6">
                <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border">
                  <div className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
                    <Mountain className="size-4" />
                  </div>
                  <span className="text-lg font-semibold">Keystone</span>
                </div>
                <nav className="mt-6 space-y-2">
                  {navItems.map(({ label, icon: Icon, active }) => (
                    <a
                      key={label}
                      href="#"
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors",
                        active
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Icon className="size-4" />
                      {label}
                    </a>
                  ))}
                </nav>
              </div>
              {hasRun && (
                <div className="mt-auto">
                  <SectionNav />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center pt-5 gap-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground mb-4">
                <Mountain className="size-4" />
              </div>
              {navItems.map(({ label, icon: Icon, active }) => (
                <a
                  key={label}
                  href="#"
                  aria-current={active ? "page" : undefined}
                  title={label}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-md transition-colors",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          )}
        </aside>

        <div className="flex h-full min-w-0 flex-col overflow-hidden">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Keystone</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Insights</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Sales metrics</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsDark((value) => !value)}
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun className="size-4" /> : <MoonStar className="size-4" />}
              </Button>
              <Button variant="outline" size="default">
                Logout
              </Button>
              <div className="ml-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                CG
              </div>
            </div>
          </header>

          <div
            className={cn(
              "grid min-h-0 flex-1 transition-[grid-template-columns] duration-200",
              rightSidebarOpen ? "grid-cols-[1fr_320px]" : "grid-cols-[1fr_52px]"
            )}
          >
            <section className="min-w-0 overflow-y-auto bg-canvas px-20 py-12 xl:px-24 xl:py-14">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-[22px] font-semibold tracking-tight">
                    Sales, cancellation &amp; re-let metrics
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Real-time across 3 partners
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" className="text-xs">
                    <Calendar className="size-3.5" />
                    Schedule report
                  </Button>
                  <Button variant="outline" className="text-xs">
                    <ArrowUpRight className="size-3.5" />
                    Compare
                  </Button>
                  <Button className="text-xs">
                    <Download className="size-3.5" />
                    Export
                  </Button>
                </div>
              </div>

              {!hasRun ? (
                <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-muted/20 py-16 text-center">
                  <div className="grid size-12 place-items-center rounded-xl bg-muted text-muted-foreground">
                    <BarChart3 className="size-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">No data to display</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Select your filters in the panel on the right, then press <strong>Run</strong> to load the report.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  <div id="section-bookings" className="scroll-mt-6 py-8">
                    <BookingsSnapshot filters={activeFilters} />
                  </div>

                  <div id="section-abv" className="scroll-mt-6 py-8">
                    <AverageBookingValueSnapshot filters={activeFilters} />
                  </div>

                  <div id="section-cal" className="scroll-mt-6 py-8">
                    <CalFinancials filters={activeFilters} />
                  </div>

                  <div id="section-timing" className="scroll-mt-6 py-8">
                    <TimingSnapshot filters={activeFilters} />
                  </div>

                  <div id="section-bookings-vs-stays" className="scroll-mt-6 py-8">
                    <BookingsVsStaysChart filters={activeFilters} />
                  </div>

                  <div id="section-abv-per-day" className="scroll-mt-6 py-8">
                    <AbvPerDayChart filters={activeFilters} />
                  </div>

                  <div id="section-lead-time" className="scroll-mt-6 py-8">
                    <LeadTimeChart filters={activeFilters} />
                  </div>

                  <div id="section-bookings-per-day" className="scroll-mt-6 py-8">
                    <BookingsMadePerDayChart filters={activeFilters} />
                  </div>

                  <div id="section-cal-ddl-takeup" className="scroll-mt-6 py-8">
                    <CalDdlTakeupChart filters={activeFilters} />
                  </div>
                </div>
              )}

            </section>

            <FilterSidebar
              open={rightSidebarOpen}
              onToggle={() => setRightSidebarOpen((prev) => !prev)}
              onRun={(filters) => {
                setActiveFilters(filters)
                setHasRun(true)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

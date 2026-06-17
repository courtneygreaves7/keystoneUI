export type PropertyInsightMetric = {
  id: string
  label: string
  value: string
  subtext?: string
}

export type MonthlyTrendPoint = {
  month: string
  bookingsMade: number
  stayStartMonth: number
}

export type BookingSourceItem = {
  label: string
  value: number
  type: "Channel" | "Web traffic"
  isWebTraffic?: boolean
  vsOther?: number
}

export const PROPERTY_INSIGHT_METRICS: PropertyInsightMetric[] = [
  {
    id: "avg-lead-days",
    label: "Avg lead days",
    value: "79.7 days",
    subtext: "booking date to stay",
  },
  {
    id: "avg-cancel-from-booking",
    label: "Avg cancel — from booking",
    value: "214.6 days",
    subtext: "days after booking made",
  },
  {
    id: "avg-cancel-to-stay",
    label: "Avg cancel — to stay",
    value: "130.5 days",
    subtext: "days before stay start",
  },
  {
    id: "avg-booking-value",
    label: "Avg booking value",
    value: "£648.55",
    subtext: "GBP",
  },
  {
    id: "cal-coverage",
    label: "CAL coverage",
    value: "0.0%",
    subtext: "0 of 12",
  },
  {
    id: "ddl-coverage",
    label: "DDL coverage",
    value: "0.0%",
    subtext: "0 of 12",
  },
  {
    id: "avg-nights",
    label: "Avg nights",
    value: "10.2",
    subtext: "per stay",
  },
  {
    id: "avg-guests",
    label: "Avg guests",
    value: "2.7",
    subtext: "per stay",
  },
  {
    id: "occupancy",
    label: "Occupancy (12M)",
    value: "33.4%",
    subtext: "nights booked / 365",
  },
  {
    id: "cancellation-rate",
    label: "Cancellation rate",
    value: "8.3%",
    subtext: "12 total bookings",
  },
  {
    id: "repeat-guests",
    label: "Repeat guests",
    value: "1",
    subtext: "guests with 2+ bookings",
  },
]

export const PROPERTY_MONTHLY_TRENDS: MonthlyTrendPoint[] = [
  { month: "Aug 25", bookingsMade: 1, stayStartMonth: 0 },
  { month: "Dec 25", bookingsMade: 1, stayStartMonth: 0 },
  { month: "Jan 26", bookingsMade: 1, stayStartMonth: 1 },
  { month: "Feb 26", bookingsMade: 5, stayStartMonth: 2 },
  { month: "Mar 26", bookingsMade: 1, stayStartMonth: 2 },
  { month: "Apr 26", bookingsMade: 0, stayStartMonth: 2 },
  { month: "May 26", bookingsMade: 0, stayStartMonth: 2 },
  { month: "Jul 26", bookingsMade: 0, stayStartMonth: 2 },
  { month: "Aug 26", bookingsMade: 0, stayStartMonth: 2 },
]

export const PROPERTY_RANKED_BOOKING_SOURCES: BookingSourceItem[] = [
  { label: "Direct", value: 8, type: "Channel" },
  { label: "Airbnb", value: 3, type: "Channel" },
  { label: "Booking.com", value: 1, type: "Channel" },
  { label: "Website traffic", value: 12, type: "Web traffic", isWebTraffic: true, vsOther: 0 },
]

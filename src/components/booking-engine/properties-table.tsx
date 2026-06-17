import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { type PropertyListItem } from "@/lib/properties-list-data"
import { cn } from "@/lib/utils"

type PropertiesTableProps = {
  properties: PropertyListItem[]
  onViewProperty: (propertyId: string) => void
}

function CountryBadge({ country }: { country: string }) {
  return (
    <span className="inline-flex rounded-md border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium">
      {country}
    </span>
  )
}

function PostcodeCell({ postcode }: { postcode: string }) {
  const isPlaceholder = postcode === "Unknown" || postcode === "Not set"

  return (
    <span className={cn("text-sm", isPlaceholder && "text-muted-foreground")}>{postcode}</span>
  )
}

export function PropertiesTable({ properties, onViewProperty }: PropertiesTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="h-12 px-5">Code</TableHead>
            <TableHead className="px-5">Name</TableHead>
            <TableHead className="px-5">Partner / brand</TableHead>
            <TableHead className="px-5">External ID</TableHead>
            <TableHead className="px-5">Postcode</TableHead>
            <TableHead className="px-5">Country</TableHead>
            <TableHead className="px-5 text-right">Max occ.</TableHead>
            <TableHead className="px-5 text-right">Bookings</TableHead>
            <TableHead className="px-5 text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow key={property.code}>
              <TableCell className="px-5 py-4 text-sm tabular-nums">{property.code}</TableCell>
              <TableCell className="px-5 py-4 text-sm">
                {property.name ?? <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell className="px-5 py-4 text-sm">
                {property.partner}
                <span className="text-muted-foreground"> · {property.brand}</span>
              </TableCell>
              <TableCell className="px-5 py-4 font-mono text-xs text-muted-foreground">
                {property.externalId}
              </TableCell>
              <TableCell className="px-5 py-4">
                <PostcodeCell postcode={property.postcode} />
              </TableCell>
              <TableCell className="px-5 py-4">
                <CountryBadge country={property.country} />
              </TableCell>
              <TableCell className="px-5 py-4 text-right text-sm tabular-nums">
                {property.maxOccupancy}
              </TableCell>
              <TableCell className="px-5 py-4 text-right text-sm tabular-nums">
                {property.bookings}
              </TableCell>
              <TableCell className="px-5 py-4 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  disabled={!property.propertyId}
                  onClick={() => property.propertyId && onViewProperty(property.propertyId)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

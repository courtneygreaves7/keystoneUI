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
  embedded?: boolean
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

export function PropertiesTable({
  properties,
  onViewProperty,
  embedded = false,
}: PropertiesTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="h-10 px-4 text-xs">Code</TableHead>
            <TableHead className="px-4 text-xs">Name</TableHead>
            <TableHead className="px-4 text-xs">{embedded ? "Brand" : "Partner / brand"}</TableHead>
            <TableHead className="px-4 text-xs">External ID</TableHead>
            <TableHead className="px-4 text-xs">Postcode</TableHead>
            <TableHead className="px-4 text-xs">Country</TableHead>
            <TableHead className="px-4 text-right text-xs">Max occ.</TableHead>
            <TableHead className="px-4 text-right text-xs">Bookings</TableHead>
            {!embedded ? <TableHead className="px-4 text-right text-xs" /> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow
              key={property.code}
              className={embedded && property.propertyId ? "cursor-pointer hover:bg-muted/30" : undefined}
              onClick={
                embedded && property.propertyId
                  ? () => onViewProperty(property.propertyId!)
                  : undefined
              }
            >
              <TableCell className="px-4 py-3 text-sm tabular-nums">{property.code}</TableCell>
              <TableCell className="px-4 py-3 text-sm">
                {property.name ?? <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell className="px-4 py-3 text-sm">
                {embedded ? (
                  <span className="text-muted-foreground">{property.brand}</span>
                ) : (
                  <>
                    {property.partner}
                    <span className="text-muted-foreground"> · {property.brand}</span>
                  </>
                )}
              </TableCell>
              <TableCell className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {property.externalId}
              </TableCell>
              <TableCell className="px-4 py-3">
                <PostcodeCell postcode={property.postcode} />
              </TableCell>
              <TableCell className="px-4 py-3">
                <CountryBadge country={property.country} />
              </TableCell>
              <TableCell className="px-4 py-3 text-right text-sm tabular-nums">
                {property.maxOccupancy}
              </TableCell>
              <TableCell className="px-4 py-3 text-right text-sm tabular-nums">
                {property.bookings}
              </TableCell>
              {!embedded ? (
                <TableCell className="px-4 py-3 text-right">
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
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

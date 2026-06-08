import { useRef } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { faker } from "@faker-js/faker"

type Row = {
  id: string
  name: string
  email: string
  status: "active" | "inactive" | "pending"
}

const STATUS_STYLES: Record<Row["status"], string> = {
  active: "text-emerald-400",
  inactive: "text-zinc-500",
  pending: "text-amber-400",
}

const ROWS: Row[] = Array.from({ length: 10_000 }, () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  status: faker.helpers.arrayElement(["active", "inactive", "pending"] as const),
}));

function RowItem({ row }: { row: Row }) {
  return (
    <div className="flex items-center gap-4 border-b border-border/50 px-4 py-2 text-xs">
      <span className="w-48 truncate font-medium text-card-foreground">{row.name}</span>
      <span className="min-w-0 flex-1 truncate text-muted-foreground">{row.email}</span>
      <span className={`w-16 shrink-0 font-mono capitalize ${STATUS_STYLES[row.status]}`}>
        {row.status}
      </span>
    </div>
  )
}

function VirtualList() {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: ROWS.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 37,
    overscan: 8,
  })

  return (
    <div ref={parentRef} className="w-full overflow-auto rounded-lg border border-border" style={{ height: 260 }}>
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map((item) => (
          <div
            key={item.key}
            style={{
              position: "absolute",
              top: item.start,
              left: 0,
              right: 0,
              height: item.size,
            }}
          >
            <RowItem row={ROWS[item.index]!} />
          </div>
        ))}
      </div>
    </div>
  )
}

function FlatList() {
  return (
    <div className="w-full overflow-auto rounded-lg border border-border" style={{height: 260}}>
      {ROWS.map((row) => (
        <RowItem key={row.id} row={row} />
      ))}
    </div>
  )
}

export function VirtualizationDemo({ optimized }: { optimized: boolean }) {
  return (
    <div className="flex w-full flex-col" style={{ height: 300 }}>
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="font-mono text-[10px] text-muted-foreground">
          {optimized ? "virtualizer · ~12 DOM nodes" : "flat render · 10,000 DOM nodes"}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          10,000 rows
        </span>
      </div>
      <div className="flex-1">
        {optimized ? <VirtualList /> : <FlatList />}
      </div>
    </div>
  )
}
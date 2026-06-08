import { useState, useTransition, useMemo } from "react"
import { faker } from "@faker-js/faker"

type Item = {
  id: string
  name: string
  category: string
  price: string
}

const ITEMS: Item[] = Array.from({ length: 50_000 }, () => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  category: faker.commerce.department(),
  price: faker.commerce.price({ symbol: "$" }),
}))

function filterItems(items: Item[], query: string): Item[] {
  if (!query) return items.slice(0, 100)
  const lower = query.toLowerCase()
  return items.filter((i) => i.name.toLowerCase().includes(lower)).slice(0, 100)
}

// --- Optimized: startTransition keeps input snappy ---
function OptimizedSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState(() => ITEMS.slice(0, 100))
  const [isPending, startTransition] = useTransition()

  function handleChange(value: string) {
    setQuery(value)
    startTransition(() => {
      setResults(filterItems(ITEMS, value))
    })
  }

  return (
    <SearchUI
      query={query}
      results={results}
      isPending={isPending}
      onChange={handleChange}
    />
  )
}

// --- Unoptimized: filtering blocks the main thread ---
function UnoptimizedSearch() {
  const [query, setQuery] = useState("")

  const results = useMemo(() => filterItems(ITEMS, query), [query])

  function handleChange(value: string) {
    setQuery(value)
  }

  return (
    <SearchUI
      query={query}
      results={results}
      isPending={false}
      onChange={handleChange}
    />
  )
}

function SearchUI({
  query,
  results,
  isPending,
  onChange,
}: {
  query: string
  results: Item[]
  isPending: boolean
  onChange: (v: string) => void
}) {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="relative">
        <input
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search 50,000 products..."
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-xs text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {isPending && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-muted-foreground">
            updating...
          </span>
        )}
      </div>

      <div
        className="overflow-auto rounded-lg border border-border"
        style={{ height: 180 }}
      >
        {results.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 border-b border-border/50 px-4 py-2 text-xs"
          >
            <span className="min-w-0 flex-1 truncate font-medium text-card-foreground">
              {item.name}
            </span>
            <span className="w-24 truncate text-muted-foreground">
              {item.category}
            </span>
            <span className="w-12 shrink-0 text-right font-mono text-primary">
              {item.price}
            </span>
          </div>
        ))}
      </div>

      <div className="font-mono text-[10px] text-muted-foreground">
        showing {results.length} of 50,000 items
      </div>
    </div>
  )
}

export function ConcurrentDemo({ optimized }: { optimized: boolean }) {
  return (
    <div className="flex w-full flex-col" style={{ minHeight: 260 }}>
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="font-mono text-[10px] text-muted-foreground">
          {optimized ? "startTransition · non-blocking" : "blocking · main thread"}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          50,000 items
        </span>
      </div>
      {optimized ? <OptimizedSearch /> : <UnoptimizedSearch />}
    </div>
  )
}

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CodePanel } from "@/components/code-panel"
import { DemoCard, DemoPlaceholder } from "@/components/demo-card"

type TabConfig = {
  value: string
  label: string
  title: string
  description: string
  filename: string
  code: string
  metrics: (optimized: boolean) => { label: string; value: string; accent?: boolean }[]
  placeholder: string
}

const TABS: TabConfig[] = [
  {
    value: "virtualization",
    label: "List Virtualization",
    title: "List Virtualization",
    description: "Render only the rows visible in the viewport instead of the entire dataset.",
    filename: "VirtualList.tsx",
    placeholder: "Virtualized list demo",
    metrics: (o) => [
      { label: "Rendered items", value: o ? "12 / 10,000" : "10,000 / 10,000", accent: true },
      { label: "DOM nodes", value: o ? "48" : "40,000" },
      { label: "Frame time", value: o ? "8ms" : "210ms", accent: true },
    ],
    code: `import { useVirtualizer } from "@tanstack/react-virtual"

function VirtualList({ rows }) {
  const parentRef = useRef(null)

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,
    overscan: 8,
  })

  return (
    <div ref={parentRef} className="h-80 overflow-auto">
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((item) => (
          <Row key={item.key} row={rows[item.index]} />
        ))}
      </div>
    </div>
  )
}`,
  },
  {
    value: "concurrent",
    label: "Concurrent Rendering",
    title: "Concurrent Rendering",
    description: "Keep the UI responsive by marking non-urgent updates as transitions.",
    filename: "SearchFilter.tsx",
    placeholder: "Concurrent search demo",
    metrics: (o) => [
      { label: "Input latency", value: o ? "2ms" : "180ms", accent: true },
      { label: "Mode", value: o ? "transition" : "blocking", accent: true },
      { label: "Dropped frames", value: o ? "0" : "37" },
    ],
    code: `function SearchFilter({ items }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState(items)
  const [isPending, startTransition] = useTransition()

  function onChange(value) {
    setQuery(value) // urgent: keep input snappy

    startTransition(() => {
      // non-urgent: expensive filtering
      setResults(filterItems(items, value))
    })
  }

  return (
    <>
      <input value={query} onChange={(e) => onChange(e.target.value)} />
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </>
  )
}`,
  },
  {
    value: "normalization",
    label: "State Normalization",
    title: "State Normalization",
    description: "Store entities by id to avoid deep updates and unnecessary re-renders.",
    filename: "store.ts",
    placeholder: "Normalized state demo",
    metrics: (o) => [
      { label: "Re-renders / update", value: o ? "1" : "240", accent: true },
      { label: "Lookup", value: o ? "O(1)" : "O(n)", accent: true },
      { label: "Update cost", value: o ? "0.3ms" : "14ms" },
    ],
    code: `// Normalized shape: entities keyed by id
type State = {
  byId: Record<string, Todo>
  allIds: string[]
}

function toggleTodo(state, id) {
  return {
    ...state,
    byId: {
      ...state.byId,
      [id]: { ...state.byId[id], done: !state.byId[id].done },
    },
  }
}

// Components select a single entity by id, so only
// the affected row re-renders.
const todo = useStore((s) => s.byId[id])`,
  },
  {
    value: "vitals",
    label: "Core Web Vitals",
    title: "Core Web Vitals",
    description: "Track LCP, INP, and CLS to quantify real-world user experience.",
    filename: "reportVitals.ts",
    placeholder: "Web Vitals monitor",
    metrics: (o) => [
      { label: "LCP", value: o ? "1.1s" : "3.8s", accent: true },
      { label: "INP", value: o ? "32ms" : "420ms", accent: true },
      { label: "CLS", value: o ? "0.02" : "0.31", accent: true },
    ],
    code: `import { onLCP, onINP, onCLS } from "web-vitals"

function sendToAnalytics(metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    id: metric.id,
  })

  navigator.sendBeacon("/analytics", body)
}

onLCP(sendToAnalytics)
onINP(sendToAnalytics)
onCLS(sendToAnalytics)`,
  },
]

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <PerformanceTabs />
    </main>
  )
}

function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary/15 ring-1 ring-primary/30">
            <span className="font-mono text-sm font-semibold text-primary">{"</>"}</span>
          </div>
          <h1 className="text-sm font-semibold tracking-tight">React Performance Lab</h1>
        </div>
        <span className="font-mono text-xs text-muted-foreground">v1.0 · Portfolio</span>
      </div>
    </header>
  )
}

function PerformanceTabs() {
  // Track optimization state per tab independently.
  const [optimized, setOptimized] = useState<Record<string, boolean>>({})

  return (
    <Tabs defaultValue={TABS[0]?.value} className="mx-auto max-w-7xl gap-0 px-4 py-6 sm:px-6">
      <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1">
        {TABS.map((t) => (
          <TabsTrigger
            key={t.value}
            value={t.value}
            className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {TABS.map((t) => {
        const isOn = optimized[t.value] ?? false
        return (
          <TabsContent key={t.value} value={t.value} className="mt-6">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
              {/* left: interactive demo (60%) */}
              <div className="lg:col-span-3">
                <DemoCard
                  title={t.title}
                  description={t.description}
                  optimized={isOn}
                  onOptimizedChange={(v) => setOptimized((s) => ({ ...s, [t.value]: v }))}
                  metrics={t.metrics(isOn)}
                >
                  <DemoPlaceholder label={t.placeholder} />
                </DemoCard>
              </div>

              {/* right: code snippet (40%) */}
              <div className="lg:col-span-2">
                <div className="mb-2 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-border font-mono text-[10px] font-normal text-muted-foreground"
                  >
                    KEY TECHNIQUE
                  </Badge>
                </div>
                <CodePanel code={t.code} filename={t.filename} className="h-[calc(100%-1.75rem)] min-h-105" />
              </div>
            </div>
          </TabsContent>
        )
      })}
    </Tabs>
  )
}


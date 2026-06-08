type TabConfig = {
  value: string
  label: string
  title: string
  description: string
  filename: string
  code: string
  metrics: (optimized: boolean) => { label: string; value: string; accent?: boolean }[]
  placeholder: string,
  section_description?: string
}

export const TABS: TabConfig[] = [
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
    section_description: `Instead of rendering all 10,000 rows into the DOM, only the items 
      currently visible in the viewport are mounted. As you scroll, items 
      entering the viewport are created and items leaving it are destroyed. 
      This keeps DOM nodes constant (~12) regardless of dataset size, 
      dramatically reducing memory usage and paint time.`,
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
    section_description: `React 18 introduced concurrent features that allow rendering work to 
      be interrupted. startTransition marks the list filtering as a 
      non-urgent update — React prioritizes keeping the input responsive 
      and defers the expensive re-render of results. Toggle off to feel 
      the input lag when both updates block the main thread synchronously.`
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
    section_description: `Nested state forces React to re-render every component in the tree 
      when any item changes. A normalized store keeps entities flat, keyed 
      by id — updating a single product is an O(1) dictionary lookup 
      instead of an O(n) array traversal. Combined with memo(), only the 
      affected row re-renders. Click the hearts to see the difference.`
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
    section_description: `LCP, INP, and CLS are Google's metrics for measuring real-world user 
      experience. LCP tracks how fast the main content loads, INP measures 
      interaction responsiveness, and CLS quantifies unexpected layout 
      shifts. Values update every 2 seconds to simulate live monitoring. 
      Thresholds follow Google's official guidelines.`
  },
];

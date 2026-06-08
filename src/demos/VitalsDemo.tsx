import { useState, useEffect } from "react"

type Rating = "good" | "needs-improvement" | "poor"

type Vital = {
  name: string
  abbr: string
  value: number
  unit: string
  rating: Rating
  description: string
  thresholds: { good: number; poor: number }
  format: (v: number) => string
}

const RATING_STYLES: Record<Rating, { color: string; label: string }> = {
  good: { color: "text-emerald-400", label: "Good" },
  "needs-improvement": { color: "text-amber-400", label: "Needs Improvement" },
  poor: { color: "text-red-400", label: "Poor" },
}

const RATING_BAR: Record<Rating, string> = {
  good: "bg-emerald-400",
  "needs-improvement": "bg-amber-400",
  poor: "bg-red-400",
}

function getRating(value: number, thresholds: { good: number; poor: number }): Rating {
  if (value <= thresholds.good) return "good"
  if (value >= thresholds.poor) return "poor"
  return "needs-improvement"
}

function jitter(value: number, amount: number): number {
  return value + (Math.random() - 0.5) * amount
}

const GOOD_VALUES = {
  lcp: 1.2,
  inp: 45,
  cls: 0.05,
}

const POOR_VALUES = {
  lcp: 4.2,
  inp: 380,
  cls: 0.28,
}

function buildVitals(optimized: boolean): Vital[] {
  const v = optimized ? GOOD_VALUES : POOR_VALUES

  return [
    {
      name: "Largest Contentful Paint",
      abbr: "LCP",
      value: jitter(v.lcp, optimized ? 0.1 : 0.4),
      unit: "s",
      thresholds: { good: 2.5, poor: 4.0 },
      description: "Time until the largest visible element is rendered.",
      format: (n: number) => n.toFixed(2) + "s",
      rating: "good",
    },
    {
      name: "Interaction to Next Paint",
      abbr: "INP",
      value: jitter(v.inp, optimized ? 10 : 40),
      unit: "ms",
      thresholds: { good: 200, poor: 500 },
      description: "Latency of the slowest interaction during the page lifecycle.",
      format: (n: number) => Math.round(n) + "ms",
      rating: "good",
    },
    {
      name: "Cumulative Layout Shift",
      abbr: "CLS",
      value: jitter(v.cls, optimized ? 0.01 : 0.05),
      unit: "",
      thresholds: { good: 0.1, poor: 0.25 },
      description: "Sum of unexpected layout shifts during the page lifecycle.",
      format: (n: number) => n.toFixed(3),
      rating: "good",
    },
  ].map((vital) => ({
    ...vital,
    rating: getRating(vital.value, vital.thresholds),
  }))
}

function GaugeBar({ value, thresholds }: { value: number; thresholds: { good: number; poor: number } }) {
  const rating = getRating(value, thresholds)
  const pct = Math.min((value / thresholds.poor) * 100, 100)

  return (
    <div className="mt-3 h-1.5 w-full rounded-full bg-border">
      <div
        className={`h-full rounded-full transition-all duration-700 ${RATING_BAR[rating]}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function VitalCard({ vital }: { vital: Vital }) {
  const style = RATING_STYLES[vital.rating]

  return (
    <div className="flex flex-col rounded-lg border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="font-mono text-xs font-semibold text-card-foreground">
            {vital.abbr}
          </span>
          <p className="mt-0.5 text-[10px] text-muted-foreground">{vital.name}</p>
        </div>
        <span className={`font-mono text-xs ${style.color}`}>{style.label}</span>
      </div>

      <div className={`mt-3 font-mono text-2xl font-semibold tabular-nums ${style.color}`}>
        {vital.format(vital.value)}
      </div>

      <GaugeBar value={vital.value} thresholds={vital.thresholds} />

      <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
        {vital.description}
      </p>
    </div>
  )
}

export function VitalsDemo({ optimized }: { optimized: boolean }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1)
    }, 2000)
    return () => clearInterval(interval)
  }, [optimized])

  const vitals = buildVitals(optimized)

  return (
    <div className="flex w-full flex-col" style={{ minHeight: 260 }}>
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="font-mono text-[10px] text-muted-foreground">
          {optimized ? "optimized · all metrics green" : "unoptimized · metrics degraded"}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          live · updates every 2s
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {vitals.map((v) => (
          <VitalCard key={v.abbr} vital={v} />
        ))}
      </div>
    </div>
  )
}
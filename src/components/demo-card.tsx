import type { ReactNode } from "react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type Metric = {
  label: string
  value: string
  /** highlight the value in the accent color when optimization is on */
  accent?: boolean
}

export function DemoCard({
  title,
  description,
  optimized,
  onOptimizedChange,
  metrics,
  children,
}: {
  title: string
  description: string
  optimized: boolean
  onOptimizedChange: (value: boolean) => void
  metrics: Metric[]
  children: ReactNode
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      {/* header */}
      <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <h2 className="text-sm font-medium text-card-foreground">{title}</h2>
          <p className="mt-1 text-pretty text-xs leading-relaxed text-muted-foreground">{description}</p>
        </div>

        {/* optimization toggle */}
        <label className="flex shrink-0 cursor-pointer items-center gap-2.5 select-none">
          <span
            className={cn(
              "font-mono text-[11px] uppercase tracking-wide transition-colors",
              optimized ? "text-primary" : "text-muted-foreground",
            )}
          >
            {optimized ? "ON" : "OFF"}
          </span>
          <Switch checked={optimized} onCheckedChange={onOptimizedChange} aria-label="Toggle optimization" />
        </label>
      </div>

      {/* demo surface (placeholder content) */}
      <div className="relative flex-1 overflow-hidden p-5">
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "linear-gradient(to right, oklch(1 0 0 / 3%) 1px, transparent 1px), linear-gradient(to bottom, oklch(1 0 0 / 3%) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative flex h-full min-h-65 items-center justify-center">{children}</div>
      </div>

      {/* metrics bar */}
      <div className="grid grid-cols-3 gap-px border-t border-border bg-border">
        {metrics.map((m) => (
          <div key={m.label} className="bg-card px-4 py-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{m.label}</div>
            <div
              className={cn(
                "mt-1 font-mono text-sm tabular-nums",
                m.accent && optimized ? "text-primary" : "text-card-foreground",
              )}
            >
              {m.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Generic dashed placeholder for the demo area. */
export function DemoPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/80 px-6 py-12 text-center">
      <span className="font-mono text-xs text-muted-foreground">{label}</span>
      <span className="font-mono text-[11px] text-muted-foreground/50">{"// add your demo logic here"}</span>
    </div>
  )
}

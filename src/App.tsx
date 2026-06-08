import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CodePanel } from "@/components/code-panel"
import { DemoCard } from "@/components/demo-card"
import { TABS } from "./tab.config"
import { DemoPlaceholder } from "./components/demo-placeholder"
import { VirtualizationDemo } from "./demos/VirtualizationDemo"
import { ConcurrentDemo } from "./demos/ConcurrentDemo"
import { NormalizationDemo } from "./demos/NormalizationDemo"
import { VitalsDemo } from "./demos/VitalsDemo"

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
          <span className="font-mono text-xs text-muted-foreground"> · Tomas Gimenez</span>
        </div>
      </div>
    </header>
  )
}

function PerformanceTabs() {
  // Track optimization state per tab independently.
  const [optimized, setOptimized] = useState<Record<string, boolean>>({
    virtualization: true
  })

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
                  {t.value === "virtualization" ? (
                    <VirtualizationDemo optimized={isOn} />
                  ) : t.value === "concurrent" ? (
                    <ConcurrentDemo optimized={isOn} />
                  ) : t.value === "normalization" ? (
                    <NormalizationDemo optimized={isOn} />
                  ) : t.value === "vitals" ? (
                    <VitalsDemo optimized={isOn} />
                  ) : (
                    <DemoPlaceholder label={t.placeholder} />
                  )}
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

            <div className="mt-6 flex items-center gap-2">
              <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card p-5">
                    {t?.section_description}
              </div>
            </div>

          </TabsContent>
        )
      })}
    </Tabs>
  )
}


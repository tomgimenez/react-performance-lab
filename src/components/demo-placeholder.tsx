/** Generic dashed placeholder for the demo area. */
export const DemoPlaceholder = ({ label }: { label: string }) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/80 px-6 py-12 text-center">
      <span className="font-mono text-xs text-muted-foreground">{label}</span>
      <span className="font-mono text-[11px] text-muted-foreground/50">{"// add your demo logic here"}</span>
    </div>
  )
}

import { useState, useRef, useCallback, memo } from "react"
import { faker } from "@faker-js/faker"

type Product = {
  id: string
  name: string
  category: string
  price: number
  liked: boolean
}

type NormalizedState = {
  byId: Record<string, Product>
  allIds: string[]
}

function toNormalized(products: Product[]): NormalizedState {
  return {
    byId: Object.fromEntries(products.map((p) => [p.id, p])),
    allIds: products.map((p) => p.id),
  }
}

const INITIAL_PRODUCTS = Array.from({ length: 20 }, () => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  category: faker.commerce.department(),
  price: Number(faker.commerce.price()),
  liked: false,
}));

// --- Re-render counter ---
function useRenderCount() {
  const count = useRef(0);
  count.current += 1
  return count.current
}

const renderCounts = new Map<string, number>()

function getRenderCount(id: string): number {
  return renderCounts.get(id) ?? 0
}

function incrementRenderCount(id: string): number {
  const next = (renderCounts.get(id) ?? 0) + 1
  renderCounts.set(id, next)
  return next
}

// --- Normalized version ---
const NormalizedRow = memo(function NormalizedRow({
  product,
  onToggle,
}: {
  product: Product
  onToggle: (id: string) => void
}) {
  
  const [renders, setRenders] = useState(() => getRenderCount(product.id))

  function handleToggle() {
    const next = incrementRenderCount(product.id)
    setRenders(next)
    onToggle(product.id)
  }
  
  return (
    <ProductRow
      product={product}
      renders={renders}
      onToggle={handleToggle}
    />
  )
})

function NormalizedList() {
  const [state, setState] = useState<NormalizedState>(() =>
    toNormalized(INITIAL_PRODUCTS)
  )

  const toggle = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      byId: {
        ...s.byId,
        [id]: { ...s.byId[id]!, liked: !s.byId[id]!.liked },
      },
    }))
  }, [])

  return (
    <div className="overflow-auto rounded-lg border border-border" style={{ height: 220 }}>
      {state.allIds.map((id) => (
        <NormalizedRow key={id} product={state.byId[id]!} onToggle={toggle} />
      ))}
    </div>
  )
}

// --- Unnormalized version ---
function UnnormalizedRow({
  product,
  onToggle,
}: {
  product: Product
  onToggle: (id: string) => void
}) {
  const renders = useRenderCount()
  return (
    <ProductRow
      product={product}
      renders={renders}
      onToggle={() => onToggle(product.id)}
    />
  )
}

function UnnormalizedList() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)

  function toggle(id: string) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, liked: !p.liked } : p))
    )
  }

  return (
    <div className="overflow-auto rounded-lg border border-border" style={{ height: 220 }}>
      {products.map((p) => (
        <UnnormalizedRow key={p.id} product={p} onToggle={toggle} />
      ))}
    </div>
  )
}

// --- Shared row UI ---
function ProductRow({
  product,
  renders,
  onToggle,
}: {
  product: Product
  renders: number
  onToggle: () => void
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border/50 px-4 py-2 text-xs">
      <button
        onClick={onToggle}
        className="shrink-0 text-base leading-none transition-transform hover:scale-110"
      >
        {product.liked ? "❤️" : "🤍"}
      </button>
      <span className="min-w-0 flex-1 truncate font-medium text-card-foreground">
        {product.name}
      </span>
      <span className="w-20 truncate text-muted-foreground">{product.category}</span>
      <span className="w-14 shrink-0 text-right font-mono text-primary">
        ${product.price}
      </span>
      <span
        className={`w-16 shrink-0 text-right font-mono text-[10px] ${
          renders > 1 ? "text-amber-400" : "text-emerald-400"
        }`}
      >
        ×{renders} render{renders !== 1 ? "s" : ""}
      </span>
    </div>
  )
}

// --- Export ---
export function NormalizationDemo({ optimized }: { optimized: boolean }) {
  return (
    <div className="flex w-full flex-col" style={{ minHeight: 260 }}>
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="font-mono text-[10px] text-muted-foreground">
          {optimized
            ? "normalized · O(1) update · memo() rows"
            : "nested array · O(n) update · all rows re-render"}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          20 items
        </span>
      </div>
      {optimized ? <NormalizedList /> : <UnnormalizedList />}
    </div>
  )
}
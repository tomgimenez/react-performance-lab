import { cn } from "@/lib/utils"

type Token = { text: string; type?: "keyword" | "string" | "comment" | "fn" | "punct" | "num" | "tag" }

// A tiny, dependency-free tokenizer good enough for display purposes.
const KEYWORDS = new Set([
  "import",
  "from",
  "export",
  "default",
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "for",
  "while",
  "new",
  "useState",
  "useMemo",
  "useCallback",
  "useTransition",
  "useDeferredValue",
  "memo",
  "async",
  "await",
  "type",
  "interface",
])

function tokenize(line: string): Token[] {
  const tokens: Token[] = []
  // Comments take the whole rest of the line.
  const commentIdx = line.indexOf("//")
  let work = line
  let trailingComment: string | null = null
  if (commentIdx !== -1) {
    trailingComment = line.slice(commentIdx)
    work = line.slice(0, commentIdx)
  }

  const regex = /(\s+)|("[^"]*"|'[^']*'|`[^`]*`)|(\b\d+(\.\d+)?\b)|([A-Za-z_$][\w$]*)|([{}()[\].,;:=<>+\-*/&|!?])/g
  let match: RegExpExecArray | null
  while ((match = regex.exec(work)) !== null) {
    if (match[1]) tokens.push({ text: match[1] })
    else if (match[2]) tokens.push({ text: match[2], type: "string" })
    else if (match[3]) tokens.push({ text: match[3], type: "num" })
    else if (match[5]) {
      const word = match[5]
      if (KEYWORDS.has(word)) tokens.push({ text: word, type: "keyword" })
      else {
        // function-call heuristic: followed by "("
        const next = work[regex.lastIndex]
        tokens.push({ text: word, type: next === "(" ? "fn" : undefined })
      }
    } else if (match[6]) tokens.push({ text: match[6], type: "punct" })
    else tokens.push({ text: match[0] })
  }

  if (trailingComment) tokens.push({ text: trailingComment, type: "comment" })
  return tokens
}

const TOKEN_CLASS: Record<NonNullable<Token["type"]>, string> = {
  keyword: "text-[oklch(0.72_0.16_300)]",
  string: "text-[oklch(0.78_0.13_150)]",
  comment: "text-muted-foreground/60 italic",
  fn: "text-primary",
  punct: "text-muted-foreground",
  num: "text-[oklch(0.8_0.12_70)]",
  tag: "text-primary",
}

export function CodePanel({
  code,
  filename = "demo.tsx",
  className,
}: {
  code: string
  filename?: string
  className?: string
}) {
  const lines = code.replace(/\n$/, "").split("\n")

  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border border-border bg-[oklch(0.11_0.01_280)]",
        className,
      )}
    >
      {/* editor chrome */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="size-3 rounded-full bg-[oklch(0.65_0.18_25)]/70" />
        <span className="size-3 rounded-full bg-[oklch(0.8_0.13_85)]/70" />
        <span className="size-3 rounded-full bg-[oklch(0.75_0.15_150)]/70" />
        <span className="ml-2 font-mono text-xs text-muted-foreground">{filename}</span>
      </div>

      {/* code */}
      <div className="flex-1 overflow-auto">
        <pre className="min-w-full py-3 font-mono text-[13px] leading-relaxed">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="flex px-4 hover:bg-foreground/2">
                <span className="mr-4 w-6 shrink-0 select-none text-right text-muted-foreground/40">{i + 1}</span>
                <span className="whitespace-pre">
                  {tokenize(line).map((t, j) => (
                    <span key={j} className={t.type ? TOKEN_CLASS[t.type] : "text-foreground/90"}>
                      {t.text}
                    </span>
                  ))}
                  {line.length === 0 ? "\u00A0" : null}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}

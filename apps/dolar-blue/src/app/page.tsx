"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────

interface DolarQuote {
  moneda: string;
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
  variacion?: number;
}

// ─── Config ──────────────────────────────────────────────

const API_URL = "https://dolarapi.com/v1/ambito/dolares";

const DISPLAY_ORDER = [
  "cripto",
  "blue",
  "oficial",
  "bolsa",
  "contadoconliqui",
  "tarjeta",
  "mayorista",
];

const DISPLAY_NAMES: Record<string, string> = {
  blue: "Dólar Blue",
  oficial: "Dólar Oficial",
  bolsa: "Dólar MEP",
  contadoconliqui: "Dólar CCL",
  cripto: "Dólar Cripto",
  tarjeta: "Dólar Tarjeta",
  mayorista: "Dólar Mayorista",
};

const DESCRIPTIONS: Record<string, string> = {
  blue: "Mercado informal",
  oficial: "Banco Nación",
  bolsa: "Bolsa de valores",
  contadoconliqui: "Contado con liquidación",
  cripto: "Exchanges crypto",
  tarjeta: "Consumos en el exterior",
  mayorista: "Mercado mayorista",
};

// ─── Helpers ─────────────────────────────────────────────

function formatARS(value: number | null | undefined): string {
  if (value == null) return "—";
  return `$ ${Math.round(value).toLocaleString("es-AR")}`;
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires",
  });
}

function getLatestUpdate(quotes: DolarQuote[]): string {
  if (quotes.length === 0) return "";
  const latest = quotes.reduce((a, b) =>
    new Date(a.fechaActualizacion) > new Date(b.fechaActualizacion) ? a : b
  );
  return formatTime(latest.fechaActualizacion);
}

// ─── Components ──────────────────────────────────────────

function RefreshIcon({ spinning }: { spinning: boolean }) {
  return (
    <svg
      className={spinning ? "spin" : ""}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
    </svg>
  );
}

function VariationBadge({ value }: { value?: number }) {
  if (value == null || value === 0) return null;
  const isUp = value > 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${
        isUp
          ? "bg-up/10 text-up"
          : "bg-down/10 text-down"
      }`}
    >
      {isUp ? "+" : ""}
      {value.toFixed(2)}%
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-card-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="skeleton h-5 w-28 mb-1.5" />
          <div className="skeleton h-3 w-20" />
        </div>
        <div className="skeleton h-5 w-14 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <div className="skeleton h-3 w-12 mb-2" />
            <div className="skeleton h-6 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function DolarCard({
  quote,
  highlighted,
  index,
}: {
  quote: DolarQuote;
  highlighted: boolean;
  index: number;
}) {
  const avg =
    quote.compra && quote.venta
      ? (quote.compra + quote.venta) / 2
      : null;

  return (
    <div
      className={`fade-in rounded-2xl border p-5 transition-colors ${
        highlighted
          ? "border-card-highlight-border bg-card-highlight"
          : "border-card-border bg-card"
      }`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            {DISPLAY_NAMES[quote.casa] ?? quote.nombre}
          </h2>
          <p className="text-xs text-muted mt-0.5">
            {DESCRIPTIONS[quote.casa] ?? ""}
          </p>
        </div>
        <VariationBadge value={quote.variacion} />
      </div>

      {/* Values */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-label mb-1">
            Compra
          </p>
          <p className="text-lg font-bold tabular-nums tracking-tight">
            {formatARS(quote.compra)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-label mb-1">
            Venta
          </p>
          <p className="text-lg font-bold tabular-nums tracking-tight">
            {formatARS(quote.venta)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-label mb-1">
            Promedio
          </p>
          <p className="text-lg font-bold tabular-nums tracking-tight text-muted">
            {formatARS(avg)}
          </p>
        </div>
      </div>
    </div>
  );
}

function Converter({ rate }: { rate: number }) {
  const [direction, setDirection] = useState<"ars-to-usd" | "usd-to-ars">(
    "ars-to-usd"
  );
  const [input, setInput] = useState("");

  const numericInput = parseFloat(input.replace(/,/g, "")) || 0;
  const result =
    direction === "ars-to-usd"
      ? numericInput / rate
      : numericInput * rate;

  const fromLabel = direction === "ars-to-usd" ? "ARS" : "USD";
  const toLabel = direction === "ars-to-usd" ? "USD" : "ARS";
  const formattedResult =
    direction === "ars-to-usd"
      ? result.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : Math.round(result).toLocaleString("es-AR");

  return (
    <div className="rounded-2xl border border-card-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold tracking-tight">Calculadora</h2>
        <span className="text-xs text-muted">
          1 USD = $ {Math.round(rate).toLocaleString("es-AR")}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Input */}
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-label">
            {fromLabel}
          </span>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={input}
            onChange={(e) => {
              const v = e.target.value.replace(/[^0-9.,]/g, "");
              setInput(v);
            }}
            className="w-full rounded-xl border border-card-border bg-background py-3 pl-13 pr-3 text-right text-base font-semibold tabular-nums outline-none transition-colors focus:border-card-highlight-border"
          />
        </div>

        {/* Swap button */}
        <button
          onClick={() => {
            setDirection((d) =>
              d === "ars-to-usd" ? "usd-to-ars" : "ars-to-usd"
            );
            setInput("");
          }}
          aria-label="Invertir conversión"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-card-border text-muted transition-colors hover:bg-card-highlight hover:text-foreground active:scale-95"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>

        {/* Result */}
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-label">
            {toLabel}
          </span>
          <div className="w-full rounded-xl border border-card-border bg-background py-3 pl-13 pr-3 text-right text-base font-semibold tabular-nums text-muted">
            {numericInput > 0 ? formattedResult : "0"}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────

export default function Page() {
  const [quotes, setQuotes] = useState<DolarQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch(API_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: DolarQuote[] = await res.json();

      // Sort by display order
      const sorted = DISPLAY_ORDER.map((casa) =>
        data.find((d) => d.casa === casa)
      ).filter(Boolean) as DolarQuote[];

      setQuotes(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  return (
    <main className="mx-auto max-w-lg px-4 py-8 pb-16 sm:py-12">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Dólar Hoy
          </h1>
          <button
            onClick={() => fetchQuotes(true)}
            disabled={refreshing}
            aria-label="Actualizar cotizaciones"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-card hover:text-foreground active:scale-95 disabled:opacity-40"
          >
            <RefreshIcon spinning={refreshing} />
          </button>
        </div>
        {!loading && quotes.length > 0 && (
          <p className="mt-1 text-sm text-muted">
            {getLatestUpdate(quotes)}
          </p>
        )}
      </header>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-down/20 bg-down/5 px-4 py-3 text-sm text-down">
          {error}
          <button
            onClick={() => fetchQuotes()}
            className="ml-2 underline underline-offset-2"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Cards */}
      <div className="grid gap-3">
        {loading
          ? Array.from({ length: 7 }, (_, i) => <SkeletonCard key={i} />)
          : quotes.map((q, i) => (
              <DolarCard
                key={q.casa}
                quote={q}
                highlighted={q.casa === "blue"}
                index={i}
              />
            ))}
      </div>

      {/* Converter */}
      {!loading && quotes.length > 0 && (() => {
        const cripto = quotes.find((q) => q.casa === "cripto");
        if (!cripto) return null;
        const avg = (cripto.compra + cripto.venta) / 2;
        return (
          <div className="mt-6">
            <Converter rate={avg} />
          </div>
        );
      })()}

      {/* Footer */}
      {!loading && quotes.length > 0 && (
        <footer className="mt-8 text-center text-xs text-muted">
          Fuente:{" "}
          <a
            href="https://dolarapi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            DolarApi.com
          </a>
        </footer>
      )}
    </main>
  );
}

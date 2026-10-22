import type { ReactNode, ButtonHTMLAttributes } from "react";
import type { JobStatus, LeadStatus } from "@/lib/types";

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-[28px] font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-[15px] text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2.5">{actions}</div>}
    </header>
  );
}

export function Card({ children, className = "", title, action, padded = true }: { children: ReactNode; className?: string; title?: ReactNode; action?: ReactNode; padded?: boolean }) {
  return (
    <section className={`relative rounded-xl border border-line bg-surface ${className}`}>
      {(title || action) && (
        <div className={`flex flex-wrap items-center justify-between gap-3 ${padded ? "px-6 pt-5" : "px-5 py-4"}`}>
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          {action}
        </div>
      )}
      <div className={padded ? "p-6" : ""}>{children}</div>
    </section>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger"; size?: "md" | "sm" };
export function Button({ variant = "secondary", size = "md", className = "", ...p }: BtnProps) {
  const base = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
  const sz = size === "md" ? "min-h-11 px-4 text-sm" : "min-h-9 px-3 text-[13px]";
  const v = {
    primary: "bg-brand text-on-brand hover:bg-brand-strong font-semibold",
    secondary: "border border-line-strong bg-surface text-ink hover:bg-surface-2",
    ghost: "text-ink hover:bg-surface-2",
    danger: "border border-err-soft bg-err-soft text-err-ink hover:brightness-95",
  }[variant];
  return <button type="button" {...p} className={`${base} ${sz} ${v} ${className}`} />;
}

export function Stat({ label, value, hint, hintTone = "muted" }: { label: string; value: ReactNode; hint?: ReactNode; hintTone?: "muted" | "ok" | "err" }) {
  const tone = { muted: "text-muted", ok: "text-ok-ink", err: "text-err-ink" }[hintTone];
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-xl border border-line bg-surface px-5 py-4">
      <span className="text-[13px] text-muted">{label}</span>
      <span className="truncate text-[26px] font-bold tabular-nums leading-tight">{value}</span>
      {hint && <span className={`text-[13px] ${tone}`}>{hint}</span>}
    </div>
  );
}

export function Pill({ tone = "neutral", children }: { tone?: "neutral" | "info" | "ok" | "warn" | "err" | "brand"; children: ReactNode }) {
  const t = {
    neutral: "bg-surface-2 text-[#475063]",
    info: "bg-info-soft text-info-ink",
    ok: "bg-ok-soft text-ok-ink",
    warn: "bg-warn-soft text-warn-ink",
    err: "bg-err-soft text-err-ink",
    brand: "bg-brand-soft text-brand-strong",
  }[tone];
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[13px] font-medium ${t}`}>{children}</span>;
}

const STATUS_TONE: Record<LeadStatus, "neutral" | "info" | "ok" | "warn" | "err" | "brand"> = {
  "Não contatado": "neutral",
  "Na fila": "brand",
  "Mensagem enviada": "info",
  "Falha no envio": "err",
  Respondeu: "warn",
  Interessado: "warn",
  "Pediu orçamento": "warn",
  Negociando: "warn",
  "Retornar depois": "neutral",
  "Sem interesse": "neutral",
  "Não perturbe": "err",
  Fechado: "ok",
};
export const LeadStatusPill = ({ status }: { status: LeadStatus }) => <Pill tone={STATUS_TONE[status]}>{status}</Pill>;

export function JobStatusPill({ status, erro }: { status: JobStatus; erro?: string }) {
  if (status === "rodando") return <Pill tone="info"><span className="size-1.5 animate-pulse rounded-full bg-brand" />Rodando</Pill>;
  if (status === "fila") return <Pill>Na fila</Pill>;
  if (status === "concluido") return <Pill tone="ok">Concluída</Pill>;
  return <Pill tone="err">{erro ?? "Erro"}</Pill>;
}

export function Progress({ value, tone = "brand" }: { value: number; tone?: "brand" | "ok" | "err" }) {
  const c = { brand: "bg-brand", ok: "bg-ok", err: "bg-err" }[tone];
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
        <div className={`h-1.5 rounded-full ${c}`} style={{ width: `${value}%` }} />
      </div>
      <span className="w-10 text-right text-[13px] tabular-nums text-muted">{value}%</span>
    </div>
  );
}

export function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-10 shrink-0 rounded-full transition-colors ${checked ? "bg-brand" : "bg-line-strong"}`}
      >
        <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${checked ? "left-[18px]" : "left-0.5"}`} />
      </button>
      <span className="flex flex-col">
        <span className="font-medium">{label}</span>
        {hint && <span className="text-[13px] text-muted">{hint}</span>}
      </span>
    </label>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="px-6 py-10 text-center text-sm text-muted">{children}</div>;
}

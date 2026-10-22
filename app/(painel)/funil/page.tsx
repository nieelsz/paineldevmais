"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui";
import { leads as leadsIniciais } from "@/lib/mock";
import type { Lead, LeadStatus } from "@/lib/types";
import { brl, nota } from "@/lib/format";

const COLUNAS: { titulo: string; status: LeadStatus; cor: string }[] = [
  { titulo: "Não contatado", status: "Não contatado", cor: "#8a909b" },
  { titulo: "Na fila", status: "Na fila", cor: "var(--brand)" },
  { titulo: "Mensagem enviada", status: "Mensagem enviada", cor: "#3b82f6" },
  { titulo: "Respondeu", status: "Respondeu", cor: "#f59e0b" },
  { titulo: "Interessado", status: "Interessado", cor: "#f59e0b" },
  { titulo: "Pediu orçamento", status: "Pediu orçamento", cor: "#ea580c" },
  { titulo: "Negociando", status: "Negociando", cor: "#c2410c" },
  { titulo: "Fechado", status: "Fechado", cor: "#15803d" },
  { titulo: "Retornar depois", status: "Retornar depois", cor: "#8a909b" },
  { titulo: "Sem interesse", status: "Sem interesse", cor: "#8a909b" },
];

export default function FunilPage() {
  const [lista, setLista] = useState<Lead[]>(leadsIniciais);
  const [arrastando, setArrastando] = useState<string | null>(null);
  const [sobre, setSobre] = useState<LeadStatus | null>(null);

  const mover = (id: string, status: LeadStatus) => setLista((l) => l.map((x) => (x.id === id ? { ...x, status } : x)));

  return (
    <>
      <PageHeader title="Funil" subtitle="Arraste os cards para mudar a etapa de cada lead." />
      <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
        <div className="flex min-w-max gap-3">
          {COLUNAS.map((c) => {
            const itens = lista.filter((l) => l.status === c.status);
            const valor = itens.reduce((s, l) => s + (l.valorVenda ?? 0), 0);
            return (
              <section
                key={c.status}
                aria-label={c.titulo}
                onDragOver={(e) => { e.preventDefault(); setSobre(c.status); }}
                onDragLeave={() => setSobre(null)}
                onDrop={() => { if (arrastando) mover(arrastando, c.status); setArrastando(null); setSobre(null); }}
                className={`flex w-[272px] flex-col gap-2.5 rounded-xl border p-3 transition-colors ${sobre === c.status ? "border-brand bg-brand-soft" : "border-line bg-surface-2/70"}`}
              >
                <header className="flex items-center gap-2 px-1 pt-1">
                  <span className="size-2.5 rounded-full" style={{ background: c.cor }} />
                  <h2 className="text-sm font-semibold">{c.titulo}</h2>
                  <span className="ml-auto rounded-full bg-surface px-2 text-[12px] font-medium tabular-nums text-muted">{itens.length}</span>
                </header>
                {valor > 0 && <p className="px-1 text-[12px] text-ok-ink">{brl(valor)}</p>}
                <div className="flex max-h-[calc(100vh-240px)] min-h-[120px] flex-col gap-2 overflow-y-auto">
                  {itens.map((l) => (
                    <article
                      key={l.id}
                      draggable
                      onDragStart={() => setArrastando(l.id)}
                      onDragEnd={() => setArrastando(null)}
                      className={`relative cursor-grab rounded-lg border border-line bg-surface p-3 shadow-sm active:cursor-grabbing ${arrastando === l.id ? "opacity-50" : ""}`}
                    >
                      <h3 className="text-sm font-semibold leading-snug">{l.nome}</h3>
                      <p className="mt-0.5 text-[12px] text-muted">{l.cidade}/{l.uf} · ★ {nota(l.nota)} ({l.avaliacoes})</p>
                      <div className="mt-2 flex flex-col gap-1.5">
                        <span className="whitespace-nowrap font-mono text-[12px] text-muted">{l.telefone ?? "sem telefone"}</span>
                        <label className="sr-only" htmlFor={`m-${l.id}`}>Mover {l.nome}</label>
                        <select id={`m-${l.id}`} value={l.status} onChange={(e) => mover(l.id, e.target.value as LeadStatus)} className="w-full rounded-md border border-line bg-surface px-1.5 py-1 text-[12px] text-muted">
                          {COLUNAS.map((x) => <option key={x.status} value={x.status}>{x.titulo}</option>)}
                        </select>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}

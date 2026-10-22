"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Upload } from "lucide-react";
import { Button, Card, JobStatusPill, PageHeader, Progress, Toggle } from "@/components/ui";
import { jobs as jobsIniciais } from "@/lib/mock";
import type { Job } from "@/lib/types";
import { dataHora, num } from "@/lib/format";

const FILTROS = ["Todos", "Ativos", "Com erro"] as const;
const ORIGEM = { manual: "Manual", agendamento: "Agendamento", n8n: "n8n" } as const;

function MapaGrid({ grid }: { grid: number }) {
  const x0 = 60, y0 = 30, w = 280, h = 240;
  const linhas = Array.from({ length: grid - 1 }, (_, i) => i + 1);
  return (
    <svg role="img" aria-label={`Área dividida em ${grid * grid} blocos de busca`} viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill="#e9ede8" />
      <path d="M-10 210 C 80 180, 140 240, 230 200 S 360 150, 420 175" stroke="#bfd7ea" strokeWidth="14" fill="none" />
      <path d="M0 90 L400 120 M60 0 L120 300 M250 0 L210 300 M0 260 L400 230 M330 0 L370 300" stroke="#fff" strokeWidth="6" fill="none" />
      <path d="M0 40 L400 60 M0 160 L400 150 M170 0 L160 300 M20 0 L0 300" stroke="#fff" strokeWidth="3" fill="none" />
      <rect x={x0} y={y0} width={w} height={h} fill="var(--brand)" fillOpacity="0.07" stroke="var(--brand)" strokeWidth="2" />
      {linhas.map((i) => (
        <g key={i}>
          <line x1={x0 + (w / grid) * i} y1={y0} x2={x0 + (w / grid) * i} y2={y0 + h} stroke="var(--brand)" strokeWidth="1.5" strokeDasharray="5 4" />
          <line x1={x0} y1={y0 + (h / grid) * i} x2={x0 + w} y2={y0 + (h / grid) * i} stroke="var(--brand)" strokeWidth="1.5" strokeDasharray="5 4" />
        </g>
      ))}
      <circle cx="200" cy="150" r="9" fill="var(--brand)" stroke="#fff" strokeWidth="3" />
    </svg>
  );
}

export default function BuscasPage() {
  const [termo, setTermo] = useState("");
  const [local, setLocal] = useState("");
  const [prof, setProf] = useState(2);
  const [grid, setGrid] = useState(3);
  const [redes, setRedes] = useState(true);
  const [proxy, setProxy] = useState(true);
  const [full, setFull] = useState(false);
  const [lista, setLista] = useState<Job[]>(jobsIniciais);
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]>("Todos");

  const blocos = grid * grid;
  const estimativa = useMemo(() => ({ resultados: blocos * 120, minutos: Math.round(blocos * (1.2 + prof * 0.8)) }), [blocos, prof]);

  const visiveis = lista.filter((j) => filtro === "Todos" || (filtro === "Ativos" ? j.status === "rodando" || j.status === "fila" : j.status === "erro"));

  function iniciar() {
    if (!termo.trim() || !local.trim()) return;
    const [cidade, uf = ""] = local.split(",").map((s) => s.trim());
    setLista((l) => [
      { id: `JOB-${String(109 + l.length).padStart(4, "0")}`, termo: termo.trim(), cidade, uf, grid, profundidade: prof, redesSociais: redes, status: "fila", progresso: 0, encontrados: 0, aprovados: 0, inicio: null, origem: "manual" },
      ...l,
    ]);
    setTermo("");
    setLocal("");
  }

  return (
    <>
      <PageHeader
        title="Buscas"
        subtitle="Crie coletas no Google Maps e acompanhe a fila em tempo real."
        actions={<Button><Upload size={16} aria-hidden="true" />Importar lote (.txt)</Button>}
      />

      <div className="flex flex-wrap items-stretch gap-4">
        <Card title="Nova busca" className="min-w-0 flex-[3_1_520px]">
          <div className="flex flex-col gap-5">
            <p className="-mt-3 text-sm text-muted">O que procurar e onde. Use grid para passar do limite de ~120 resultados por busca.</p>
            <div className="flex flex-wrap gap-4">
              <label className="label min-w-[220px] flex-1">Termo de busca
                <input className="input" placeholder="clínica odontológica" value={termo} onChange={(e) => setTermo(e.target.value)} />
              </label>
              <label className="label min-w-[220px] flex-1">Cidade ou coordenadas
                <input className="input" placeholder="Campinas, SP" value={local} onChange={(e) => setLocal(e.target.value)} />
              </label>
            </div>
            <div className="flex flex-wrap items-end gap-4">
              <label className="label min-w-[160px] flex-1">Profundidade
                <select className="input" value={prof} onChange={(e) => setProf(Number(e.target.value))}>
                  <option value={1}>1 — rápida</option>
                  <option value={2}>2 — equilibrada</option>
                  <option value={3}>3 — profunda</option>
                  <option value={5}>5 — máxima</option>
                </select>
              </label>
              <fieldset className="flex min-w-[280px] flex-[2] flex-col gap-1.5">
                <legend className="mb-1.5 text-[13px] font-medium">Grid da área</legend>
                <div className="flex overflow-hidden rounded-lg border border-line-strong">
                  {[1, 2, 3, 4].map((g) => (
                    <button
                      key={g}
                      type="button"
                      aria-pressed={grid === g}
                      onClick={() => setGrid(g)}
                      className={`min-h-[42px] flex-1 border-r border-line-strong text-sm last:border-r-0 ${grid === g ? "bg-brand-soft font-semibold text-brand-strong" : "bg-surface hover:bg-surface-2"}`}
                    >
                      {g}×{g}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-1">
              <Toggle checked={redes} onChange={setRedes} label="Redes sociais" hint="Instagram, Facebook, LinkedIn" />
              <Toggle checked={proxy} onChange={setProxy} label="Usar proxy" hint="Reduz bloqueios do Google" />
              <Toggle checked={full} onChange={setFull} label="Campos completos" hint="Horários, fotos, coordenadas" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
              <p className="text-[13px] text-muted">
                Estimativa: <strong className="font-semibold text-ink">{blocos} {blocos === 1 ? "bloco" : "blocos"}</strong> · até{" "}
                <strong className="font-semibold text-ink">~{num(estimativa.resultados)} resultados</strong> · ~{estimativa.minutos} min
              </p>
              <div className="flex flex-wrap gap-2.5">
                <Link href="/agendamentos" className="inline-flex min-h-11 items-center rounded-lg border border-line-strong bg-surface px-4 text-sm font-medium hover:bg-surface-2">Salvar como agendamento</Link>
                <Button variant="primary" onClick={iniciar} disabled={!termo.trim() || !local.trim()}>Iniciar coleta</Button>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Área da coleta" action={<span className="text-[13px] text-muted">raio ~12 km</span>} className="flex min-w-0 flex-[2_1_340px] flex-col">
          <div className="flex h-full flex-col gap-3">
            <div className="min-h-[260px] flex-1 overflow-hidden rounded-[10px]"><MapaGrid grid={grid} /></div>
            <p className="text-[13px] text-muted">A cidade é convertida em coordenadas e a área é dividida em {blocos} {blocos === 1 ? "bloco" : "blocos"} de busca.</p>
          </div>
        </Card>
      </div>

      <Card
        title="Fila de jobs"
        padded={false}
        action={
          <div className="flex gap-2" role="group" aria-label="Filtrar jobs">
            {FILTROS.map((f) => (
              <button key={f} type="button" aria-pressed={filtro === f} onClick={() => setFiltro(f)}
                className={`min-h-9 rounded-full px-3.5 text-[13px] ${filtro === f ? "bg-ink text-white" : "bg-surface-2 text-[#3a404c] hover:bg-line"}`}>
                {f}
              </button>
            ))}
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="th !pl-6">Busca</th><th className="th">Origem</th><th className="th">Grid / prof.</th><th className="th">Status</th>
                <th className="th">Progresso</th><th className="th text-right">Aprovados</th><th className="th">Início</th><th className="th !pr-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {visiveis.map((j) => (
                <tr key={j.id}>
                  <td className="td !pl-6"><div className="whitespace-nowrap font-semibold">{j.termo}</div><div className="whitespace-nowrap text-[13px] text-muted">{j.cidade}{j.uf && `/${j.uf}`} · {j.id}</div></td>
                  <td className="td text-[13px] text-muted">{ORIGEM[j.origem]}</td>
                  <td className="td font-mono text-[13px]">{j.grid}×{j.grid} / {j.profundidade}</td>
                  <td className="td"><JobStatusPill status={j.status} erro={j.erro} /></td>
                  <td className="td min-w-[150px]"><Progress value={j.progresso} tone={j.status === "erro" ? "err" : j.status === "concluido" ? "ok" : "brand"} /></td>
                  <td className="td whitespace-nowrap text-right tabular-nums">{j.encontrados ? <><strong className="font-semibold">{num(j.aprovados)}</strong> <span className="text-[13px] text-muted">de {num(j.encontrados)}</span></> : "—"}</td>
                  <td className="td whitespace-nowrap tabular-nums text-muted">{dataHora(j.inicio)}</td>
                  <td className="td !pr-6 whitespace-nowrap text-right text-[13px] font-medium">
                    <Link href={`/leads?job=${j.id}`} className="text-brand hover:text-brand-strong">Ver leads</Link>
                    <button type="button" className="ml-4 text-brand hover:text-brand-strong">
                      {j.status === "rodando" ? "Cancelar" : j.status === "fila" ? "Remover" : j.status === "erro" ? "Repetir com proxy" : "Baixar CSV"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

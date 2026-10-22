"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Button, Card, PageHeader, Pill, Toggle } from "@/components/ui";
import { leads, mensagens as iniciais } from "@/lib/mock";
import type { Etapa, Mensagem } from "@/lib/types";
import { nota } from "@/lib/format";

const ETAPAS: Etapa[] = ["Mensagem inicial", "Follow-up 1", "Follow-up 2"];
const VARS = [
  { v: "{{nome}}", d: "Nome do lugar" },
  { v: "{{cidade}}", d: "Cidade" },
  { v: "{{nota}}", d: "Nota no Google" },
  { v: "{{avaliacoes}}", d: "Nº de avaliações" },
  { v: "{{bairro}}", d: "Bairro" },
];
const STATS: Record<string, [number, number]> = { "MSG-001": [62, 3], "MSG-002": [58, 4], "MSG-003": [141, 15], "MSG-004": [96, 6], "MSG-005": [44, 2] };

export default function MensagensPage() {
  const [lista, setLista] = useState<Mensagem[]>(iniciais);
  const [atual, setAtual] = useState(iniciais[2].id);
  const ref = useRef<HTMLTextAreaElement>(null);
  const m = lista.find((x) => x.id === atual)!;
  const ex = leads.find((l) => !l.site) ?? leads[0];

  const set = (patch: Partial<Mensagem>) => setLista((l) => l.map((x) => (x.id === atual ? { ...x, ...patch } : x)));
  const preview = m.texto
    .replaceAll("{{nome}}", ex.nome).replaceAll("{{cidade}}", ex.cidade).replaceAll("{{nota}}", nota(ex.nota))
    .replaceAll("{{avaliacoes}}", String(ex.avaliacoes)).replaceAll("{{bairro}}", ex.bairro);

  function inserir(v: string) {
    const el = ref.current;
    if (!el) return set({ texto: m.texto + v });
    const { selectionStart: a, selectionEnd: b } = el;
    set({ texto: m.texto.slice(0, a) + v + m.texto.slice(b) });
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(a + v.length, a + v.length); });
  }
  function nova() {
    const id = `MSG-${String(lista.length + 1).padStart(3, "0")}`;
    setLista((l) => [...l, { id, nome: "Nova mensagem", etapa: "Mensagem inicial", ativa: false, texto: "Olá! Vi a {{nome}} no Google…" }]);
    setAtual(id);
  }

  return (
    <>
      <PageHeader title="Mensagens" subtitle="Modelos usados nos envios. Mensagens ativas da mesma etapa entram em rodízio (teste A/B)."
        actions={<Button variant="primary" onClick={nova}><Plus size={16} aria-hidden="true" />Nova mensagem</Button>} />

      <div className="flex flex-wrap items-start gap-4">
        <div className="flex min-w-0 flex-[2_1_300px] flex-col gap-4">
          {ETAPAS.map((et) => (
            <Card key={et} title={et} padded={false}>
              <ul>
                {lista.filter((x) => x.etapa === et).map((x) => {
                  const [env, resp] = STATS[x.id] ?? [0, 0];
                  return (
                    <li key={x.id}>
                      <button type="button" onClick={() => setAtual(x.id)} aria-current={x.id === atual ? "true" : undefined}
                        className={`flex w-full flex-col gap-1 border-t border-line px-5 py-3.5 text-left ${x.id === atual ? "bg-brand-soft" : "hover:bg-surface-2"}`}>
                        <span className="flex items-center gap-2">
                          <span className="font-semibold">{x.nome}</span>
                          {x.ativa ? <Pill tone="ok">Ativa</Pill> : <Pill>Pausada</Pill>}
                        </span>
                        <span className="text-[13px] text-muted">{x.id} · {env} enviadas · {env ? Math.round((resp / env) * 100) : 0}% de resposta</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          ))}
        </div>

        <Card title="Editar mensagem" className="min-w-0 flex-[3_1_520px]">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-4">
              <label className="label min-w-[200px] flex-[2]">Nome<input className="input" value={m.nome} onChange={(e) => set({ nome: e.target.value })} /></label>
              <label className="label min-w-[180px] flex-1">Etapa
                <select className="input" value={m.etapa} onChange={(e) => set({ etapa: e.target.value as Etapa })}>{ETAPAS.map((e) => <option key={e}>{e}</option>)}</select>
              </label>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="texto" className="text-[13px] font-medium">Texto</label>
              <div className="flex flex-wrap gap-1.5">
                {VARS.map((v) => (
                  <button key={v.v} type="button" title={v.d} onClick={() => inserir(v.v)} className="min-h-8 rounded-md bg-surface-2 px-2.5 font-mono text-[12px] hover:bg-line">{v.v}</button>
                ))}
              </div>
              <textarea id="texto" ref={ref} className="input !min-h-[180px]" value={m.texto} onChange={(e) => set({ texto: e.target.value })} />
              <span className="text-[12px] text-muted">{m.texto.length} caracteres</span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[13px] font-medium">Pré-visualização <span className="font-normal text-muted">· com {ex.nome}</span></span>
              <div className="rounded-xl bg-[#e5ddd5] p-4">
                <div className="ml-auto max-w-[420px] whitespace-pre-line rounded-lg rounded-tr-none bg-[#d9fdd3] px-3.5 py-2.5 text-[14px] leading-relaxed text-[#111b21] shadow-sm">
                  {preview}
                  <div className="mt-1 text-right text-[11px] text-[#667781]">16:16</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
              <Toggle checked={m.ativa} onChange={(v) => set({ ativa: v })} label="Mensagem ativa" hint="Entra no rodízio dos envios" />
              <div className="flex gap-2.5"><Button>Duplicar</Button><Button variant="primary">Salvar</Button></div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { ArrowUp, Plus } from "lucide-react";
import { Button, Card, PageHeader, Pill } from "@/components/ui";
import { cidadesControle, cidadesFila } from "@/lib/mock";
import type { CidadeFila } from "@/lib/types";
import { data, num, pct } from "@/lib/format";

const REGIOES = ["Todas", "Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"] as const;

export default function CidadesPage() {
  const [fila, setFila] = useState<CidadeFila[]>(cidadesFila);
  const [regiao, setRegiao] = useState<(typeof REGIOES)[number]>("Todas");
  const [nova, setNova] = useState("");

  const proxima = fila.find((c) => !c.ultimaPesquisa);
  const visiveis = fila.filter((c) => regiao === "Todas" || c.regiao === regiao);
  const pesquisadas = fila.filter((c) => c.ultimaPesquisa).length;

  const subir = (cidade: string) => setFila((f) => {
    const i = f.findIndex((c) => c.cidade === cidade);
    const j = f.findIndex((c) => !c.ultimaPesquisa);
    if (i <= j) return f;
    const n = [...f]; const [item] = n.splice(i, 1); n.splice(j, 0, item); return n;
  });
  const adicionar = () => {
    const [cidade, uf = ""] = nova.split(",").map((s) => s.trim());
    if (!cidade) return;
    setFila((f) => [...f, { cidade, uf: uf.toUpperCase(), regiao: "Sudeste", ultimaPesquisa: null, leads: 0 }]);
    setNova("");
  };

  return (
    <>
      <PageHeader title="Cidades" subtitle={<>O n8n pega a próxima cidade da fila todo dia útil às 09:00. Próxima: <strong className="font-semibold text-ink">{proxima ? `${proxima.cidade}/${proxima.uf}` : "fila vazia"}</strong></>} />

      <Card title="Controle de coletas" padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead><tr>
              <th className="th !pl-5">Data</th><th className="th">Cidade</th><th className="th text-right">Analisadas</th><th className="th text-right">Aprovadas</th>
              <th className="th text-right">Descartadas</th><th className="th text-right">Duplicadas</th><th className="th !pr-5 text-right">Aproveitamento</th>
            </tr></thead>
            <tbody>
              {cidadesControle.map((c) => (
                <tr key={c.data + c.cidade}>
                  <td className="td !pl-5 tabular-nums text-muted">{data(c.data)}</td>
                  <td className="td font-medium">{c.cidade}/{c.uf}</td>
                  <td className="td text-right tabular-nums">{num(c.analisadas)}</td>
                  <td className="td text-right font-semibold tabular-nums text-ok-ink">{num(c.aprovadas)}</td>
                  <td className="td text-right tabular-nums text-muted">{num(c.descartadas)}</td>
                  <td className="td text-right tabular-nums text-muted">{num(c.duplicadas)}</td>
                  <td className="td !pr-5 text-right tabular-nums">{pct(c.aprovadas, c.analisadas)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card
        title={`Fila de cidades (${fila.length})`}
        padded={false}
        action={<span className="text-[13px] text-muted">{pesquisadas} pesquisadas · {fila.length - pesquisadas} aguardando</span>}
      >
        <div className="flex flex-wrap items-center gap-3 px-5 pb-4">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por região">
            {REGIOES.map((r) => (
              <button key={r} type="button" aria-pressed={regiao === r} onClick={() => setRegiao(r)}
                className={`min-h-9 rounded-full px-3.5 text-[13px] ${regiao === r ? "bg-ink text-white" : "bg-surface-2 text-[#3a404c] hover:bg-line"}`}>{r}</button>
            ))}
          </div>
          <form className="ml-auto flex gap-2" onSubmit={(e) => { e.preventDefault(); adicionar(); }}>
            <label className="sr-only" htmlFor="nova-cidade">Adicionar cidade</label>
            <input id="nova-cidade" className="input !min-h-9 !w-[200px] !text-sm" placeholder="Cidade, UF" value={nova} onChange={(e) => setNova(e.target.value)} />
            <Button size="sm" variant="primary" type="submit"><Plus size={15} aria-hidden="true" />Adicionar</Button>
          </form>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead><tr>
              <th className="th !pl-5 w-12">#</th><th className="th">Cidade</th><th className="th">Região</th><th className="th">Última pesquisa</th>
              <th className="th text-right">Leads adicionados</th><th className="th !pr-5 text-right">Ações</th>
            </tr></thead>
            <tbody>
              {visiveis.map((c) => (
                <tr key={c.cidade + c.uf}>
                  <td className="td !pl-5 tabular-nums text-muted">{fila.indexOf(c) + 1}</td>
                  <td className="td font-medium">{c.cidade}/{c.uf} {c === proxima && <span className="ml-1.5"><Pill tone="brand">Próxima</Pill></span>}</td>
                  <td className="td text-muted">{c.regiao}</td>
                  <td className="td tabular-nums">{c.ultimaPesquisa ? data(c.ultimaPesquisa) : <span className="text-faint">—</span>}</td>
                  <td className="td text-right tabular-nums">{c.ultimaPesquisa ? num(c.leads) : <span className="text-faint">—</span>}</td>
                  <td className="td !pr-5 whitespace-nowrap text-right text-[13px] font-medium">
                    {!c.ultimaPesquisa && c !== proxima && (
                      <button type="button" onClick={() => subir(c.cidade)} className="inline-flex items-center gap-1 text-brand hover:text-brand-strong"><ArrowUp size={14} aria-hidden="true" />Passar à frente</button>
                    )}
                    <button type="button" className="ml-4 text-brand hover:text-brand-strong">{c.ultimaPesquisa ? "Pesquisar de novo" : "Rodar agora"}</button>
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

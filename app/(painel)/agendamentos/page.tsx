"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button, Card, PageHeader, Toggle } from "@/components/ui";
import { agendamentos as iniciais } from "@/lib/mock";
import type { Agendamento } from "@/lib/types";
import { dataHora } from "@/lib/format";

const HIST = [
  { nome: "Fila diária de cidades", quando: "22/10 09:00", det: "Recife/PE · 286 encontrados · 74 novos", ok: true },
  { nome: "Fila diária de cidades", quando: "21/10 09:00", det: "Goiânia/GO · 118 encontrados · 41 novos", ok: true },
  { nome: "Fila diária de cidades", quando: "20/10 09:00", det: "Curitiba/PR · bloqueio (429) em 31% · 22 novos", ok: false },
  { nome: "Odonto interior SP", quando: "19/10 08:00", det: "4 cidades · 1.012 encontrados · 184 novos", ok: true },
  { nome: "Fisioterapia capitais", quando: "01/10 06:00", det: "3 cidades · 540 encontrados · 61 novos", ok: true },
];

export default function AgendamentosPage() {
  const [lista, setLista] = useState<Agendamento[]>(iniciais);
  const [soNovos, setSoNovos] = useState(true);
  const [enviarFila, setEnviarFila] = useState(false);
  const [avisar, setAvisar] = useState(false);

  const alternar = (id: string) => setLista((l) => l.map((a) => (a.id === id ? { ...a, ativo: !a.ativo } : a)));

  return (
    <>
      <PageHeader title="Agendamentos" subtitle="Coletas que rodam sozinhas e trazem só os leads novos."
        actions={<Button variant="primary" onClick={() => document.getElementById("novo-ag")?.scrollIntoView({ behavior: "smooth" })}><Plus size={16} aria-hidden="true" />Novo agendamento</Button>} />

      <Card padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-sm">
            <thead><tr>
              <th className="th !pl-6">Agendamento</th><th className="th">Locais</th><th className="th">Frequência</th><th className="th">Próxima execução</th>
              <th className="th">Última</th><th className="th">Ativo</th><th className="th !pr-6 text-right">Ações</th>
            </tr></thead>
            <tbody>
              {lista.map((a) => (
                <tr key={a.id}>
                  <td className="td !pl-6"><div className="font-semibold">{a.nome}</div><div className="text-[13px] text-muted">{a.termos.join(", ")}</div></td>
                  <td className="td">{a.cidades.length > 2 ? `${a.cidades.length} cidades` : a.cidades.join(", ")}</td>
                  <td className="td">{a.frequencia}</td>
                  <td className={`td tabular-nums ${a.ativo ? "" : "text-faint"}`}>{a.ativo ? dataHora(a.proxima) : "pausado"}</td>
                  <td className="td"><span className="font-semibold text-ok-ink">+{a.ultimosNovos}</span> <span className="text-[13px] text-muted">novos</span></td>
                  <td className="td">
                    <button type="button" role="switch" aria-checked={a.ativo} aria-label={`Ativar ${a.nome}`} onClick={() => alternar(a.id)}
                      className={`relative h-6 w-10 rounded-full transition-colors ${a.ativo ? "bg-brand" : "bg-line-strong"}`}>
                      <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${a.ativo ? "left-[18px]" : "left-0.5"}`} />
                    </button>
                  </td>
                  <td className="td !pr-6 whitespace-nowrap text-right text-[13px] font-medium">
                    <button type="button" className="text-brand hover:text-brand-strong">Rodar agora</button>
                    <button type="button" className="ml-4 text-brand hover:text-brand-strong">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex flex-wrap items-start gap-4">
        <section id="novo-ag" className="min-w-0 flex-[3_1_520px] scroll-mt-6">
          <Card title="Novo agendamento">
            <div className="flex flex-col gap-4">
              <label className="label">Nome<input className="input" placeholder="Ex.: Odonto interior SP" /></label>
              <div className="flex flex-wrap gap-4">
                <label className="label min-w-[220px] flex-1">Termos (um por linha)<textarea className="input" placeholder={"clínica odontológica\nimplante dentário"} /></label>
                <label className="label min-w-[220px] flex-1">Cidades (uma por linha)<textarea className="input" placeholder={"Campinas, SP\nJundiaí, SP\nou: Próxima da fila"} /></label>
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="label min-w-[180px] flex-[2]">Frequência
                  <select className="input"><option>Seg. a sex.</option><option>Toda semana</option><option>A cada 15 dias</option><option>Todo mês</option></select>
                </label>
                <label className="label min-w-[130px] flex-1">Dia
                  <select className="input"><option>Segunda</option><option>Terça</option><option>Quarta</option><option>Quinta</option><option>Sexta</option></select>
                </label>
                <label className="label min-w-[110px] flex-1">Horário<input type="time" className="input" defaultValue="09:00" /></label>
                <label className="label min-w-[110px] flex-1">Grid
                  <select className="input" defaultValue="2"><option value="1">1×1</option><option value="2">2×2</option><option value="3">3×3</option><option value="4">4×4</option></select>
                </label>
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-1">
                <Toggle checked={soNovos} onChange={setSoNovos} label="Guardar só leads novos" />
                <Toggle checked={enviarFila} onChange={setEnviarFila} label="Colocar aprovados na fila de envio" />
                <Toggle checked={avisar} onChange={setAvisar} label="Avisar por e-mail" />
              </div>
              <div className="flex justify-end gap-2.5 border-t border-line pt-4"><Button>Cancelar</Button><Button variant="primary">Salvar agendamento</Button></div>
            </div>
          </Card>
        </section>

        <Card title="Últimas execuções" className="min-w-0 flex-[2_1_340px]">
          <ul className="-my-3 flex flex-col">
            {HIST.map((h) => (
              <li key={h.quando + h.nome} className="flex gap-3.5 border-b border-line py-3 last:border-0">
                <span className={`mt-1.5 size-2.5 shrink-0 rounded-full ${h.ok ? "bg-ok" : "bg-warn"}`} aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-3"><span className="text-sm font-semibold">{h.nome}</span><span className="whitespace-nowrap text-[13px] tabular-nums text-muted">{h.quando}</span></div>
                  <span className="text-[13px] text-muted">{h.det}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}

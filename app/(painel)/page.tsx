import Link from "next/link";
import { Card, JobStatusPill, PageHeader, Stat } from "@/components/ui";
import { LeadsChart } from "@/components/LeadsChart";
import { jobs, leads, leadsPorDia } from "@/lib/mock";
import { brl, num, pct } from "@/lib/format";

export default function Dashboard() {
  const total = leads.length;
  const comWhats = leads.filter((l) => l.whatsapp).length;
  const naoContatados = leads.filter((l) => l.status === "Não contatado").length;
  const enviadas = leads.filter((l) => !["Não contatado", "Na fila"].includes(l.status)).length;
  const responderam = leads.filter((l) => ["Respondeu", "Interessado", "Pediu orçamento", "Negociando", "Fechado"].includes(l.status)).length;
  const fechados = leads.filter((l) => l.status === "Fechado");
  const vendas = fechados.reduce((s, l) => s + (l.valorVenda ?? 0), 0);

  const porEstado = Object.entries(
    leads.reduce<Record<string, number>>((acc, l) => ((acc[l.uf] = (acc[l.uf] ?? 0) + 1), acc), {}),
  ).sort((a, b) => b[1] - a[1]);
  const max = porEstado[0]?.[1] ?? 1;

  const funil = [
    { label: "Coletados", v: total },
    { label: "Com WhatsApp", v: comWhats },
    { label: "Mensagem enviada", v: enviadas },
    { label: "Responderam", v: responderam },
    { label: "Fechados", v: fechados.length },
  ];

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Visão geral da coleta e da prospecção." />

      <section aria-label="Resumo" className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <Stat label="Total de leads" value={num(total)} hint="+12 esta semana" hintTone="ok" />
        <Stat label="Com WhatsApp" value={num(comWhats)} hint={`${pct(comWhats, total)} da base`} />
        <Stat label="Não contatados" value={num(naoContatados)} />
        <Stat label="Mensagens enviadas" value={num(enviadas)} />
        <Stat label="Taxa de resposta" value={pct(responderam, enviadas)} />
        <Stat label="Vendas" value={brl(vendas)} hint={`${fechados.length} clientes fechados`} />
      </section>

      <div className="flex flex-wrap gap-4">
        <Card title="Leads por dia" action={<span className="text-[13px] text-muted">últimos 30 dias</span>} className="min-w-0 flex-[3_1_520px]">
          <LeadsChart data={leadsPorDia} />
        </Card>
        <Card title="Funil" className="min-w-0 flex-[2_1_320px]">
          <ol className="flex flex-col gap-3">
            {funil.map((f) => (
              <li key={f.label} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-sm"><span>{f.label}</span><span className="font-semibold tabular-nums">{num(f.v)}</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-2"><div className="h-2 rounded-full bg-brand" style={{ width: `${(f.v / total) * 100}%` }} /></div>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <div className="flex flex-wrap gap-4">
        <Card title="Ranking por estado" className="min-w-0 flex-[2_1_320px]">
          <ul className="flex flex-col gap-3">
            {porEstado.map(([uf, v]) => (
              <li key={uf} className="flex items-center gap-3 text-sm">
                <span className="w-8 font-semibold">{uf}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2"><div className="h-2 rounded-full bg-brand" style={{ width: `${(v / max) * 100}%` }} /></div>
                <span className="w-10 text-right tabular-nums text-muted">{v}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Últimas coletas" action={<Link href="/buscas" className="text-[13px] font-medium text-brand hover:text-brand-strong">Ver todas</Link>} className="min-w-0 flex-[3_1_520px]" padded={false}>
          <ul>
            {jobs.slice(0, 4).map((j) => (
              <li key={j.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3.5">
                <div>
                  <div className="font-semibold">{j.termo}</div>
                  <div className="text-[13px] text-muted">{j.cidade}/{j.uf} · {num(j.aprovados)} aprovados de {num(j.encontrados)}</div>
                </div>
                <JobStatusPill status={j.status} erro={j.erro} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}

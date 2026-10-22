"use client";

import { useState } from "react";
import { CheckCircle2, Pause, Play, QrCode, XCircle } from "lucide-react";
import { Button, Card, Pill, PageHeader, Stat } from "@/components/ui";
import { filaEnvios, logEnvios } from "@/lib/mock";
import { dataHora } from "@/lib/format";

export default function EnviosPage() {
  const [pausado, setPausado] = useState(false);
  const ok = logEnvios.filter((l) => l.ok).length;
  const falhas = logEnvios.length - ok;
  const limite = 20;

  return (
    <>
      <PageHeader
        title="Envios de hoje"
        subtitle="Seg. a sex., das 9h às 19h · intervalo de 90–240 s · modo automático ligado"
        actions={
          <Button variant={pausado ? "primary" : "danger"} onClick={() => setPausado(!pausado)}>
            {pausado ? <><Play size={16} aria-hidden="true" />Retomar envios</> : <><Pause size={16} aria-hidden="true" />Pausar tudo</>}
          </Button>
        }
      />

      <section aria-label="Conexões" className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-err-soft bg-err-soft/50 px-5 py-4">
        <div className="flex items-center gap-2.5 text-sm"><XCircle size={18} className="text-err" aria-hidden="true" /><strong className="font-semibold">WhatsApp desconectado</strong></div>
        <div className="flex items-center gap-2.5 text-sm text-muted"><CheckCircle2 size={18} className="text-ok" aria-hidden="true" />Última chamada do n8n: há 1 min</div>
        <Button size="sm" variant="primary" className="ml-auto"><QrCode size={15} aria-hidden="true" />Conectar WhatsApp</Button>
      </section>

      <section aria-label="Resumo" className="flex flex-wrap gap-4">
        <Stat label="Enviados / limite" value={`${logEnvios.length} / ${limite}`} hint={`${limite - logEnvios.length} restantes hoje`} />
        <Stat label="Com sucesso" value={ok} hintTone="ok" hint="entregues" />
        <Stat label="Falhas" value={falhas} hintTone={falhas ? "err" : "muted"} hint={falhas ? "número inválido ou sem WhatsApp" : "nenhuma"} />
        <Stat label="Aguardando envio" value={filaEnvios.length} hint={pausado ? "pausado" : `próximo: ${dataHora(filaEnvios[0]?.previsao ?? null)}`} />
      </section>

      <div className="flex flex-wrap items-start gap-4">
        <Card title={`Fila (${filaEnvios.length})`} padded={false} className="min-w-0 flex-[3_1_520px]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead><tr><th className="th !pl-5 w-12">#</th><th className="th">Lead</th><th className="th">Etapa</th><th className="th !pr-5">Previsão</th></tr></thead>
              <tbody>
                {filaEnvios.map((e) => (
                  <tr key={e.leadId + e.posicao} className={pausado ? "opacity-50" : ""}>
                    <td className="td !pl-5 tabular-nums text-muted">{e.posicao}</td>
                    <td className="td font-medium">{e.lead}<div className="text-[12px] font-normal text-muted">{e.leadId}</div></td>
                    <td className="td"><Pill tone={e.etapa === "Mensagem inicial" ? "brand" : "neutral"}>{e.etapa}</Pill></td>
                    <td className="td !pr-5 tabular-nums text-muted">{dataHora(e.previsao)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-line px-5 py-3 text-[12px] text-muted">1 envio por chamada do n8n, respeitando horário, limite diário e intervalo. A página atualiza sozinha a cada minuto.</p>
        </Card>

        <Card title="Log do dia" padded={false} className="min-w-0 flex-[2_1_320px]">
          <ul>
            {logEnvios.map((l) => (
              <li key={l.hora + l.lead} className="flex items-start gap-3 border-t border-line px-5 py-3">
                {l.ok ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-ok" aria-label="Enviado" /> : <XCircle size={18} className="mt-0.5 shrink-0 text-err" aria-label="Falhou" />}
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-3 text-sm"><span className="truncate font-medium">{l.lead}</span><span className="tabular-nums text-muted">{l.hora}</span></div>
                  <div className="text-[12px] text-muted">{l.etapa}{!l.ok && " · falha no envio"}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { Button, Card, PageHeader, Pill, Toggle } from "@/components/ui";

const ABAS = ["Envios", "Coleta", "Aprovação de leads", "Proxies", "Integrações"] as const;

function Campo({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="label min-w-[220px] flex-1">
      {label}
      {children}
      {hint && <span className="text-[12px] font-normal text-muted">{hint}</span>}
    </label>
  );
}

export default function ConfiguracoesPage() {
  const [aba, setAba] = useState<(typeof ABAS)[number]>("Envios");
  const [auto, setAuto] = useState(true);
  const [exigeWhats, setExigeWhats] = useState(true);
  const [semSite, setSemSite] = useState(true);
  const [redes, setRedes] = useState(true);
  const [rotacao, setRotacao] = useState(true);

  return (
    <>
      <PageHeader title="Configurações" subtitle="Regras de envio, do motor de coleta e de aprovação dos leads." />

      <nav aria-label="Seções" className="-mb-2 flex flex-wrap gap-1 border-b border-line">
        {ABAS.map((a) => (
          <button key={a} type="button" aria-current={aba === a ? "true" : undefined} onClick={() => setAba(a)}
            className={`-mb-px min-h-11 border-b-2 px-3.5 text-sm ${aba === a ? "border-ink font-semibold" : "border-transparent text-[#3a404c] hover:text-ink"}`}>{a}</button>
        ))}
      </nav>

      {aba === "Envios" && (
        <Card title="Regras de envio pelo WhatsApp">
          <div className="flex flex-col gap-5">
            <Toggle checked={auto} onChange={setAuto} label="Modo automático" hint='Quando a fila esvaziar, envia também para leads "Não contatado" com WhatsApp.' />
            <div className="flex flex-wrap gap-4">
              <Campo label="Limite diário de envios" hint="0 pausa todos os envios."><input type="number" className="input" defaultValue={20} min={0} /></Campo>
              <Campo label="Intervalo mínimo (segundos)" hint="Espera mínima entre dois envios."><input type="number" className="input" defaultValue={90} /></Campo>
              <Campo label="Intervalo máximo (segundos)" hint="A espera é sorteada entre o mínimo e o máximo."><input type="number" className="input" defaultValue={240} /></Campo>
            </div>
            <div className="flex flex-wrap gap-4">
              <Campo label="Hora de início" hint="Horário de Brasília, de segunda a sexta."><input type="time" className="input" defaultValue="09:00" /></Campo>
              <Campo label="Hora de fim" hint="Não envia a partir desta hora."><input type="time" className="input" defaultValue="19:00" /></Campo>
              <Campo label="Dias até o follow-up 1" hint="Contados a partir da mensagem inicial."><input type="number" className="input" defaultValue={2} /></Campo>
              <Campo label="Dias até o follow-up 2" hint="Contados a partir do follow-up 1."><input type="number" className="input" defaultValue={3} /></Campo>
            </div>
            <div className="flex justify-end border-t border-line pt-4"><Button variant="primary">Salvar configurações</Button></div>
          </div>
        </Card>
      )}

      {aba === "Coleta" && (
        <Card title="Motor de coleta (Google Maps)" action={<Pill tone="ok">Online</Pill>}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-4">
              <Campo label="Endereço do motor" hint="Na mesma VPS: use o nome do serviço no Docker."><input className="input font-mono !text-sm" defaultValue="http://scraper:8080" /></Campo>
              <Campo label="Token de acesso" hint="Gerado na instalação. Fica só no servidor."><input type="password" className="input" defaultValue="••••••••••••" /></Campo>
            </div>
            <div className="flex flex-wrap gap-4">
              <Campo label="Termos padrão" hint="Usados pela fila diária de cidades, um por linha."><textarea className="input" defaultValue={"clínica de estética\nclínica odontológica\nharmonização facial"} /></Campo>
              <div className="flex min-w-[220px] flex-1 flex-col gap-4">
                <Campo label="Grid padrão"><select className="input" defaultValue="2"><option value="1">1×1</option><option value="2">2×2</option><option value="3">3×3</option><option value="4">4×4</option></select></Campo>
                <Campo label="Profundidade padrão"><select className="input" defaultValue="2"><option value="1">1</option><option value="2">2</option><option value="3">3</option></select></Campo>
              </div>
            </div>
            <Toggle checked={redes} onChange={setRedes} label="Buscar redes sociais" hint="Deixa a coleta mais lenta, mas traz Instagram, Facebook e LinkedIn." />
            <div className="flex justify-end gap-2.5 border-t border-line pt-4"><Button>Testar conexão</Button><Button variant="primary">Salvar</Button></div>
          </div>
        </Card>
      )}

      {aba === "Aprovação de leads" && (
        <Card title="Quando um lead é aprovado">
          <div className="flex flex-col gap-5">
            <p className="-mt-2 text-sm text-muted">Cada lugar coletado passa por estas regras. Os que não passam ficam como “descartados” no controle de cidades.</p>
            <Toggle checked={exigeWhats} onChange={setExigeWhats} label="Exigir WhatsApp" hint="Celular válido no telefone do Google." />
            <Toggle checked={semSite} onChange={setSemSite} label="Somente quem não tem site" />
            <div className="flex flex-wrap gap-4">
              <Campo label="Nota mínima"><input type="number" step="0.1" className="input" defaultValue={4} /></Campo>
              <Campo label="Mínimo de avaliações"><input type="number" className="input" defaultValue={10} /></Campo>
              <Campo label="Ignorar categorias" hint="Separadas por vírgula."><input className="input" defaultValue="hospital, farmácia, laboratório" /></Campo>
            </div>
            <div className="flex justify-end border-t border-line pt-4"><Button variant="primary">Salvar regras</Button></div>
          </div>
        </Card>
      )}

      {aba === "Proxies" && (
        <Card title="Proxies" action={<span className="text-[13px] text-muted">18 ativos</span>}>
          <div className="flex flex-col gap-5">
            <Toggle checked={rotacao} onChange={setRotacao} label="Rodízio automático" hint="Troca de IP a cada bloco de busca." />
            <Campo label="Lista de proxies" hint="Um por linha: socks5://, http:// ou https://"><textarea className="input !min-h-[140px] font-mono !text-sm" defaultValue={"socks5://usuario:senha@proxy.exemplo.com:1080\nhttp://usuario:senha@proxy.exemplo.com:8000"} /></Campo>
            <div className="flex justify-end gap-2.5 border-t border-line pt-4"><Button>Testar proxies</Button><Button variant="primary">Salvar</Button></div>
          </div>
        </Card>
      )}

      {aba === "Integrações" && (
        <div className="flex flex-wrap gap-4">
          {[
            { nome: "n8n", desc: "Agenda a coleta diária e chama os envios a cada minuto.", status: "Conectado", tone: "ok" as const },
            { nome: "WhatsApp", desc: "Número usado nos envios e follow-ups.", status: "Desconectado", tone: "err" as const },
            { nome: "Banco de dados", desc: "Onde ficam leads, jobs, mensagens e configurações.", status: "Conectado", tone: "ok" as const },
            { nome: "Google Sheets", desc: "Exportação opcional dos leads aprovados.", status: "Não configurado", tone: "neutral" as const },
          ].map((i) => (
            <Card key={i.nome} className="min-w-[260px] flex-1">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-semibold">{i.nome}</h2><Pill tone={i.tone}>{i.status}</Pill></div>
                <p className="text-sm text-muted">{i.desc}</p>
                <Button size="sm" className="self-start">Configurar</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

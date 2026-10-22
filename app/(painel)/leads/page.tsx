"use client";

import { useMemo, useState } from "react";
import { Download, ExternalLink, MapPin, MessageCircle, Search, X } from "lucide-react";
import { Button, Card, Empty, LeadStatusPill, PageHeader } from "@/components/ui";
import { leads as leadsIniciais } from "@/lib/mock";
import { LEAD_STATUS, type Lead, type LeadStatus } from "@/lib/types";
import { data, nota, num } from "@/lib/format";

const POR_PAGINA = 12;
const ABAS: { label: string; match: (s: LeadStatus) => boolean }[] = [
  { label: "Todos", match: () => true },
  { label: "Não contatados", match: (s) => s === "Não contatado" },
  { label: "Em contato", match: (s) => ["Na fila", "Mensagem enviada", "Falha no envio", "Retornar depois"].includes(s) },
  { label: "Quentes", match: (s) => ["Respondeu", "Interessado", "Pediu orçamento", "Negociando"].includes(s) },
  { label: "Fechados", match: (s) => s === "Fechado" },
  { label: "Descartados", match: (s) => s === "Sem interesse" || s === "Não perturbe" },
];

const SIGLA: Record<string, string> = { Instagram: "IG", Facebook: "FB", LinkedIn: "IN" };
function Rede({ label, on }: { label: string; on: boolean }) {
  if (!on) return null;
  return <a href="#" aria-label={label} className="flex size-7 items-center justify-center rounded-md bg-surface-2 text-[11px] font-bold text-[#3a404c] hover:bg-line">{SIGLA[label]}</a>;
}

export default function LeadsPage() {
  const [lista, setLista] = useState<Lead[]>(leadsIniciais);
  const [q, setQ] = useState("");
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [tipo, setTipo] = useState("");
  const [status, setStatus] = useState("");
  const [notaMin, setNotaMin] = useState(0);
  const [req, setReq] = useState({ whatsapp: false, email: false, semSite: false, instagram: false });
  const [aba, setAba] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [aberto, setAberto] = useState<Lead | null>(null);

  const ufs = [...new Set(lista.map((l) => l.uf))].sort();
  const cidades = [...new Set(lista.filter((l) => !uf || l.uf === uf).map((l) => l.cidade))].sort();

  const base = useMemo(() => lista.filter((l) => {
    const t = q.trim().toLowerCase();
    if (t && ![l.nome, l.telefone ?? "", l.email ?? "", l.bairro, l.id].some((v) => v.toLowerCase().includes(t))) return false;
    if (uf && l.uf !== uf) return false;
    if (cidade && l.cidade !== cidade) return false;
    if (tipo && l.tipo !== tipo) return false;
    if (status && l.status !== status) return false;
    if (l.nota < notaMin) return false;
    if (req.whatsapp && !l.whatsapp) return false;
    if (req.email && !l.email) return false;
    if (req.semSite && l.site) return false;
    if (req.instagram && !l.instagram) return false;
    return true;
  }), [lista, q, uf, cidade, tipo, status, notaMin, req]);

  const filtrados = base.filter((l) => ABAS[aba].match(l.status));
  const paginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const pag = Math.min(pagina, paginas);
  const visiveis = filtrados.slice((pag - 1) * POR_PAGINA, pag * POR_PAGINA);
  const todosSel = visiveis.length > 0 && visiveis.every((l) => sel.has(l.id));

  const limpar = () => { setQ(""); setUf(""); setCidade(""); setTipo(""); setStatus(""); setNotaMin(0); setReq({ whatsapp: false, email: false, semSite: false, instagram: false }); setPagina(1); };
  const toggle = (id: string) => setSel((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const toggleTodos = () => setSel((s) => { const n = new Set(s); visiveis.forEach((l) => (todosSel ? n.delete(l.id) : n.add(l.id))); return n; });
  const mudarStatus = (ids: string[], st: LeadStatus) => {
    setLista((l) => l.map((x) => (ids.includes(x.id) ? { ...x, status: st } : x)));
    setAberto((a) => (a && ids.includes(a.id) ? { ...a, status: st } : a));
  };

  return (
    <>
      <PageHeader
        title="Leads"
        subtitle={`${num(lista.length)} estabelecimentos únicos, sem duplicados entre buscas.`}
        actions={<>
          <Button><Download size={16} aria-hidden="true" />CSV</Button>
          <Button><Download size={16} aria-hidden="true" />Excel</Button>
          <Button variant="primary" disabled={!sel.size} onClick={() => { mudarStatus([...sel], "Na fila"); setSel(new Set()); }}>Colocar na fila de envio</Button>
        </>}
      />

      <nav aria-label="Grupos de status" className="-mb-2 flex flex-wrap gap-1 border-b border-line">
        {ABAS.map((a, i) => (
          <button key={a.label} type="button" aria-current={aba === i ? "true" : undefined} onClick={() => { setAba(i); setPagina(1); }}
            className={`-mb-px flex min-h-11 items-center gap-2 border-b-2 px-3.5 text-sm ${aba === i ? "border-ink font-semibold" : "border-transparent text-[#3a404c] hover:text-ink"}`}>
            {a.label}<span className="text-[12px] text-muted">{base.filter((l) => a.match(l.status)).length}</span>
          </button>
        ))}
      </nav>

      <Card padded={false}>
        <div className="flex flex-col gap-3.5 p-4">
          <div className="flex flex-wrap gap-3">
            <label className="flex min-h-11 min-w-[260px] flex-[3] items-center gap-2.5 rounded-lg border border-line-strong px-3.5 focus-within:border-brand">
              <Search size={18} className="text-muted" aria-hidden="true" />
              <span className="sr-only">Buscar leads</span>
              <input type="search" className="min-w-0 flex-1 bg-transparent text-[15px] outline-none" placeholder="Nome, telefone, e-mail, bairro ou código" value={q} onChange={(e) => { setQ(e.target.value); setPagina(1); }} />
            </label>
            <label className="min-w-[110px] flex-1"><span className="sr-only">Estado</span>
              <select className="input" value={uf} onChange={(e) => { setUf(e.target.value); setCidade(""); setPagina(1); }}><option value="">Estado</option>{ufs.map((u) => <option key={u}>{u}</option>)}</select>
            </label>
            <label className="min-w-[150px] flex-1"><span className="sr-only">Cidade</span>
              <select className="input" value={cidade} onChange={(e) => { setCidade(e.target.value); setPagina(1); }}><option value="">Cidade</option>{cidades.map((c) => <option key={c}>{c}</option>)}</select>
            </label>
            <label className="min-w-[170px] flex-1"><span className="sr-only">Tipo</span>
              <select className="input" value={tipo} onChange={(e) => { setTipo(e.target.value); setPagina(1); }}><option value="">Tipo</option><option>Clínica</option><option>Profissional individual</option><option>Empresa</option></select>
            </label>
            <label className="min-w-[170px] flex-1"><span className="sr-only">Status</span>
              <select className="input" value={status} onChange={(e) => { setStatus(e.target.value); setPagina(1); }}><option value="">Status</option>{LEAD_STATUS.map((s) => <option key={s}>{s}</option>)}</select>
            </label>
            <label className="min-w-[130px] flex-1"><span className="sr-only">Nota mínima</span>
              <select className="input" value={notaMin} onChange={(e) => { setNotaMin(Number(e.target.value)); setPagina(1); }}><option value={0}>Qualquer nota</option><option value={4}>Nota 4,0+</option><option value={4.5}>Nota 4,5+</option><option value={4.8}>Nota 4,8+</option></select>
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {([["whatsapp", "Tem WhatsApp"], ["email", "Tem e-mail"], ["semSite", "Sem site"], ["instagram", "Tem Instagram"]] as const).map(([k, label]) => (
              <label key={k} className="flex min-h-9 items-center gap-2">
                <input type="checkbox" checked={req[k]} onChange={(e) => { setReq((r) => ({ ...r, [k]: e.target.checked })); setPagina(1); }} />{label}
              </label>
            ))}
            <button type="button" onClick={limpar} className="ml-auto text-[13px] font-medium text-brand hover:text-brand-strong">Limpar filtros</button>
          </div>
        </div>

        {sel.size > 0 && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 bg-ink px-5 py-3 text-sm text-white">
            <strong className="font-semibold">{sel.size} selecionado{sel.size > 1 && "s"}</strong>
            {(["Na fila", "Retornar depois", "Sem interesse"] as LeadStatus[]).map((st) => (
              <button key={st} type="button" onClick={() => { mudarStatus([...sel], st); setSel(new Set()); }} className="min-h-9 rounded-md border border-white/20 px-3 text-[13px] hover:bg-white/10">
                {st === "Na fila" ? "Colocar na fila" : `Marcar: ${st}`}
              </button>
            ))}
            <button type="button" onClick={() => setSel(new Set())} className="ml-auto text-[13px] text-[#c9ced6] hover:text-white">Limpar seleção</button>
          </div>
        )}

        <div className="overflow-x-auto border-t border-line">
          {visiveis.length === 0 ? <Empty>Nenhum lead com estes filtros.</Empty> : (
            <table className="w-full min-w-[1180px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="th !pl-5 w-8"><input type="checkbox" aria-label="Selecionar todos da página" checked={todosSel} onChange={toggleTodos} /></th>
                  <th className="th">Nome</th><th className="th">Cidade</th><th className="th">Telefone</th><th className="th">E-mail / site</th><th className="th">Redes</th><th className="th">Nota</th><th className="th">Status</th><th className="th !pr-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {visiveis.map((l) => (
                  <tr key={l.id} className={sel.has(l.id) ? "bg-brand-soft/50" : "hover:bg-surface-2/60"}>
                    <td className="td !pl-5"><input type="checkbox" aria-label={`Selecionar ${l.nome}`} checked={sel.has(l.id)} onChange={() => toggle(l.id)} /></td>
                    <td className="td">
                      <button type="button" onClick={() => setAberto(l)} className="min-w-[200px] text-left font-semibold hover:text-brand">{l.nome}</button>
                      <div className="whitespace-nowrap text-[13px] text-muted">{l.id} · {l.tipo}</div>
                    </td>
                    <td className="td whitespace-nowrap">{l.cidade}/{l.uf}<div className="text-[13px] text-muted">{l.bairro}</div></td>
                    <td className="td whitespace-nowrap font-mono text-[13px]">{l.telefone ?? <span className="text-faint">—</span>}</td>
                    <td className="td text-[13px]">
                      <div className="max-w-[240px] truncate">{l.email ?? <span className="text-faint">sem e-mail</span>}</div>
                      <div className="max-w-[240px] truncate">{l.site ? <a href="#" className="text-brand hover:text-brand-strong">{l.site}</a> : <span className="text-faint">sem site</span>}</div>
                    </td>
                    <td className="td"><div className="flex gap-1"><Rede label="Instagram" on={!!l.instagram} /><Rede label="Facebook" on={!!l.facebook} /><Rede label="LinkedIn" on={!!l.linkedin} /></div></td>
                    <td className="td whitespace-nowrap tabular-nums"><span className="text-[#b45309]" aria-hidden="true">★</span> <strong className="font-semibold">{nota(l.nota)}</strong> <span className="text-[13px] text-muted">({l.avaliacoes})</span></td>
                    <td className="td whitespace-nowrap"><LeadStatusPill status={l.status} /></td>
                    <td className="td !pr-5 whitespace-nowrap text-right">
                      <a href="#" aria-disabled={!l.whatsapp} className={`inline-flex min-h-8 items-center gap-1.5 rounded-md border border-line-strong px-2.5 text-[13px] font-medium ${l.whatsapp ? "hover:bg-surface-2" : "pointer-events-none opacity-40"}`}><MessageCircle size={14} aria-hidden="true" />WhatsApp</a>
                      <a href="#" aria-label="Ver no Google Maps" className="ml-1.5 inline-flex size-8 items-center justify-center rounded-md border border-line-strong hover:bg-surface-2"><MapPin size={15} aria-hidden="true" /></a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3.5 text-[13px] text-muted">
          <span>{num(filtrados.length)} lead(s) · página {pag} de {paginas}</span>
          <div className="flex gap-2">
            <Button size="sm" disabled={pag <= 1} onClick={() => setPagina(pag - 1)}>Anterior</Button>
            <Button size="sm" disabled={pag >= paginas} onClick={() => setPagina(pag + 1)}>Próxima</Button>
          </div>
        </div>
      </Card>

      {aberto && (
        <div className="fixed inset-0 z-50">
          <button type="button" aria-label="Fechar" className="absolute inset-0 bg-black/40" onClick={() => setAberto(null)} />
          <aside aria-label={`Detalhes de ${aberto.nome}`} className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col gap-5 overflow-y-auto bg-surface p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">{aberto.nome}</h2>
                <p className="text-sm text-muted">{aberto.id} · {aberto.categoria} · {aberto.tipo}</p>
              </div>
              <button type="button" aria-label="Fechar" onClick={() => setAberto(null)} className="flex size-10 items-center justify-center rounded-lg hover:bg-surface-2"><X size={20} /></button>
            </div>
            <label className="label">Status
              <select className="input" value={aberto.status} onChange={(e) => mudarStatus([aberto.id], e.target.value as LeadStatus)}>
                {LEAD_STATUS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <dl className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-3 text-sm">
              <dt className="text-muted">Endereço</dt><dd>{aberto.bairro}, {aberto.cidade}/{aberto.uf}</dd>
              <dt className="text-muted">Telefone</dt><dd className="font-mono text-[13px]">{aberto.telefone ?? "—"} {aberto.whatsapp && <span className="ml-1 text-ok-ink">· WhatsApp</span>}</dd>
              <dt className="text-muted">E-mail</dt><dd>{aberto.email ?? "—"}</dd>
              <dt className="text-muted">Site</dt><dd>{aberto.site ?? "sem site"}</dd>
              <dt className="text-muted">Instagram</dt><dd>{aberto.instagram ?? "—"}</dd>
              <dt className="text-muted">Nota</dt><dd>★ {nota(aberto.nota)} ({aberto.avaliacoes} avaliações)</dd>
              <dt className="text-muted">Origem</dt><dd>{aberto.jobId} · {data(aberto.criadoEm)}</dd>
            </dl>
            <div className="flex flex-col gap-2">
              <span className="text-[13px] font-medium">Anotações</span>
              <textarea className="input" placeholder="Ex.: falou com a recepção, retornar na sexta." />
            </div>
            <div className="mt-auto flex flex-wrap gap-2.5">
              <Button variant="primary" onClick={() => mudarStatus([aberto.id], "Na fila")}>Colocar na fila</Button>
              <Button><ExternalLink size={16} aria-hidden="true" />Abrir no Maps</Button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

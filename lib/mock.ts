// Dados de exemplo (fictícios). Serão substituídos pela base de dados real.
import type { Agendamento, CidadeControle, CidadeFila, Envio, Job, Lead, LeadStatus, Mensagem } from "./types";

let seed = 42;
const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rnd() * arr.length)];

const NOMES = [
  "Odonto Vila Rica", "Sorriso Taquaral", "Clínica Dental Cambuí", "Instituto OrtoPrime", "Espaço Oral Barão",
  "Odonto Família Castelo", "Clínica Sorrir Mais", "Implantes Guanabara", "Estética Bela Pele", "Studio Face Harmonia",
  "Clínica Renova Corpo", "Espaço Leve Estética", "Instituto Derma Viva", "Clínica Essenza", "Ponto Fisio Saúde",
  "Fisio Movimento Pleno", "Clínica Vitalle", "Studio Pilates Equilíbrio", "Clínica Integra Saúde", "Dermaclin Centro",
  "Odontoprime Batel", "Clínica Sorriso Água Verde", "Estética Lume", "Espaço Harmonize", "Clínica Bem Viver",
  "Instituto Face & Forma", "Clínica Nova Estética", "Odonto Setor Bueno", "Clínica Pele Rara", "Fisio Ativa Goiânia",
  "Clínica Boa Viagem Odonto", "Espaço Derma Recife", "Studio Corpo Leve", "Clínica Sorrir Recife", "Estética Mar Azul",
  "Clínica Viva Bem", "Odonto Casa Forte", "Instituto Renascer", "Clínica Prime Face", "Espaço Saúde Integral",
];
const CIDADES = [
  { cidade: "Campinas", uf: "SP", bairros: ["Cambuí", "Taquaral", "Barão Geraldo", "Castelo", "Guanabara", "Centro"] },
  { cidade: "Curitiba", uf: "PR", bairros: ["Batel", "Água Verde", "Centro Cívico", "Bigorrilho"] },
  { cidade: "Goiânia", uf: "GO", bairros: ["Setor Bueno", "Setor Marista", "Jardim Goiás"] },
  { cidade: "Recife", uf: "PE", bairros: ["Boa Viagem", "Casa Forte", "Espinheiro", "Graças"] },
];
const DDD: Record<string, string> = { SP: "19", PR: "41", GO: "62", PE: "81" };
const CATS = ["Clínica odontológica", "Clínica de estética", "Fisioterapia", "Dermatologia"];
const STATUS_PESO: LeadStatus[] = [
  "Não contatado", "Não contatado", "Não contatado", "Na fila", "Mensagem enviada", "Mensagem enviada", "Mensagem enviada",
  "Mensagem enviada", "Falha no envio", "Respondeu", "Interessado", "Pediu orçamento", "Negociando", "Retornar depois",
  "Sem interesse", "Não perturbe", "Fechado",
];

const slug = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "");

export const leads: Lead[] = NOMES.map((nome, i) => {
  const c = CIDADES[Math.floor(i / 10)];
  const temSite = rnd() > 0.55;
  const temEmail = rnd() > 0.5;
  const ig = rnd() > 0.2;
  const status = pick(STATUS_PESO);
  const dia = 1 + Math.floor(rnd() * 21);
  return {
    id: `CLI-${String(i + 1).padStart(4, "0")}`,
    nome,
    tipo: rnd() > 0.75 ? "Profissional individual" : "Clínica",
    categoria: CATS[Math.floor(rnd() * CATS.length)],
    cidade: c.cidade,
    uf: c.uf,
    bairro: pick(c.bairros),
    telefone: rnd() > 0.06 ? `(${DDD[c.uf]}) 9${Math.floor(8000 + rnd() * 1999)}-${String(Math.floor(rnd() * 9999)).padStart(4, "0")}` : null,
    whatsapp: rnd() > 0.1,
    email: temEmail ? `contato@${slug(nome)}.com.br` : null,
    site: temSite ? `${slug(nome)}.com.br` : null,
    instagram: ig ? `@${slug(nome)}` : null,
    facebook: rnd() > 0.5 ? slug(nome) : null,
    linkedin: rnd() > 0.85 ? slug(nome) : null,
    nota: Math.round((4 + rnd()) * 10) / 10,
    avaliacoes: Math.floor(8 + rnd() * 400),
    status,
    jobId: `JOB-${String(100 + Math.floor(i / 10)).padStart(4, "0")}`,
    criadoEm: `2026-10-${String(dia).padStart(2, "0")}T10:00:00-03:00`,
    valorVenda: status === "Fechado" ? 1800 + Math.floor(rnd() * 4) * 600 : undefined,
  };
});

export const jobs: Job[] = [
  { id: "JOB-0107", termo: "clínica odontológica", cidade: "Campinas", uf: "SP", grid: 3, profundidade: 2, redesSociais: true, status: "rodando", progresso: 56, encontrados: 412, aprovados: 118, inicio: "2026-10-22T14:02:00-03:00", origem: "manual" },
  { id: "JOB-0108", termo: "pet shop", cidade: "Sorocaba", uf: "SP", grid: 2, profundidade: 2, redesSociais: false, status: "fila", progresso: 0, encontrados: 0, aprovados: 0, inicio: null, origem: "agendamento" },
  { id: "JOB-0106", termo: "clínica de estética", cidade: "Recife", uf: "PE", grid: 2, profundidade: 2, redesSociais: true, status: "concluido", progresso: 100, encontrados: 286, aprovados: 74, inicio: "2026-10-22T09:00:00-03:00", origem: "n8n" },
  { id: "JOB-0105", termo: "fisioterapia", cidade: "Goiânia", uf: "GO", grid: 1, profundidade: 3, redesSociais: true, status: "concluido", progresso: 100, encontrados: 118, aprovados: 41, inicio: "2026-10-21T09:00:00-03:00", origem: "n8n" },
  { id: "JOB-0104", termo: "dermatologia", cidade: "Curitiba", uf: "PR", grid: 3, profundidade: 2, redesSociais: false, status: "erro", progresso: 31, encontrados: 96, aprovados: 22, inicio: "2026-10-20T09:00:00-03:00", origem: "n8n", erro: "Bloqueio do Google (429)" },
];

export const cidadesControle: CidadeControle[] = [
  { data: "2026-10-22", cidade: "Recife", uf: "PE", analisadas: 286, aprovadas: 74, descartadas: 198, duplicadas: 14 },
  { data: "2026-10-21", cidade: "Goiânia", uf: "GO", analisadas: 118, aprovadas: 41, descartadas: 70, duplicadas: 7 },
  { data: "2026-10-20", cidade: "Curitiba", uf: "PR", analisadas: 96, aprovadas: 22, descartadas: 71, duplicadas: 3 },
  { data: "2026-10-19", cidade: "Campinas", uf: "SP", analisadas: 1012, aprovadas: 233, descartadas: 742, duplicadas: 37 },
];

const FILA: [string, string, CidadeFila["regiao"]][] = [
  ["Campinas", "SP", "Sudeste"], ["Curitiba", "PR", "Sul"], ["Goiânia", "GO", "Centro-Oeste"], ["Recife", "PE", "Nordeste"],
  ["Salvador", "BA", "Nordeste"], ["Brasília", "DF", "Centro-Oeste"], ["Rio de Janeiro", "RJ", "Sudeste"], ["Porto Alegre", "RS", "Sul"],
  ["Manaus", "AM", "Norte"], ["Fortaleza", "CE", "Nordeste"], ["Belo Horizonte", "MG", "Sudeste"], ["Florianópolis", "SC", "Sul"],
  ["Belém", "PA", "Norte"], ["Campo Grande", "MS", "Centro-Oeste"], ["Vitória", "ES", "Sudeste"], ["Londrina", "PR", "Sul"],
  ["São Luís", "MA", "Nordeste"], ["Ribeirão Preto", "SP", "Sudeste"], ["Maringá", "PR", "Sul"], ["Natal", "RN", "Nordeste"],
];
const FEITAS: Record<string, [string, number]> = {
  Campinas: ["2026-10-19", 233], Curitiba: ["2026-10-20", 22], Goiânia: ["2026-10-21", 41], Recife: ["2026-10-22", 74],
};
export const cidadesFila: CidadeFila[] = FILA.map(([cidade, uf, regiao]) => ({
  cidade, uf, regiao, ultimaPesquisa: FEITAS[cidade]?.[0] ?? null, leads: FEITAS[cidade]?.[1] ?? 0,
}));

export const agendamentos: Agendamento[] = [
  { id: "AG-01", nome: "Fila diária de cidades", termos: ["clínica de estética", "clínica odontológica"], cidades: ["Próxima da fila"], frequencia: "Seg. a sex., 09:00", proxima: "2026-10-23T09:00:00-03:00", ultimosNovos: 74, ativo: true },
  { id: "AG-02", nome: "Odonto interior SP", termos: ["clínica odontológica", "implante dentário"], cidades: ["Campinas", "Jundiaí", "Piracicaba", "Sorocaba"], frequencia: "Toda segunda, 08:00", proxima: "2026-10-26T08:00:00-03:00", ultimosNovos: 184, ativo: true },
  { id: "AG-03", nome: "Fisioterapia capitais", termos: ["fisioterapia", "pilates"], cidades: ["Goiânia", "Brasília", "Campo Grande"], frequencia: "Todo dia 1, 06:00", proxima: "2026-11-01T06:00:00-03:00", ultimosNovos: 61, ativo: true },
  { id: "AG-04", nome: "Pet shops litoral", termos: ["pet shop", "banho e tosa"], cidades: ["Santos", "Guarujá"], frequencia: "Toda sexta, 09:00", proxima: null, ultimosNovos: 37, ativo: false },
];

export const mensagens: Mensagem[] = [
  { id: "MSG-001", nome: "A — Direta", etapa: "Mensagem inicial", ativa: false, texto: "Olá! Vi a {{nome}} no Google, em {{cidade}}. Vocês já têm site próprio? Trabalho com isso e posso te mostrar uma ideia rápida." },
  { id: "MSG-002", nome: "B — Prova social", etapa: "Mensagem inicial", ativa: false, texto: "Oi, tudo bem? Encontrei a {{nome}} no Google com nota {{nota}}. Clínicas com essa reputação costumam ganhar muito mais pacientes com uma página própria. Posso te mostrar como?" },
  { id: "MSG-003", nome: "C — Aversão à perda", etapa: "Mensagem inicial", ativa: true, texto: "Boa tarde! Pesquisei clínicas em {{cidade}} e reparei numa coisa: a {{nome}} tem {{avaliacoes}} avaliações e nota {{nota}}, mas não encontrei um site de vocês.\n\nQuem pesquisa no Google acaba clicando em quem tem página própria. Posso te mostrar em 2 minutos o que eu vi?" },
  { id: "MSG-004", nome: "Follow-up 1", etapa: "Follow-up 1", ativa: true, texto: "Oi! Passando para saber se você viu minha mensagem sobre o site da {{nome}}. Se fizer sentido, te mando um exemplo." },
  { id: "MSG-005", nome: "Follow-up 2", etapa: "Follow-up 2", ativa: true, texto: "Última mensagem,, prometo! Se em algum momento quiser conversar sobre o site da {{nome}}, é só responder aqui." },
];

const hoje = (h: number, m: number) => `2026-10-22T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00-03:00`;
export const filaEnvios: Envio[] = leads
  .filter((l) => l.whatsapp && (l.status === "Mensagem enviada" || l.status === "Não contatado" || l.status === "Na fila"))
  .slice(0, 14)
  .map((l, i) => ({
    posicao: i + 1,
    leadId: l.id,
    lead: l.nome,
    etapa: l.status === "Mensagem enviada" ? (i % 3 === 0 ? "Follow-up 2" : "Follow-up 1") : "Mensagem inicial",
    previsao: i < 9 ? hoje(16 + Math.floor((16 + i * 3) / 60), (16 + i * 3) % 60) : `2026-10-23T09:${String((i - 9) * 3).padStart(2, "0")}:00-03:00`,
  }));

export const logEnvios = [
  { hora: "15:58", lead: "Clínica Essenza", etapa: "Mensagem inicial", ok: true },
  { hora: "15:54", lead: "Studio Face Harmonia", etapa: "Follow-up 1", ok: true },
  { hora: "15:50", lead: "Clínica Renova Corpo", etapa: "Follow-up 1", ok: false },
  { hora: "15:46", lead: "Instituto Derma Viva", etapa: "Mensagem inicial", ok: true },
  { hora: "15:41", lead: "Espaço Leve Estética", etapa: "Follow-up 2", ok: true },
];

export const leadsPorDia = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 8, 23 + i);
  return {
    dia: `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`,
    leads: i % 7 === 5 || i % 7 === 6 ? 0 : Math.floor(10 + rnd() * 70),
  };
});

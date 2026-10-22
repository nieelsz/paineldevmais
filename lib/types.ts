export const LEAD_STATUS = [
  "Não contatado",
  "Na fila",
  "Mensagem enviada",
  "Falha no envio",
  "Respondeu",
  "Interessado",
  "Pediu orçamento",
  "Negociando",
  "Retornar depois",
  "Sem interesse",
  "Não perturbe",
  "Fechado",
] as const;

export type LeadStatus = (typeof LEAD_STATUS)[number];

export type Lead = {
  id: string; // CLI-0001
  nome: string;
  tipo: "Clínica" | "Profissional individual" | "Empresa";
  categoria: string;
  cidade: string;
  uf: string;
  bairro: string;
  telefone: string | null;
  whatsapp: boolean;
  email: string | null;
  site: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  nota: number;
  avaliacoes: number;
  status: LeadStatus;
  jobId: string;
  criadoEm: string; // ISO
  valorVenda?: number;
};

export type JobStatus = "fila" | "rodando" | "concluido" | "erro";

export type Job = {
  id: string;
  termo: string;
  cidade: string;
  uf: string;
  grid: number; // 1 = 1x1
  profundidade: number;
  redesSociais: boolean;
  status: JobStatus;
  progresso: number; // 0-100
  encontrados: number;
  aprovados: number;
  inicio: string | null; // ISO
  origem: "manual" | "agendamento" | "n8n";
  erro?: string;
};

export type CidadeControle = {
  data: string;
  cidade: string;
  uf: string;
  analisadas: number;
  aprovadas: number;
  descartadas: number;
  duplicadas: number;
};

export type CidadeFila = {
  cidade: string;
  uf: string;
  regiao: "Norte" | "Nordeste" | "Centro-Oeste" | "Sudeste" | "Sul";
  ultimaPesquisa: string | null;
  leads: number;
};

export type Agendamento = {
  id: string;
  nome: string;
  termos: string[];
  cidades: string[];
  frequencia: string;
  proxima: string | null;
  ultimosNovos: number;
  ativo: boolean;
};

export type Etapa = "Mensagem inicial" | "Follow-up 1" | "Follow-up 2";

export type Mensagem = {
  id: string; // MSG-001
  nome: string;
  etapa: Etapa;
  ativa: boolean;
  texto: string;
};

export type Envio = {
  posicao: number;
  leadId: string;
  lead: string;
  etapa: Etapa;
  previsao: string;
};

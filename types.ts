
export interface Sale {
  id: number;
  dataCadastro: string;
  unidade: string;
  vendedor: string;
  nomeCliente: string;
  telefone: string;
  categoria: 'Produto A' | 'Produto B' | 'Serviço X' | 'Serviço Y';
  origem: 'Website' | 'Indicação' | 'Feira' | 'Anúncio';
  status: 'Ativo' | 'Fechado' | 'Perdido';
  etapaFunil: 'Lead' | 'Prospecção' | 'Negociação' | 'Fechamento' | 'Perdido';
  valorInicial: number;
  valorVenda: number;
  
  // New fields for Detail View
  qualificacao?: 1 | 2 | 3 | 4 | 5;
  previsaoFechamento?: string;
  cidade?: string;
  endereco?: string;
  whatsapp?: string;
  email?: string;
  redesSociais?: string;
}

export interface Filters {
  unidade: string;
  vendedor: string;
  dataCadastro: string;
  valorInicial: string;
  valorVenda: string;
  nomeCliente: string;
  telefone: string;
  categoria: string;
  origem: string;
  status: string;
  etapaFunil: string;
}

export interface Unit {
  id: number;
  name: string;
  active: boolean;
}

export type UserRole = 'Master' | 'Gestor' | 'Equipe';

export interface Seller {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  active: boolean;
  avatar?: string;
}

export interface AIConfig {
  apiKey: string;
  model: string;
  temperature: number;
  tone: string;
}

export interface AITrainingData {
  businessContext: string;
  uploadedFiles: string[];
}

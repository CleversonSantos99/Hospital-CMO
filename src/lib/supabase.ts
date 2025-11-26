import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Especialidade = {
  id: number;
  especialidade: string | null;
  valor_particular: string | null;
  valor_cartao_cmo: string | null;
  valor_pax_vida: string | null;
  conveniados: string | null;
  profissional: string | null;
  registro: string | null;
  atendimento: string | null;
  convenio: string | null;
  observacoes: string | null;
  tipo: string | null;
};

export type Procedimento = {
  id: number;
  procedimento: string | null;
  valor_particular: string | null;
  valor_cartao_cmo: string | null;
  valor_pax_vida: string | null;
  atendimento: string | null;
  convenio: string | null;
  observacoes: string | null;
};

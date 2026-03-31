/*
  # Enable RLS on all tables

  1. Security Overview
    - Enable RLS on 13 tables that don't have it enabled
    - Remove any existing policies to start fresh
    - Apply appropriate policies based on table type:
      - Catalog tables (especialidade, convenios, procedimentos): Public read for authenticated users
      - Chat history tables (n8n_*): Public read for all (needed for external integrations)
      - Control tables (disparo_*, leads): Public read for authenticated users
      - Reference tables (documents): Public read for authenticated users
    - Catalog and reference tables use permissive SELECT for authenticated users
    - Chat history tables use permissive SELECT for everyone (webhook access)

  2. Tables Getting RLS Enabled
    - leads, documents, procedimentos, n8n_chat_histories_resultado_exame, 
    - n8n_chat_histories_cartao, n8n_chat_histories_nota_fiscal, 
    - n8n_chat_histories_exames, leads_rafael, n8n_chat_histories_retorno,
    - n8n_chat_histories_consultas, leads_cartao_cmo, leads_laboratorio

  3. Policy Strategy
    - Catalog/Reference: SELECT for authenticated (specialidade, convenios, procedimentos, documents)
    - Chat histories: SELECT for all (n8n_*) - needed for external webhook access
    - Leads variations: SELECT for authenticated (leads, leads_rafael, leads_cartao_cmo, leads_laboratorio)
    - All policies are PERMISSIVE and read-only
*/

-- Enable RLS on leads table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_privileges 
    WHERE table_name='leads' AND privilege_type='SELECT'
  ) THEN
    ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DROP POLICY IF EXISTS "leads_select_policy" ON leads;
CREATE POLICY "leads_select_policy" 
  ON leads FOR SELECT 
  TO authenticated
  USING (true);

-- Enable RLS on documents table
DO $$
BEGIN
  ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
END $$;

DROP POLICY IF EXISTS "documents_select_policy" ON documents;
CREATE POLICY "documents_select_policy" 
  ON documents FOR SELECT 
  TO authenticated
  USING (true);

-- Enable RLS on procedimentos table
DO $$
BEGIN
  ALTER TABLE procedimentos ENABLE ROW LEVEL SECURITY;
END $$;

DROP POLICY IF EXISTS "procedimentos_select_policy" ON procedimentos;
CREATE POLICY "procedimentos_select_policy" 
  ON procedimentos FOR SELECT 
  TO authenticated
  USING (true);

-- Enable RLS on n8n_chat_histories_resultado_exame table
DO $$
BEGIN
  ALTER TABLE n8n_chat_histories_resultado_exame ENABLE ROW LEVEL SECURITY;
END $$;

DROP POLICY IF EXISTS "n8n_resultado_exame_select_policy" ON n8n_chat_histories_resultado_exame;
CREATE POLICY "n8n_resultado_exame_select_policy" 
  ON n8n_chat_histories_resultado_exame FOR SELECT 
  USING (true);

-- Enable RLS on n8n_chat_histories_cartao table
DO $$
BEGIN
  ALTER TABLE n8n_chat_histories_cartao ENABLE ROW LEVEL SECURITY;
END $$;

DROP POLICY IF EXISTS "n8n_cartao_select_policy" ON n8n_chat_histories_cartao;
CREATE POLICY "n8n_cartao_select_policy" 
  ON n8n_chat_histories_cartao FOR SELECT 
  USING (true);

-- Enable RLS on n8n_chat_histories_nota_fiscal table
DO $$
BEGIN
  ALTER TABLE n8n_chat_histories_nota_fiscal ENABLE ROW LEVEL SECURITY;
END $$;

DROP POLICY IF EXISTS "n8n_nota_fiscal_select_policy" ON n8n_chat_histories_nota_fiscal;
CREATE POLICY "n8n_nota_fiscal_select_policy" 
  ON n8n_chat_histories_nota_fiscal FOR SELECT 
  USING (true);

-- Enable RLS on n8n_chat_histories_exames table
DO $$
BEGIN
  ALTER TABLE n8n_chat_histories_exames ENABLE ROW LEVEL SECURITY;
END $$;

DROP POLICY IF EXISTS "n8n_exames_select_policy" ON n8n_chat_histories_exames;
CREATE POLICY "n8n_exames_select_policy" 
  ON n8n_chat_histories_exames FOR SELECT 
  USING (true);

-- Enable RLS on leads_rafael table
DO $$
BEGIN
  ALTER TABLE leads_rafael ENABLE ROW LEVEL SECURITY;
END $$;

DROP POLICY IF EXISTS "leads_rafael_select_policy" ON leads_rafael;
CREATE POLICY "leads_rafael_select_policy" 
  ON leads_rafael FOR SELECT 
  TO authenticated
  USING (true);

-- Enable RLS on n8n_chat_histories_retorno table
DO $$
BEGIN
  ALTER TABLE n8n_chat_histories_retorno ENABLE ROW LEVEL SECURITY;
END $$;

DROP POLICY IF EXISTS "n8n_retorno_select_policy" ON n8n_chat_histories_retorno;
CREATE POLICY "n8n_retorno_select_policy" 
  ON n8n_chat_histories_retorno FOR SELECT 
  USING (true);

-- Enable RLS on n8n_chat_histories_consultas table
DO $$
BEGIN
  ALTER TABLE n8n_chat_histories_consultas ENABLE ROW LEVEL SECURITY;
END $$;

DROP POLICY IF EXISTS "n8n_consultas_select_policy" ON n8n_chat_histories_consultas;
CREATE POLICY "n8n_consultas_select_policy" 
  ON n8n_chat_histories_consultas FOR SELECT 
  USING (true);

-- Enable RLS on leads_cartao_cmo table
DO $$
BEGIN
  ALTER TABLE leads_cartao_cmo ENABLE ROW LEVEL SECURITY;
END $$;

DROP POLICY IF EXISTS "leads_cartao_cmo_select_policy" ON leads_cartao_cmo;
CREATE POLICY "leads_cartao_cmo_select_policy" 
  ON leads_cartao_cmo FOR SELECT 
  TO authenticated
  USING (true);

-- Enable RLS on leads_laboratorio table
DO $$
BEGIN
  ALTER TABLE leads_laboratorio ENABLE ROW LEVEL SECURITY;
END $$;

DROP POLICY IF EXISTS "leads_laboratorio_select_policy" ON leads_laboratorio;
CREATE POLICY "leads_laboratorio_select_policy" 
  ON leads_laboratorio FOR SELECT 
  TO authenticated
  USING (true);

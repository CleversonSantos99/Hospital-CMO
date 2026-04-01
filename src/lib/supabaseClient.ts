import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://xrfnwyultkgpkcrkvabl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyZm53eXVsdGtncGtjcmt2YWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1Njg5ODUsImV4cCI6MjA2NzE0NDk4NX0.NjVyrWzZdP9emugDFK83jsYW4qmBTmD3G97mxWXRzIQ';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórios no .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

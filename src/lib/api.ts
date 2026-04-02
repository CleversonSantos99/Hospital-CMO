import { supabase } from './supabaseClient';

class ApiClient {
  // ─── Auth ───────────────────────────────────────────────────────────────────
  async login(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  async isAuthenticated(): Promise<boolean> {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  }

  // ─── Dados ──────────────────────────────────────────────────────────────────
  async getEspecialidades() {
    const { data, error } = await supabase.from('especialidade').select('*');
    if (error) throw new Error(error.message);
    return data ?? [];
  }

  async getProcedimentos() {
    const { data, error } = await supabase.from('procedimentos').select('*');
    if (error) throw new Error(error.message);
    return data ?? [];
  }

  async getLeads() {
    const { data, error } = await supabase.from('leads').select('*');
    if (error) throw new Error(error.message);
    return data ?? [];
  }

  async getAgendamentos() {
    const { data, error } = await supabase.from('agendamentos').select('*');
    if (error) throw new Error(error.message);
    return data ?? [];
  }

  async createEspecialidade(payload: unknown) {
    const { data, error } = await supabase.from('especialidade').insert(payload).select();
    if (error) throw new Error(error.message);
    return data;
  }

  async updateEspecialidade(id: number, payload: unknown) {
    const { data, error } = await supabase.from('especialidade').update(payload).eq('id', id).select();
    if (error) throw new Error(error.message);
    return data;
  }

  async deleteEspecialidade(id: number) {
    const { error } = await supabase.from('especialidade').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }

  async createProcedimento(payload: unknown) {
    const { data, error } = await supabase.from('procedimentos').insert(payload).select();
    if (error) throw new Error(error.message);
    return data;
  }

  async updateProcedimento(id: number, payload: unknown) {
    const { data, error } = await supabase.from('procedimentos').update(payload).eq('id', id).select();
    if (error) throw new Error(error.message);
    return data;
  }

  async deleteProcedimento(id: number) {
    const { error } = await supabase.from('procedimentos').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}

export const apiClient = new ApiClient();

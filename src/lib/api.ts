import { supabase } from './supabaseClient';

export class ApiClient {
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getEspecialidades() {
    const { data, error } = await supabase
      .from('especialidade')
      .select('*');
    if (error) throw new Error(error.message);
    return data;
  }

  async getProcedimentos() {
    const { data, error } = await supabase
      .from('procedimentos')
      .select('*');
    if (error) throw new Error(error.message);
    return data;
  }

  async getLeads() {
    const { data, error } = await supabase
      .from('leads')
      .select('*');
    if (error) throw new Error(error.message);
    return data;
  }

  async getAgendamentos() {
    const { data, error } = await supabase
      .from('agendamentos')
      .select('*');
    if (error) throw new Error(error.message);
    return data;
  }

  async updateEspecialidade(id: number, payload: unknown) {
    const { data, error } = await supabase
      .from('especialidade')
      .update(payload)
      .eq('id', id)
      .select();
    if (error) throw new Error(error.message);
    return data;
  }

  async updateProcedimento(id: number, payload: unknown) {
    const { data, error } = await supabase
      .from('procedimentos')
      .update(payload)
      .eq('id', id)
      .select();
    if (error) throw new Error(error.message);
    return data;
  }
}

export const apiClient = new ApiClient();
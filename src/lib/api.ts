import { supabase } from './supabaseClient';

const API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

export class ApiClient {
  isAuthenticated(): boolean {
    return !!supabase.auth.getSession;
  }

  private async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }

    return headers;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }

  async getEspecialidades() {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_URL}/data/especialidades`, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch especialidades");
    }

    return data.data;
  }

  async getProcedimentos() {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_URL}/data/procedimentos`, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch procedimentos");
    }

    return data.data;
  }

  async getLeads() {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_URL}/data/leads`, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch leads");
    }

    return data.data;
  }

  async getAgendamentos() {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_URL}/data/agendamentos`, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch agendamentos");
    }

    return data.data;
  }

  async updateEspecialidade(id: number, payload: unknown) {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_URL}/data/especialidades/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update especialidade");
    }

    return data.data;
  }

  async updateProcedimento(id: number, payload: unknown) {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_URL}/data/procedimentos/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update procedimento");
    }

    return data.data;
  }
}

export const apiClient = new ApiClient();

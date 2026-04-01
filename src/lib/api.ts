const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const SESSION_KEY = 'cmo_session';

interface Session {
  token: string;
  refreshToken: string;
  expiresAt: number;
}

function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(session: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

class ApiClient {
  private async refreshIfNeeded(): Promise<string | null> {
    const session = getSession();
    if (!session) return null;

    // Renova o token 60 segundos antes de expirar
    const nowInSeconds = Math.floor(Date.now() / 1000);
    if (session.expiresAt - nowInSeconds > 60) {
      return session.token;
    }

    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });

    if (!res.ok) {
      clearSession();
      return null;
    }

    const data = await res.json();
    saveSession({ token: data.token, refreshToken: data.refreshToken, expiresAt: data.expiresAt });
    return data.token;
  }

  private async fetch<T>(path: string, options?: RequestInit): Promise<T> {
    const token = await this.refreshIfNeeded();

    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });

    if (res.status === 401) {
      clearSession();
      window.dispatchEvent(new Event('auth:logout'));
      throw new Error('Sessão expirada. Faça login novamente.');
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || 'Erro na requisição');
    }

    return res.json();
  }

  // ─── Auth ───────────────────────────────────────────────────────────────────
  async login(email: string, password: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || 'Credenciais inválidas');
    }

    const data = await res.json();
    saveSession({ token: data.token, refreshToken: data.refreshToken, expiresAt: data.expiresAt });
  }

  async signOut(): Promise<void> {
    try {
      await this.fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      clearSession();
    }
  }

  isAuthenticated(): boolean {
    return !!getSession();
  }

  // ─── Dados ──────────────────────────────────────────────────────────────────
  async getEspecialidades() {
    const { data } = await this.fetch<{ data: unknown[] }>('/api/especialidades');
    return data;
  }

  async getProcedimentos() {
    const { data } = await this.fetch<{ data: unknown[] }>('/api/procedimentos');
    return data;
  }

  async getLeads() {
    const { data } = await this.fetch<{ data: unknown[] }>('/api/leads');
    return data;
  }

  async getAgendamentos() {
    const { data } = await this.fetch<{ data: unknown[] }>('/api/agendamentos');
    return data;
  }

  async createEspecialidade(payload: unknown) {
    const { data } = await this.fetch<{ data: unknown[] }>('/api/especialidades', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return data;
  }

  async updateEspecialidade(id: number, payload: unknown) {
    const { data } = await this.fetch<{ data: unknown[] }>(`/api/especialidades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return data;
  }

  async deleteEspecialidade(id: number) {
    await this.fetch(`/api/especialidades/${id}`, { method: 'DELETE' });
  }

  async createProcedimento(payload: unknown) {
    const { data } = await this.fetch<{ data: unknown[] }>('/api/procedimentos', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return data;
  }

  async updateProcedimento(id: number, payload: unknown) {
    const { data } = await this.fetch<{ data: unknown[] }>(`/api/procedimentos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return data;
  }

  async deleteProcedimento(id: number) {
    await this.fetch(`/api/procedimentos/${id}`, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

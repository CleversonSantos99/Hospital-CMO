const API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export class ApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  setTokens(access_token: string, refresh_token: string) {
    this.accessToken = access_token;
    this.refreshToken = refresh_token;
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
  }

  getAccessToken(): string | null {
    if (this.accessToken) return this.accessToken;
    this.accessToken = localStorage.getItem("access_token");
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    if (this.refreshToken) return this.refreshToken;
    this.refreshToken = localStorage.getItem("refresh_token");
    return this.refreshToken;
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const token = this.getAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  async signUp(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Sign up failed");
    }

    return data;
  }

  async signIn(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Sign in failed");
    }

    if (data.access_token && data.refresh_token) {
      this.setTokens(data.access_token, data.refresh_token);
    }

    return data;
  }

  async signOut() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearTokens();
      return;
    }

    try {
      await fetch(`${API_URL}/auth/signout`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      this.clearTokens();
    }
  }

  async getEspecialidades() {
    const response = await fetch(`${API_URL}/data/especialidades`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch especialidades");
    }

    return data.data;
  }

  async getProcedimentos() {
    const response = await fetch(`${API_URL}/data/procedimentos`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch procedimentos");
    }

    return data.data;
  }

  async getLeads() {
    const response = await fetch(`${API_URL}/data/leads`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch leads");
    }

    return data.data;
  }

  async getAgendamentos() {
    const response = await fetch(`${API_URL}/data/agendamentos`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch agendamentos");
    }

    return data.data;
  }

  async updateEspecialidade(id: number, payload: unknown) {
    const response = await fetch(`${API_URL}/data/especialidades/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update especialidade");
    }

    return data.data;
  }

  async updateProcedimento(id: number, payload: unknown) {
    const response = await fetch(`${API_URL}/data/procedimentos/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
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

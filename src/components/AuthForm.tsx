import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { apiClient } from '../lib/api';

const VALID_EMAIL = 'hospitalcmoai@gmail.com';
const VALID_PASSWORD = 'Mkt8020cmo#$';

export default function AuthForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiClient.signIn(VALID_EMAIL, VALID_PASSWORD);
      window.location.reload();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-8">
            <div className="bg-black rounded-lg p-4">
              <img src="/LOGO 8020.png" alt="Hospital CMO" className="h-24 w-auto" />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">
            Entrar no Sistema
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              {loading ? 'Carregando...' : 'Entrar no Sistema'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

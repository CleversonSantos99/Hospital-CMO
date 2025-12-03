import { useState } from 'react';
import { supabase } from '../lib/supabase';
import TableEditor from './TableEditor';
import { Users, Calendar, LogOut, Database, Stethoscope, Wrench } from 'lucide-react';

type TabType = 'especialidade' | 'procedimentos';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('especialidade');

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const especialidadeColumns = [
    { key: 'especialidade', label: 'Especialidade', type: 'text' as const },
    { key: 'valor_particular', label: 'Valor Particular', type: 'text' as const },
    { key: 'valor_cartao_cmo', label: 'Valor Cartão CMO', type: 'text' as const },
    { key: 'valor_pax_vida', label: 'Valor Pax Vida', type: 'text' as const },
    { key: 'conveniados', label: 'Conveniados', type: 'text' as const },
    { key: 'profissional', label: 'Profissional', type: 'text' as const },
    { key: 'registro', label: 'Registro', type: 'text' as const },
    { key: 'atendimento', label: 'Atendimento', type: 'text' as const },
    { key: 'convenio', label: 'Convênio', type: 'text' as const },
    { key: 'observacoes', label: 'Observações', type: 'text' as const },
    { key: 'tipo', label: 'Tipo', type: 'text' as const },
  ];

  const procedimentosColumns = [
    { key: 'procedimento', label: 'Procedimento', type: 'text' as const },
    { key: 'valor_particular', label: 'Valor Particular', type: 'text' as const },
    { key: 'valor_cartao_cmo', label: 'Valor Cartão CMO', type: 'text' as const },
    { key: 'valor_pax_vida', label: 'Valor Pax Vida', type: 'text' as const },
    { key: 'atendimento', label: 'Atendimento', type: 'text' as const },
    { key: 'convenio', label: 'Convênio', type: 'text' as const },
    { key: 'observacoes', label: 'Observações', type: 'text' as const },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="bg-black rounded-lg p-2">
              <img src="/LOGO 8020.png" alt="Hospital CMO" className="h-20 w-20" />
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex gap-8">
              <button
                onClick={() => setActiveTab('especialidade')}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'especialidade'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Stethoscope className="w-5 h-5" />
                Especialidades
              </button>
              <button
                onClick={() => setActiveTab('procedimentos')}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'procedimentos'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Wrench className="w-5 h-5" />
                Procedimentos
              </button>
            </nav>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {activeTab === 'especialidade' && (
              <TableEditor tableName="especialidade" columns={especialidadeColumns} />
            )}
            {activeTab === 'procedimentos' && (
              <TableEditor tableName="procedimentos" columns={procedimentosColumns} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

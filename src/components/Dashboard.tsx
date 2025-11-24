import { useState } from 'react';
import { supabase } from '../lib/supabase';
import TableEditor from './TableEditor';
import { Users, Calendar, LogOut, Database } from 'lucide-react';

type TabType = 'patients' | 'appointments';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('patients');

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const patientsColumns = [
    { key: 'name', label: 'Nome', type: 'text' as const, required: true },
    { key: 'cpf', label: 'CPF', type: 'text' as const, required: true },
    { key: 'birth_date', label: 'Data Nascimento', type: 'date' as const, required: true },
    { key: 'phone', label: 'Telefone', type: 'text' as const, required: true },
    { key: 'email', label: 'Email', type: 'text' as const },
    { key: 'address', label: 'Endereço', type: 'text' as const },
    { key: 'created_at', label: 'Criado em', type: 'datetime' as const },
  ];

  const appointmentsColumns = [
    { key: 'doctor_name', label: 'Médico', type: 'text' as const, required: true },
    { key: 'specialty', label: 'Especialidade', type: 'text' as const, required: true },
    { key: 'appointment_date', label: 'Data Consulta', type: 'datetime' as const, required: true },
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: ['scheduled', 'completed', 'cancelled'],
      required: true
    },
    { key: 'notes', label: 'Observações', type: 'text' as const },
    { key: 'created_at', label: 'Criado em', type: 'datetime' as const },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Hospital CMO</h1>
                <p className="text-xs text-gray-500">Sistema de Gerenciamento</p>
              </div>
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
                onClick={() => setActiveTab('patients')}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'patients'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="w-5 h-5" />
                Pacientes
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'appointments'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Calendar className="w-5 h-5" />
                Consultas
              </button>
            </nav>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {activeTab === 'patients' && (
              <TableEditor tableName="patients" columns={patientsColumns} />
            )}
            {activeTab === 'appointments' && (
              <TableEditor tableName="appointments" columns={appointmentsColumns} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

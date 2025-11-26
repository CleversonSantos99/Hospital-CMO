import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Edit2, Save, X, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

type TableEditorProps = {
  tableName: 'especialidade' | 'procedimentos';
  columns: Array<{
    key: string;
    label: string;
    type: 'text' | 'date' | 'datetime' | 'select';
    options?: string[];
    required?: boolean;
  }>;
};

export default function TableEditor({ tableName, columns }: TableEditorProps) {
  const [data, setData] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [editingRow, setEditingRow] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setCurrentPage(0);
    fetchData(0);
  }, [tableName, pageSize]);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page: number) => {
    setLoading(true);
    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data: result, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .order('id', { ascending: true })
      .range(from, to);

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setData(result || []);
      setTotalCount(count || 0);
    }
    setLoading(false);
  };

  const handleEdit = (row: any) => {
    setEditingRow({ ...row });
  };

  const handleCancel = () => {
    setEditingRow(null);
  };

  const handleSave = async () => {
    if (!editingRow) return;

    const id = editingRow.id;
    const updateData = { ...editingRow };
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.updated_at;

    const { error } = await supabase
      .from(tableName)
      .update(updateData)
      .eq('id', id);

    if (error) {
      alert('Erro ao salvar: ' + error.message);
    } else {
      setEditingRow(null);
      fetchData(currentPage);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Tem certeza que deseja excluir este registro?')) return;

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) {
      alert('Erro ao excluir: ' + error.message);
    } else {
      fetchData(currentPage);
    }
  };

  const handleModalChange = (key: string, value: any) => {
    setEditingRow({ ...editingRow, [key]: value });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const renderModalField = (column: any) => {
    const value = editingRow?.[column.key];

    if (column.key === 'id') {
      return (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600">
          {value || 'N/A'}
        </div>
      );
    }

    if (column.type === 'select') {
      return (
        <select
          value={value || ''}
          onChange={(e) => handleModalChange(column.key, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
        >
          <option value="">Selecione...</option>
          {column.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={column.type}
        value={value || ''}
        onChange={(e) => handleModalChange(column.key, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
      />
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">Linhas por página:</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <span className="text-sm text-gray-500">Total: {totalCount} registros</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                {columns.map((col) => {
                  let value = row[col.key];
                  if (col.type === 'date' && value) {
                    value = new Date(value).toLocaleDateString('pt-BR');
                  } else if (col.type === 'datetime' && value) {
                    value = new Date(value).toLocaleString('pt-BR');
                  }
                  return (
                    <td key={col.key} className="px-4 py-3 text-sm text-gray-700">
                      {value || '-'}
                    </td>
                  );
                })}
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(row)}
                      disabled={editingRow !== null}
                      className="text-blue-600 hover:text-blue-700 p-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(row.id)}
                      disabled={editingRow !== null}
                      className="text-red-600 hover:text-red-700 p-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Nenhum registro encontrado
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Página {currentPage + 1} de {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {editingRow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Editar Registro</h2>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {columns.map((col) => (
                <div key={col.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {col.label}
                  </label>
                  {renderModalField(col)}
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition"
              >
                <Save className="w-4 h-4" />
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}